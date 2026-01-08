"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Stage = "idle" | "sealBroken" | "envelopeOpen" | "cardOut";

export default function HomePage() {
  const [stage, setStage] = useState<Stage>("idle");
  const [locked, setLocked] = useState(false);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [surname, setSurname] = useState("");
  const [cracking, setCracking] = useState(false);
  
  useEffect(() => {
    const isDev = process.env.NEXT_PUBLIC_DEV_MODE === "true";

    if (isDev) return; // 👈 geliştirmede kilidi atla

    const alreadyOpened = localStorage.getItem("invite_opened");
    if (alreadyOpened === "true") {
      setLocked(true);
    }
  }, []);


  useEffect(() => {
    if (stage === "cardOut") {
      localStorage.setItem("invite_opened", "true");
    }
  }, [stage]);
  const handleOpen = async () => {
    if (!name || !surname) return;

    setCracking(true);

    await fetch("/api/guest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, surname, note }),
    });

    setTimeout(() => {
      setCracking(false);
      setStage("sealBroken");
    }, 400);

    setTimeout(() => setStage("envelopeOpen"), 900);
    setTimeout(() => setStage("cardOut"), 1700);
  };
  if (locked) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#f6f2eb] px-4">
        <div className="text-center max-w-md">
          <p className="font-invite-body text-lg mb-6">
            Davetiyemizi okuduğunuz için teşekkür ederiz.
          </p>
          <p className="font-invite-body text-sm text-neutral-500">
            En özel günümüzde sizi aramızda görmekten mutluluk duyarız.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f6f2eb] px-4">
      {/* ZARF */}
      <div
        className="
          relative
          w-[420px] h-[300px]
          max-w-[92vw]
          perspective-[1200px]
          scale-[0.88]
          sm:scale-100
          origin-top
        "
      >


        {/* DAVETİYE KAĞIDI */}
        <AnimatePresence>
          {stage === "cardOut" && (
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: -40, opacity: 1 }}
              transition={{
                duration: 1.2,
                ease: "easeOut",
                staggerChildren: 0.12,
              }}
              className="absolute inset-x-8 top-12 bg-white shadow-xl p-10 text-center z-20 rounded-[8px]"
            >
              <motion.h2
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-invite-title text-4xl mb-6"
              >
                Betül & Mehmet Ali
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-invite-body text-lg leading-relaxed mb-6"
              >
                Sevgili {name} {surname}, <br />
                <span className="block mt-2">
                  🎉 Düğünümüze davetlisin 🎉
                </span>
                Hayatımızın en özel gününde,
                bu anlamlı anı sizinle paylaşmaktan
                mutluluk duyarız.
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-invite-body italic text-base mb-4"
              >
                9 Mayıs 2026 <br />
                Perla Kır Düğün Salonu · Denizli
              </motion.p>

              {note && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-invite-note italic mt-8"
                >
                  Bize Notun: “{note}”
                </motion.p>
              )}

              <button
                onClick={() => setLocked(true)}
                className="
                  mt-10
                  text-[11px]
                  tracking-[0.25em]
                  uppercase
                  text-neutral-400
                  hover:text-neutral-600
                  transition
                "
              >
                Davetiyeden Çık
              </button>

            </motion.div>
          )}
        </AnimatePresence>

        {/* ZARF GÖVDESİ */}
        <motion.div
          className="absolute inset-0 bg-[#f3efe7] border border-[#e2dccf] z-10"
          initial={{
            boxShadow: "0 6px 12px rgba(0,0,0,0.08)",
          }}
          animate={{
            boxShadow:
              stage === "idle"
                ? "0 6px 12px rgba(0,0,0,0.08)"
                : "0 22px 42px rgba(0,0,0,0.12)",
          }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
        />

        {/* ZARF KAPAĞI */}
        <motion.div
          className="absolute top-0 left-0 w-0 h-0
            border-l-[180px] border-r-[180px] border-t-[120px]
            sm:border-l-[210px] sm:border-r-[210px] sm:border-t-[140px]
            border-l-transparent border-r-transparent border-t-[#ede7dc]
            origin-top-center z-30"
          animate={{
            rotateX:
              stage === "envelopeOpen" || stage === "cardOut" ? -180 : 0,
          }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          style={{
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        />

        {/* MÜHÜR */}
        <AnimatePresence>
          {stage === "idle" && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center z-40 translate-y-4"
              initial={{ scale: 1, rotate: 0 }}
              animate={{
                scale: cracking ? [1, 1.06, 0.97, 1.03, 1] : 1,
                rotate: cracking ? [0, -2, 2, -1.5, 1.5, 0] : 0,
              }}
              exit={{ scale: 0, rotate: 45, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative w-[150px] h-[150px] rounded-full bg-[#8b1e1e] shadow-inner flex flex-col items-center justify-start pt-4 gap-2 px-4">

                {/* IŞIK PARLAMASI */}
                <AnimatePresence>
                  {cracking && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-white/20"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.35 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    />
                  )}
                </AnimatePresence>

                {/* ÇATLAK */}
                <AnimatePresence>
                  {cracking && (
                    <motion.svg
                      viewBox="0 0 100 100"
                      className="absolute inset-0 w-full h-full pointer-events-none z-50"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.9 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <path
                        d="M50 10
                          L48 28
                          L55 42
                          L47 60
                          L53 78
                          L50 90"
                        stroke="#f5e6e6"
                        strokeWidth="1.3"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </motion.svg>
                  )}
                </AnimatePresence>

                {/* INPUTLAR */}
                <input
                  placeholder="Ad"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="
                    w-full bg-transparent text-center
                    text-[13px] italic
                    text-[#fdf6f6]
                    placeholder-[#f1dada]
                    border-b border-[#f1dada]/40
                    focus:outline-none
                    pb-0.5
                  "
                />
                <input
                  placeholder="Soyad"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  className="
                    w-full bg-transparent text-center
                    text-[13px] italic
                    text-[#fdf6f6]
                    placeholder-[#f1dada]
                    border-b border-[#f1dada]/40
                    focus:outline-none
                    pb-0.5
                  "
                />
                <input
                  placeholder="Notunuz"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="
                    w-full bg-transparent text-center
                    text-[11px] italic
                    text-[#f8eaea]
                    placeholder-[#f3dede]
                    border-b border-[#f3dede]/30
                    focus:outline-none
                    pb-0.5
                  "
                 />

                <button
                  onClick={handleOpen}
                  className="
                    mt-4
                    text-[9px]
                    tracking-[0.3em]
                    uppercase
                    text-[#fbeaea]/80
                  "
                >
                  Mührü Kır
                </button>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
