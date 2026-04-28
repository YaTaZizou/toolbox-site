"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

const FORMATS = ["mp4", "webm", "mov", "avi", "mkv", "gif"];

const QUALITIES = [
  { label: "Haute qualité", value: "18", desc: "Meilleure qualité, fichier plus lourd" },
  { label: "Équilibrée", value: "28", desc: "Bon compromis qualité/taille" },
  { label: "Compression max", value: "40", desc: "Fichier léger, qualité réduite" },
];

export default function VideoPage() {
  const [file, setFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState("mp4");
  const [quality, setQuality] = useState("28");
  const [status, setStatus] = useState<"idle" | "loading" | "converting" | "done" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputSize, setOutputSize] = useState<number>(0);
  const [log, setLog] = useState("");
  const ffmpegRef = useRef<FFmpeg | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFFmpeg = async () => {
    if (ffmpegRef.current) return ffmpegRef.current;
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
    setLog("");

    try {
      const ffmpeg = await loadFFmpeg();
      setStatus("converting");

      const inputExt = file.name.split(".").pop() || "mp4";
      const inputName = `input.${inputExt}`;
      const outputName = `output.${outputFormat}`;

      await ffmpeg.writeFile(inputName, await fetchFile(file));

      const args: string[] = ["-i", inputName];

      if (outputFormat === "gif") {
        args.push("-vf", "fps=10,scale=480:-1:flags=lanczos", "-loop", "0");
      } else {
        args.push("-crf", quality, "-preset", "fast");
        if (outputFormat === "webm") {
          args.push("-c:v", "libvpx-vp9", "-c:a", "libopus");
        } else if (outputFormat === "mp4" || outputFormat === "mov" || outputFormat === "mkv") {
          args.push("-c:v", "libx264", "-c:a", "aac");
        }
      }

      args.push("-y", outputName);
      await ffmpeg.exec(args);

      const data = await ffmpeg.readFile(outputName);
      const blobPart = data instanceof Uint8Array ? data.buffer.slice(0) as ArrayBuffer : data as string;
      const blob = new Blob([blobPart], {
        type: outputFormat === "gif" ? "image/gif" : "video/mp4",
      });
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

  const inputExt = file?.name.split(".").pop()?.toLowerCase();

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm mb-8 inline-flex items-center gap-1 transition-colors">
        ← Retour
      </Link>

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">🎬</span>
          <h1 className="text-3xl font-bold">Convertisseur Vidéo</h1>
        </div>
        <p className="text-gray-400">Convertis et compresse tes vidéos directement dans le navigateur.</p>
      </div>

      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files[0];
          if (f && f.type.startsWith("video/")) { setFile(f); setStatus("idle"); setOutputUrl(null); }
        }}
        className="border-2 border-dashed border-gray-700 hover:border-gray-500 rounded-2xl p-10 text-center cursor-pointer transition-colors mb-4"
      >
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) { setFile(f); setStatus("idle"); setOutputUrl(null); }
          }}
        />
        {file ? (
          <div>
            <p className="text-white font-semibold">{file.name}</p>
            <p className="text-gray-500 text-sm mt-1">{formatSize(file.size)}</p>
          </div>
        ) : (
          <div>
            <p className="text-4xl mb-3">🎬</p>
            <p className="text-gray-300 font-medium">Glisse ta vidéo ici</p>
            <p className="text-gray-600 text-sm mt-1">MP4, WebM, MOV, AVI, MKV...</p>
          </div>
        )}
      </div>

      {file && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-4 space-y-5">
          {/* Format de sortie */}
          <div>
            <p className="text-sm text-gray-400 mb-2">Format de sortie</p>
            <div className="flex flex-wrap gap-2">
              {FORMATS.map((f) => (
                <button
                  key={f}
                  onClick={() => setOutputFormat(f)}
                  disabled={f === inputExt}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium uppercase transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                    outputFormat === f ? "bg-white text-black" : "bg-gray-800 text-gray-400 hover:text-white"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Qualité */}
          {outputFormat !== "gif" && (
            <div>
              <p className="text-sm text-gray-400 mb-2">Qualité / Compression</p>
              <div className="space-y-2">
                {QUALITIES.map((q) => (
                  <button
                    key={q.value}
                    onClick={() => setQuality(q.value)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-colors border ${
                      quality === q.value
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
          className="w-full bg-orange-500 hover:bg-orange-400 text-white font-semibold py-3 rounded-xl transition-colors mb-4"
        >
          🎬 Convertir la vidéo
        </button>
      )}

      {/* Progress */}
      {(status === "loading" || status === "converting") && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-400">
              {status === "loading" ? "⏳ Chargement du convertisseur..." : `🔄 Conversion en cours... ${progress}%`}
            </span>
            <span className="text-sm font-mono text-white">{progress}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${status === "loading" ? 5 : progress}%` }}
            />
          </div>
          {log && (
            <p className="text-xs text-gray-600 mt-3 font-mono truncate">{log}</p>
          )}
        </div>
      )}

      {status === "error" && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-4 text-red-400 text-sm">
          ❌ Une erreur est survenue. Vérifie que le fichier est une vidéo valide.
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
              download={`toolbox-video.${outputFormat}`}
              className="bg-white text-black font-semibold px-4 py-2 rounded-xl text-sm hover:bg-gray-100 transition-colors"
            >
              ⬇ Télécharger
            </a>
          </div>

          {outputFormat !== "gif" && (
            <video
              src={outputUrl}
              controls
              className="w-full rounded-xl max-h-64 bg-black"
            />
          )}
          {outputFormat === "gif" && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={outputUrl} alt="GIF converti" className="w-full rounded-xl" />
          )}
        </div>
      )}

      <div className="mt-6 bg-blue-500/5 border border-blue-500/10 rounded-xl p-4 text-xs text-gray-500">
        <p className="font-medium text-gray-400 mb-1">ℹ️ Traitement 100% local</p>
        <p>Ta vidéo ne quitte jamais ton appareil. La conversion se fait entièrement dans ton navigateur grâce à FFmpeg WebAssembly. Le premier chargement peut prendre quelques secondes.</p>
      </div>
    </div>
  );
}
