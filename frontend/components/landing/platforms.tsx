import {
  InstagramLogo,
  LinkedinLogo,
  XLogo,
} from "@phosphor-icons/react/dist/ssr";
import type { ReactNode } from "react";

interface Platform {
  icon: ReactNode;
  badge: ReactNode;
  name: string;
  tagline: string;
  traits: string[];
  example: string;
}

const platforms: Platform[] = [
  {
    icon: <LinkedinLogo size={22} weight="fill" className="text-white" />,
    badge: (
      <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
        <LinkedinLogo size={22} weight="fill" className="text-white" />
      </div>
    ),
    name: "LinkedIn",
    tagline: "Professional · B2B · Thought leadership",
    traits: ["Value-driven hooks", "Paragraph breaks", "No hashtag spam", "First-person authority"],
    example:
      "Most teams waste 3 hours a week reformatting content. Here's how we cut that to 30 seconds…",
  },
  {
    icon: <InstagramLogo size={22} weight="fill" className="text-white" />,
    badge: (
      <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 flex items-center justify-center">
        <InstagramLogo size={22} weight="fill" className="text-white" />
      </div>
    ),
    name: "Instagram",
    tagline: "Visual · Lifestyle · Community",
    traits: ["Emoji-forward", "Short punchy sentences", "Hashtag block", "Relatable tone"],
    example:
      "Imagine spending 30 seconds on what used to take hours ✨ This changed everything for our team →",
  },
  {
    icon: <XLogo size={22} weight="fill" className="text-white" />,
    badge: (
      <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center">
        <XLogo size={22} weight="fill" className="text-white" />
      </div>
    ),
    name: "X (Twitter)",
    tagline: "Short-form · Trending · Direct",
    traits: ["Under 280 chars", "Strong opening hook", "No filler", "Conversational"],
    example: "We killed 3 hours of weekly busywork with one tool. Here's the breakdown:",
  },
];

export function Platforms() {
  return (
    <section className="bg-white py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3">
            supported platforms
          </p>
          <h2 className="text-4xl font-semibold tracking-tight text-gray-900">
            One idea. Three audiences. Zero extra work.
          </h2>
          <p className="mt-4 text-gray-500 max-w-xl mx-auto">
            Each platform has its own grammar. SocialStudio.ai speaks all three fluently.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {platforms.map((p) => (
            <div
              key={p.name}
              className="rounded-2xl border border-gray-100 bg-gray-50 p-6 flex flex-col gap-4"
            >
              <div className="flex items-center gap-3">
                {p.badge}
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{p.name}</div>
                  <div className="text-xs text-gray-400">{p.tagline}</div>
                </div>
              </div>

              <ul className="space-y-1.5">
                {p.traits.map((trait) => (
                  <li key={trait} className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="w-1 h-1 rounded-full bg-blue-400 flex-shrink-0" />
                    {trait}
                  </li>
                ))}
              </ul>

              <div className="mt-auto rounded-xl bg-white border border-gray-100 p-3">
                <p className="font-mono text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                  example output
                </p>
                <p className="text-sm text-gray-700 leading-relaxed italic">
                  "{p.example}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
