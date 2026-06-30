import {
  Brain,
  CheckCircle,
  Clock,
  Lightning,
} from "@phosphor-icons/react/dist/ssr";
import type { ReactNode } from "react";

interface Feature {
  icon: ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <Brain size={24} weight="fill" className="text-blue-600" />,
    title: "Platform-aware AI",
    description:
      "LinkedIn gets authoritative, value-driven copy. Instagram gets visual storytelling with hashtags. X gets punchy hooks under 280 characters. The AI knows the difference.",
  },
  {
    icon: <Lightning size={24} weight="fill" className="text-blue-600" />,
    title: "One generation, publish-ready",
    description:
      "No prompt engineering, no back-and-forth. Paste your content, pick the platform, and the output is finished — not a rough draft.",
  },
  {
    icon: <Clock size={24} weight="fill" className="text-blue-600" />,
    title: "Hours saved every week",
    description:
      "Content teams spend 3–5 hours per week manually reformatting the same ideas for different channels. SocialStudio.ai cuts that to seconds.",
  },
  {
    icon: <CheckCircle size={24} weight="fill" className="text-blue-600" />,
    title: "Consistent brand voice",
    description:
      "The tone adapts to the platform, not to the AI's mood. Your message stays coherent whether it goes out on LinkedIn or X.",
  },
];

export function Features() {
  return (
    <section className="bg-gray-50 py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3">
            features
          </p>
          <h2 className="text-4xl font-semibold tracking-tight text-gray-900">
            Built to eliminate the busywork.
          </h2>
          <p className="mt-4 text-gray-500 max-w-xl mx-auto">
            People who work with words drown in reformatting. SocialStudio.ai
            does the mechanical work so you can focus on the ideas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
