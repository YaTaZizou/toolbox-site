"use client";

import { useState } from "react";
import Link from "next/link";

const WORDS = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim est laborum curabitur pretium tincidunt lacus nulla gravida orci aliquet vulputate venenatis leo praesent nibh metus".split(" ");

function randomParagraph(sentences = 5): string {
  return Array.from({ length: sentences }, () => {
    const len = 8 + Math.floor(Math.random() * 10);
    const words = Array.from({ length: len }, () => WORDS[Math.floor(Math.random() * WORDS.length)]);
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    return words.join(" ") + ".";
  }).join(" ");
}

function generate(count: number, type: "paragraphes" | "phrases" | "mots"): string {
  if (type === "mots") {
    return Array.from({ length: count }, () => WORDS[Math.floor(Math.random() * WORDS.length)]).join(" ");
  }
  if (type === "phrases") {
    return randomParagraph(count);
  }
  return Array.from({ length: count }, () => randomParagraph()).join("\n\n");
}

export default function LoremPage() {
  const [count, setCount] = useState(3);
  const [type, setType] = useState<"paragraphes" | "phrases" | "mots">("paragraphes");
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  function generate_() {
    let text = generate(count, type);
    if (startWithLorem && type === "paragraphes") {
      text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\n" + (count > 1 ? text.split("\n\n").slice(1).join("\n\n") : "");
    }
    setOutput(text.trim());
  }

  function copy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm mb-8 inline-flex items-center gap-1 transition-colors">← Retour</Link>
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">📄</span>
          <h1 className="text-3xl font-bold">Générateur Lorem Ipsum</h1>
        </div>
        <p className="text-gray-400">Génère du texte de remplissage pour tes maquettes et designs.</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-4 space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {(["paragraphes", "phrases", "mots"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`py-2 rounded-xl text-sm font-medium transition-colors capitalize ${
                type === t ? "bg-gray-100 text-black" : "bg-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <label className="text-gray-400">Quantité</label>
            <span className="text-white font-medium">{count} {type}</span>
          </div>
          <input
            type="range"
            min={1}
            max={type === "mots" ? 200 : type === "phrases" ? 20 : 10}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full accent-gray-400"
          />
        </div>

        {type === "paragraphes" && (
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">Commencer par &ldquo;Lorem ipsum...&rdquo;</span>
            <button
              onClick={() => setStartWithLorem(!startWithLorem)}
              className={`w-12 h-6 rounded-full transition-colors relative ${startWithLorem ? "bg-gray-400" : "bg-gray-700"}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${startWithLorem ? "left-6" : "left-0.5"}`} />
            </button>
          </div>
        )}
      </div>

      <button
        onClick={generate_}
        className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-xl transition-colors mb-4"
      >
        📄 Générer
      </button>

      {output && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs text-gray-500">{output.split(/\s+/).filter(Boolean).length} mots</span>
            <button onClick={copy} className="text-xs text-gray-500 hover:text-white transition-colors">
              {copied ? "✓ Copié !" : "📋 Copier"}
            </button>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{output}</p>
        </div>
      )}
    </div>
  );
}
