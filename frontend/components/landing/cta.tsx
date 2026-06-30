import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { DitheringShader } from "@/components/ui/dithering-shader";

export function CtaSection() {
  return (
    <section className="relative py-24 px-4 overflow-hidden bg-blue-700">
      <DitheringShader
        width={1920}
        height={400}
        colorBack="#1d4ed8"
        colorFront="#93c5fd"
        pxSize={4}
        speed={0.9}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      />
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <h2 className="text-4xl font-semibold tracking-tight text-white mb-4">
          Stop reformatting. Start publishing.
        </h2>
        <p className="text-blue-100 mb-10 text-lg">
          Your ideas are already good. SocialStudio.ai just makes them fit
          wherever they need to go.
        </p>
        <Link href="/dashboard">
          <Button
            size="lg"
            className="bg-white text-blue-600 hover:bg-blue-50 font-semibold"
          >
            Start Creating
            <ArrowRight size={18} className="ml-2" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
