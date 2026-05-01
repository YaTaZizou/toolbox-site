"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { AdBanner } from "@/components/AdBanner";
import { PremiumUpsellBanner } from "@/components/PremiumUpsellBanner";

const FORMATS = [
  { label: "MP3", value: "mp3", mime: "audio/mpeg", codec: ["-c:a", "libmp3lame", "-q:a", "2"] },
  { label: "WAV", value: "wav", mime: "audio/wav", codec: ["-c:a", "pcm_s16le"] },
  { label: "OGG", value: "ogg", mime: "audio/ogg", codec: ["-c:a", "libvorbis", "-q:a", "4"] },
  { label: "AAC", value: "aac", mime: "audio/aac", codec: ["-c:a", "aac", "-b:a", "192k"] },
  { label: "FLAC", value: "flac", mime: "audio/flac", codec: ["-c:a", "flac"] },
  { label: "OPUS", value: "opus", mime: "audio/opus", codec: ["-c:a", "libopus", "-b:a", "128k"] },
];

const QUALITIES = [
  { label: "Haute qualité", desc: "Meilleur son, fichier plus lourd", q: "0" },
  { label: "Standard", desc: "Bon compromis qualité/taille", q: "4" },
  { label: "Compression max", desc: "Fichier léger, qualité réduite", q: "9" },
];

export default function AudioPage() {
  const [file, setFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState("mp3");
  const [quality, setQuality] = useState(1);
  const [status, setStatus] = useState<"idle" | "loading" | "converting" | "done" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputSize, setOutputSize] = useState(0);
  const [log, setLog] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ffmpegRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFFmpeg = async () => {
    if (ffmpegRef.current) return ffmpegRef.current;
    const { FFmpeg } = await import("@ffmpeg/ffmpeg");
    const { fetchFile, toBlobURL } = await import("@ffmpeg/util");
    const ffmpeg = new FFmpeg();
    ffmpeg.on("log", ({ message }) => setLog(message));
    ffmpeg.on("progress", ({ progress: p }) => setProgress(Math.round(p * 100)));
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
    });
    ffmpegRef.current = ffmpeg;
    return ffmpeg;
  };

  const convert = useCallback(async () => {
    if (!file) return;
    setStatus("loading");
    setProgress(0);
    setOutputUrl(null);

    try {
      const ffmpeg = await loadFFmpeg();
      const { fetchFile } = await import("@ffmpeg/util");
      setStatus("converting");

      const ext = file.name.split(".").pop() || "mp3";
      const inputName = `input.${ext}`;
      const outputName = `output.${outputFormat}`;

      await ffmpeg.writeFile(inputName, await fetchFile(file));

      const fmt = FORMATS.find(f => f.value === outputFormat)!;
      const args = ["-i", inputName, ...fmt.codec, "-y", outputName];

      await ffmpeg.exec(args);

      const data = await ffmpeg.readFile(outputName);
      const blobPart = data instanceof Uint8Array ? data.buffer.slice(0) as ArrayBuffer : data as string;
      const blob = new Blob([blobPart], { type: fmt.mime });
      setOutputSize(blob.size);
      setOutputUrl(URL.createObjectURL(blob));
      setStatus("done");
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  }, [file, outputFormat, quality]);

  function formatSize(bytes: number) {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
    return `${(bytes / 1024 / 1024).toFixed(1)} Mo`;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm mb-8 inline-flex items-center gap-1 transition-colors">
        ← Retour
      </Link>

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">🎵</span>
          <h1 className="text-3xl font-bold">Convertisseur Audio</h1>
        </div>
        <p className="text-gray-400">Convertis tes fichiers audio en MP3, WAV, OGG, FLAC et plus encore.</p>
      </div>

      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files[0];
          if (f && f.type.startsWith("audio/")) { setFile(f); setStatus("idle"); setOutputUrl(null); }
        }}
        className="border-2 border-dashed border-gray-700 hover:border-gray-500 rounded-2xl p-10 text-center cursor-pointer transition-colors mb-4"
      >
        <input
          ref={inputRef}
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) { setFile(f); setStatus("idle"); setOutputUrl(null); }
          }}
        />
        {file ? (
          <div>
            <p className="text-4xl mb-2">🎵</p>
            <p className="text-white font-semibold">{file.name}</p>
            <p className="text-gray-500 text-sm mt-1">{formatSize(file.size)}</p>
          </div>
        ) : (
          <div>
            <p className="text-4xl mb-3">🎵</p>
            <p className="text-gray-300 font-medium">Glisse ton fichier audio ici</p>
            <p className="text-gray-600 text-sm mt-1">MP3, WAV, OGG, FLAC, AAC, M4A, OPUS...</p>
          </div>
        )}
      </div>

      {file && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-4 space-y-5">
          {/* Format */}
          <div>
            <p className="text-sm text-gray-400 mb-2">Format de sortie</p>
            <div className="flex flex-wrap gap-2">
              {FORMATS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setOutputFormat(f.value)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors ${
                    outputFormat === f.value
                      ? "bg-white text-black"
                      : "bg-gray-800 text-gray-400 hover:text-white"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Qualité (seulement pour MP3/OGG) */}
          {(outputFormat === "mp3" || outputFormat === "ogg") && (
            <div>
              <p className="text-sm text-gray-400 mb-2">Qualité</p>
              <div className="space-y-2">
                {QUALITIES.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => setQuality(i)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-colors border ${
                      quality === i
                        ? "border-white bg-gray-800 text-white"
                        : "border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-500"
                    }`}
                  >
                    <span className="font-medium">{q.label}</span>
                    <span className="text-xs text-gray-500">{q.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {file && status !== "loading" && status !== "converting" && (
        <button
          onClick={convert}
          className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 rounded-xl transition-colors mb-4"
        >
          🎵 Convertir l&apos;audio
        </button>
      )}

      {/* Progression */}
      {(status === "loading" || status === "converting") && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-400">
              {status === "loading" ? "⏳ Chargement du convertisseur..." : `🔄 Conversion... ${progress}%`}
            </span>
            <span className="text-sm font-mono text-white">{progress}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${status === "loading" ? 5 : progress}%` }}
            />
          </div>
          {log && <p className="text-xs text-gray-600 mt-3 font-mono truncate">{log}</p>}
        </div>
      )}

      {status === "error" && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-4 text-red-400 text-sm">
          ❌ Une erreur est survenue. Vérifie que le fichier est un audio valide.
        </div>
      )}

      {/* Résultat */}
      {status === "done" && outputUrl && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-semibold">✅ Conversion terminée !</p>
              <p className="text-gray-500 text-sm mt-0.5">
                {formatSize(file!.size)} → {formatSize(outputSize)}
                {outputSize < file!.size && (
                  <span className="text-green-400 ml-2">
                    (-{Math.round((1 - outputSize / file!.size) * 100)}%)
                  </span>
                )}
              </p>
            </div>
            <a
              href={outputUrl}
              download={`toolbox-audio.${outputFormat}`}
              className="bg-white text-black font-semibold px-4 py-2 rounded-xl text-sm hover:bg-gray-100 transition-colors"
            >
              ⬇ Télécharger
            </a>
          </div>
          <audio src={outputUrl} controls className="w-full" />
        </div>
      )}

      <div className="mt-6 bg-purple-500/5 border border-purple-500/10 rounded-xl p-4 text-xs text-gray-500">
        <p className="font-medium text-gray-400 mb-1">ℹ️ Traitement 100% local</p>
        <p>Ton audio ne quitte jamais ton appareil. La conversion se fait dans ton navigateur via FFmpeg WebAssembly.</p>
      </div>
      <div className="mt-8" />
      <PremiumUpsellBanner />
      <AdBanner />
    </div>
  );
}
