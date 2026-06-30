import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <Image
          src="/socialstudio.png"
          alt="socialstudio.ai"
          width={99}
          height={32}
        />
        <p className="text-xs text-gray-400 font-mono">
          © {new Date().getFullYear()} socialstudio.ai — ai-powered content repurposing.
        </p>
      </div>
    </footer>
  );
}
