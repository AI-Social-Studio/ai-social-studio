from anthropic import AsyncAnthropic

from app.application.ports import ContentGenerator
from app.application.prompts.platform_prompts import SYSTEM_PROMPT, build_generate_prompt
from app.application.prompts.refine_prompts import (
    REFINE_SYSTEM_PROMPT,
    build_refine_prompt,
)
from app.domain.entities import GeneratedPost
from app.domain.exceptions import ContentGenerationError, RefineError
from app.domain.value_objects import Platform, RefineAction
from app.infrastructure.ai.output import PostOutput, clamp_platform_text


class AnthropicContentGenerator(ContentGenerator):
    def __init__(
        self,
        api_key: str,
        model: str,
        max_tokens: int,
        temperature: float,
    ) -> None:
        if not api_key:
            raise ContentGenerationError(platform="*", reason="ANTHROPIC_API_KEY is not configured")
        self._client = AsyncAnthropic(api_key=api_key)
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
            response = await self._client.messages.parse(
                model=self._model,
                max_tokens=self._max_tokens,
                temperature=self._temperature,
                system=system,
                messages=[{"role": "user", "content": user}],
                output_format=PostOutput,
            )
        except Exception as exc:
            raise on_error(str(exc)) from exc

        parsed = response.parsed_output
        if parsed is None or not parsed.text.strip():
            raise on_error("Model returned empty text")
        return parsed.text.strip()
