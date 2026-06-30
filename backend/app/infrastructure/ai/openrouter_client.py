import httpx

from app.application.ports import ContentGenerator
from app.application.prompts.platform_prompts import SYSTEM_PROMPT, build_generate_prompt
from app.application.prompts.refine_prompts import (
    REFINE_SYSTEM_PROMPT,
    build_refine_prompt,
)
from app.domain.entities import GeneratedPost
from app.domain.exceptions import ContentGenerationError, RefineError
from app.domain.value_objects import Platform, RefineAction
from app.infrastructure.ai.output import clamp_platform_text, parse_post_output


class OpenRouterContentGenerator(ContentGenerator):
    def __init__(
        self,
        api_key: str,
        model: str,
        max_tokens: int,
        temperature: float,
        site_url: str,
        app_name: str,
    ) -> None:
        if not api_key:
            raise ContentGenerationError(platform="*", reason="OPENROUTER_API_KEY is not configured")
        self._client = httpx.AsyncClient(
            base_url="https://openrouter.ai/api/v1",
            timeout=60,
            headers={
                "Authorization": f"Bearer {api_key}",
                "HTTP-Referer": site_url,
                "X-Title": app_name,
            },
        )
        self._model = model
        self._max_tokens = max_tokens
        self._temperature = temperature

    async def generate(
        self,
        platform: Platform,
        raw_text: str,
        image_urls: list[str],
    ) -> GeneratedPost:
        text = await self._call(
            system=SYSTEM_PROMPT,
            user=build_generate_prompt(raw_text, image_urls, platform),
            on_error=lambda reason: ContentGenerationError(platform=platform.value, reason=reason),
        )
        return GeneratedPost(platform=platform, text=clamp_platform_text(platform, text))

    async def refine(
        self,
        platform: Platform,
        text: str,
        action: RefineAction,
    ) -> GeneratedPost:
        result = await self._call(
            system=REFINE_SYSTEM_PROMPT,
            user=build_refine_prompt(platform, text, action),
            on_error=lambda reason: RefineError(
                platform=platform.value, action=action.value, reason=reason
            ),
        )
        return GeneratedPost(platform=platform, text=clamp_platform_text(platform, result))

    async def _call(self, system: str, user: str, on_error) -> str:
        try:
            response = await self._client.post(
                "/chat/completions",
                json={
                    "model": self._model,
                    "max_tokens": self._max_tokens,
                    "temperature": self._temperature,
                    "response_format": {"type": "json_object"},
                    "messages": [
                        {"role": "system", "content": system},
                        {"role": "user", "content": user},
                    ],
                },
            )
            if response.is_error:
                raise RuntimeError(f"OpenRouter {response.status_code}: {response.text[:500]}")
            data = response.json()
            raw = data["choices"][0]["message"]["content"]
            parsed = parse_post_output(raw)
        except Exception as exc:
            raise on_error(str(exc)) from exc

        if not parsed.text.strip():
            raise on_error("Model returned empty text")
        return parsed.text.strip()
