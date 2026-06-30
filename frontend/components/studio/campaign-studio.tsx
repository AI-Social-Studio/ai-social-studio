"use client";

import { useRef, useState } from "react";
import {
  Check,
  CheckCircle,
  Copy,
  Hash,
  Megaphone,
  Plus,
  Scissors,
  SmileyWink,
  Sparkle,
  TextAa,
} from "@phosphor-icons/react/dist/ssr";
import { AssetThumb } from "@/components/ui/asset-thumb";
import { PlatformIconBadge } from "@/components/ui/platform-icon-badge";
import { StepHeader } from "@/components/ui/step-header";
import { PlatformPreview } from "./platform-preview";
import {
  PLATFORM_META,
  PLATFORM_ORDER,
  type Platform,
  type RefineAction,
} from "./content-engine";
import {
  generatePosts,
  getApiErrorMessage,
  refinePost,
  uploadFiles,
  type UploadedFile,
} from "@/lib/flowforge-api";

const DEMO_IMAGE: Record<Platform, string | undefined> = {
  linkedin:
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=640&q=80",
  instagram:
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=640&q=80",
  x: undefined,
};

type AssetPreview =
  | { kind: "image"; src: string; alt: string; objectPosition?: "top" | "center"; fileId?: string }
  | { kind: "meme"; label: string };

type Toast = {
  id: number;
  tone: "success" | "error" | "info";
  message: string;
};

const INITIAL_ASSETS: AssetPreview[] = [
  {
    kind: "image",
    src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80",
    alt: "Code snippet",
  },
  {
    kind: "image",
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    alt: "Developer selfie",
    objectPosition: "top",
  },
  {
    kind: "image",
    src: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
    alt: "Pizza photo",
  },
  { kind: "meme", label: "meme.jpg" },
];

const REFINE_ACTIONS: {
  action: RefineAction;
  label: string;
  icon: React.ReactNode;
}[] = [
  { action: "hook", label: "Zmień Hook", icon: <Sparkle size={13} weight="bold" /> },
  { action: "shorten", label: "Skróć", icon: <Scissors size={13} weight="bold" /> },
  {
    action: "formal",
    label: "Bardziej formalnie",
    icon: <TextAa size={13} weight="bold" />,
  },
  {
    action: "casual",
    label: "Luźniej",
    icon: <SmileyWink size={13} weight="bold" />,
  },
  { action: "cta", label: "Dodaj CTA", icon: <Megaphone size={13} weight="bold" /> },
  { action: "hashtags", label: "Hashtagi", icon: <Hash size={13} weight="bold" /> },
];

export function CampaignStudio() {
  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const [raw, setRaw] = useState(
    "robiłem apkę całą noc, błędy w kodzie, zjadłem pizzę, fajne uczucie",
  );
  const [selected, setSelected] = useState<Record<Platform, boolean>>({
    linkedin: true,
    instagram: true,
    x: false,
  });
  const [results, setResults] = useState<Partial<Record<Platform, string>>>({});
  const [copied, setCopied] = useState<Platform | null>(null);
  const [assets, setAssets] = useState<AssetPreview[]>(INITIAL_ASSETS);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [refining, setRefining] = useState<Partial<Record<Platform, boolean>>>({});
  const [toasts, setToasts] = useState<Toast[]>([]);

  const anySelected = PLATFORM_ORDER.some((platform) => selected[platform]);
  const activePlatforms = PLATFORM_ORDER.filter((platform) => selected[platform]);

  function togglePlatform(platform: Platform) {
    setSelected((prev) => ({ ...prev, [platform]: !prev[platform] }));
  }

  function pushToast(tone: Toast["tone"], message: string) {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, tone, message }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4500);
  }

  async function applyRefine(platform: Platform, action: RefineAction) {
    const current = results[platform];
    if (!current) {
      pushToast("info", "Najpierw wygeneruj treść posta.");
      return;
    }

    setRefining((prev) => ({ ...prev, [platform]: true }));
    try {
      const response = await refinePost({ platform, text: current, action });
      setResults((prev) => ({ ...prev, [platform]: response.text }));
      pushToast("success", "Treść została dopracowana.");
    } catch (error) {
      pushToast("error", getApiErrorMessage(error));
    } finally {
      setRefining((prev) => ({ ...prev, [platform]: false }));
    }
  }

  async function createContent() {
    if (!anySelected) {
      pushToast("info", "Wybierz przynajmniej jedną platformę.");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await generatePosts({
        raw,
        platforms: activePlatforms,
        file_ids: uploadedFiles.map((file) => file.id),
      });
      setResults(response.posts);
      const generatedCount = Object.keys(response.posts).length;
      if (generatedCount > 0) pushToast("success", `Wygenerowano ${generatedCount} posty.`);
      for (const [platform, message] of Object.entries(response.errors)) {
        if (message) pushToast("error", `${PLATFORM_META[platform as Platform].name}: ${message}`);
      }
      if (generatedCount === 0 && Object.keys(response.errors).length === 0) {
        pushToast("error", "Backend nie zwrócił żadnej treści.");
      }
    } catch (error) {
      pushToast("error", getApiErrorMessage(error));
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleUpload(files: FileList | null) {
    const nextFiles = Array.from(files ?? []);
    if (nextFiles.length === 0) return;

    setIsUploading(true);
    try {
      const response = await uploadFiles(nextFiles);
      setUploadedFiles((prev) => [...prev, ...response.files]);
      setAssets((prev) => [
        ...response.files.map((file) => ({
          kind: "image" as const,
          src: file.url,
          alt: file.filename,
          fileId: file.id,
        })),
        ...prev,
      ]);
      pushToast("success", `Dodano ${response.files.length} pliki.`);
    } catch (error) {
      pushToast("error", getApiErrorMessage(error));
    } finally {
      setIsUploading(false);
      if (uploadInputRef.current) uploadInputRef.current.value = "";
    }
  }

  async function copyPost(platform: Platform) {
    const text = results[platform];
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(platform);
    pushToast("success", "Post skopiowany do schowka.");
    window.setTimeout(() => setCopied(null), 1500);
  }

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">New AI Campaign</h1>
        <p className="text-sm text-gray-500">
          Wrzuć surowe myśli i materiały. AI samo wyciąga rdzeń przekazu i pisze
          pod każdą wybraną platformę.
        </p>
      </div>

      <div>
        <StepHeader marker="1" title="Target Lock" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLATFORM_ORDER.map((platform) => {
            const meta = PLATFORM_META[platform];
            const isOn = selected[platform];
            return (
              <button
                key={platform}
                type="button"
                onClick={() => togglePlatform(platform)}
                className={`text-left bg-white rounded-xl p-5 shadow-sm relative transition-opacity ${
                  isOn
                    ? "border-2 border-blue-600"
                    : "border border-gray-200 opacity-60 hover:opacity-100"
                }`}
              >
                {isOn ? (
                  <div className="absolute top-4 right-4 text-blue-600">
                    <CheckCircle size={20} weight="fill" />
                  </div>
                ) : null}
                <div className="mb-4">
                  <PlatformIconBadge platform={platform} size="md" />
                </div>
                <div className="text-sm font-semibold text-gray-900">
                  {meta.name}
                </div>
                <div className="text-xs text-gray-500 mt-1">{meta.subtitle}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <StepHeader marker="2" title="The Brain Dump" />
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label
              htmlFor="brain-dump-text"
              className="text-sm font-medium text-gray-700 mb-2"
            >
              Raw Thoughts
            </label>
            <textarea
              id="brain-dump-text"
              value={raw}
              onChange={(event) => setRaw(event.target.value)}
              className="w-full flex-1 min-h-[160px] bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
            />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Raw Media Assets (4)
              </span>
              <button
                type="button"
                onClick={() => uploadInputRef.current?.click()}
                disabled={isUploading}
                className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Plus size={12} /> {isUploading ? "Uploading" : "Upload"}
              </button>
              <input
                ref={uploadInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,image/heic,image/heif"
                multiple
                className="hidden"
                onChange={(event) => handleUpload(event.target.files)}
              />
            </div>
            <div className="flex-1 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 p-4 grid grid-cols-2 gap-3">
              {assets.slice(0, 4).map((asset, index) =>
                asset.kind === "image" ? (
                  <AssetThumb
                    key={asset.fileId ?? `${asset.src}-${index}`}
                    kind="image"
                    src={asset.src}
                    alt={asset.alt}
                    objectPosition={asset.objectPosition}
                  />
                ) : (
                  <AssetThumb key={`${asset.label}-${index}`} kind="meme" label={asset.label} />
                ),
              )}
            </div>
          </div>
        </div>
      </div>

      {anySelected ? (
        <div>
          <StepHeader marker="3" title="Platform Previews" />
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {activePlatforms.map((platform) => {
              const meta = PLATFORM_META[platform];
              const text = results[platform] ?? "";
              const length = text.length;
              const over = length > meta.limit;
              return (
                <div
                  key={platform}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col"
                >
                  <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
                    <PlatformIconBadge platform={platform} size="sm" weight="bold" />
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900">
                        {meta.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        Target: {meta.audience}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        over ? "text-red-500" : "text-gray-400"
                      }`}
                    >
                      {length} / {meta.limit}
                    </span>
                  </div>

                  <div className="p-5 flex justify-center bg-gray-50/40">
                    <PlatformPreview
                      platform={platform}
                      text={text}
                      image={DEMO_IMAGE[platform]}
                    />
                  </div>

                  <div className="px-5 py-3 border-t border-gray-100">
                    <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                      Quick Refine
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {REFINE_ACTIONS.map(({ action, label, icon }) => (
                        <button
                          key={action}
                          type="button"
                          onClick={() => applyRefine(platform, action)}
                          disabled={isGenerating || refining[platform]}
                          className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 disabled:pointer-events-none disabled:opacity-50"
                        >
                          {icon}
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="px-5 py-3 border-t border-gray-100 flex justify-end">
                    <button
                      type="button"
                      onClick={() => copyPost(platform)}
                      className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-gray-800"
                    >
                      {copied === platform ? (
                        <>
                          <Check size={14} weight="bold" /> Skopiowano
                        </>
                      ) : (
                        <>
                          <Copy size={14} weight="bold" /> Kopiuj
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={createContent}
            disabled={isGenerating}
            className="mt-6 w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 cursor-pointer disabled:pointer-events-none disabled:opacity-70"
          >
            <Sparkle size={16} weight="bold" />
            {isGenerating ? "Tworzę treść posta..." : "Utwórz treść posta"}
          </button>
        </div>
      ) : null}

      <div className="fixed bottom-4 right-4 z-50 flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-lg border px-4 py-3 text-sm font-medium shadow-lg ${
              toast.tone === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : toast.tone === "error"
                  ? "border-red-200 bg-red-50 text-red-800"
                  : "border-blue-200 bg-blue-50 text-blue-800"
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </>
  );
}
