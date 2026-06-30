import { ClipboardText, Note, Target } from "@phosphor-icons/react/dist/ssr";
import type { ReactNode } from "react";

interface Step {
  number: string;
  icon: ReactNode;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    number: "01",
    icon: <Note size={28} weight="fill" />,
    title: "Drop your raw content",
    description:
      "Paste notes, a blog draft, a transcript, bullet points — anything. No need to format it first.",
  },
  {
    number: "02",
    icon: <Target size={28} weight="fill" />,
    title: "Pick a platform",
    description:
      "Choose LinkedIn, Instagram, or X. The AI reads the platform rules and adjusts tone and structure automatically.",
  },
  {
    number: "03",
    icon: <ClipboardText size={28} weight="fill" />,
    title: "Copy and post",
    description:
      "Your finished, platform-native post is ready. One click copies it. No editing needed.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-white py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3">
            how it works
          </p>
          <h2 className="text-4xl font-semibold tracking-tight text-gray-900">
            From raw ideas to publish-ready in seconds.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-10 left-[calc(16.5%+1rem)] right-[calc(16.5%+1rem)] h-px bg-gray-200" />

          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                  {step.icon}
                </div>
                <span className="absolute -top-2 -right-2 font-mono text-xs font-bold text-blue-600 bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center">
                  {step.number}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
