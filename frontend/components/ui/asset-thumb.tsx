import Image from "next/image";
import { SmileyWink } from "@phosphor-icons/react/dist/ssr";

type ImageThumb = {
  kind: "image";
  src: string;
  alt: string;
  objectPosition?: "top" | "center";
};

type MemeThumb = {
  kind: "meme";
  label: string;
};

export function AssetThumb(props: ImageThumb | MemeThumb) {
  if (props.kind === "meme") {
    return (
      <div className="relative rounded-md overflow-hidden border border-gray-200 bg-yellow-100 flex items-center justify-center aspect-video">
        <SmileyWink size={28} weight="fill" className="text-yellow-500" />
        <span className="absolute bottom-1 left-1 bg-white/80 text-[9px] font-medium px-1.5 rounded text-gray-700">
          {props.label}
        </span>
      </div>
    );
  }

  const positionClass =
    props.objectPosition === "top" ? "object-cover object-top" : "object-cover";

  if (props.src.startsWith("blob:") || props.src.startsWith("http://localhost")) {
    return (
      <div className="relative rounded-md overflow-hidden border border-gray-200 aspect-video">
        <img src={props.src} alt={props.alt} className={`h-full w-full ${positionClass}`} />
      </div>
    );
  }

  return (
    <div className="relative rounded-md overflow-hidden border border-gray-200 aspect-video">
      <Image
        src={props.src}
        alt={props.alt}
        fill
        sizes="(max-width: 1024px) 50vw, 200px"
        className={positionClass}
      />
    </div>
  );
}
