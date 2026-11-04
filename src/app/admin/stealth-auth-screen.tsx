"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Loader2, Lock, ShieldCheck, Terminal } from "lucide-react";
import { toast } from "sonner";
import { KineticTilt } from "@/components/motion/kinetic-tilt";
import { ArchitecturalSpotlightLayer } from "@/components/motion/architectural-spotlight";
import { ScrambleText } from "@/components/motion/scramble-text";
import { BrandLogo } from "@/components/brand-logo";

interface Props {
  secretKey?: string;
}

export function StealthAuthScreen({ secretKey }: Props) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!password && !secretKey) return;
    setLoading(true);
    setAuthError(false);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, secretKey }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        toast.error("Access Denied: Invalid credentials.");
        setLoading(false);
        setAuthError(true);
        return;
      }

      toast.success("Identity verified. Opening control deck...");
      router.push("/admin");
      router.refresh();
    } catch {
      toast.error("Connection failed.");
      setLoading(false);
      setAuthError(true);
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background p-4 text-foreground">
      {/* Subtle architectural background coordinate grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          x: authError ? [0, -8, 8, -5, 5, 0] : 0,
        }}
        transition={{ duration: 0.42, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="relative z-10 w-full max-w-md"
      >
        <KineticTilt maxDegrees={2.5}>
          <div
            data-spotlight-card
            className="relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-xl sm:p-8"
          >
            <ArchitecturalSpotlightLayer />

            {/* Animated Laser Scan Sweep while authenticating */}
            <AnimatePresence>
              {loading ? (
                <motion.div
                  key="auth-scan-line"
                  initial={{ top: "0%" }}
                  animate={{ top: "100%" }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.95, repeat: Infinity, ease: "linear" }}
                  className="pointer-events-none absolute inset-x-0 z-20 h-[2px] bg-accent-blue shadow-[0_0_12px_rgba(37,99,235,0.5)]"
                />
              ) : null}
            </AnimatePresence>

            {/* 4 Corner CAD Registration Crosshairs */}
            <span className="pointer-events-none absolute top-2.5 left-2.5 font-mono text-[10px] text-accent-blue opacity-70">
              +
            </span>
            <span className="pointer-events-none absolute top-2.5 right-2.5 font-mono text-[10px] text-accent-blue opacity-70">
              +
            </span>
            <span className="pointer-events-none absolute bottom-2.5 left-2.5 font-mono text-[10px] text-accent-blue opacity-70">
              +
            </span>
            <span className="pointer-events-none absolute right-2.5 bottom-2.5 font-mono text-[10px] text-accent-blue opacity-70">
              +
            </span>

            {/* Top Telemetry Status Strip */}
            <div className="relative z-10 mb-4 flex items-center justify-between border-b border-border/70 pb-2.5 font-mono text-[10px] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Terminal className="h-3 w-3 text-accent-blue" />
                <span>{"VAULT_NODE // TLS_1.3"}</span>
              </span>
              <span className="text-accent-blue">STEALTH_GATE_ACTIVE</span>
            </div>

            {/* Monogram & Label */}
            <div className="relative z-10 mb-6 flex items-center justify-between border-b border-border pb-5">
              <div className="flex items-center gap-3">
                <BrandLogo size="md" />
                <div>
                  <p className="label-mono text-muted-foreground">
                    <ScrambleText text="Admin Access" />
                  </p>
                  <p className="text-xs font-medium text-foreground">Mission Control</p>
                </div>
              </div>
              <span className="label-mono inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-emerald-600 dark:text-emerald-400">
                <span className="animate-availability h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <ScrambleText text="SECURE" />
              </span>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.32 }}
              className="relative z-10 mb-6 space-y-1.5"
            >
              <h1 className="text-xl font-semibold tracking-tight text-foreground">
                Authenticate to continue
              </h1>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Enter your configured master passphrase to unlock the portfolio control deck.
              </p>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.32 }}
              onSubmit={handleLogin}
              className="relative z-10 space-y-4"
            >
              <div>
                <label className="label-mono mb-2 flex items-center justify-between text-muted-foreground">
                  <span>Master Passphrase</span>
                  <span className="text-[9px] text-accent-blue">SHA-256 HMAC</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter passphrase..."
                  autoFocus
                  disabled={loading}
                  className="w-full rounded-md border border-input bg-background px-3.5 py-2.5 font-mono text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-50"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="font-mono text-xs uppercase tracking-wider">
                      Verifying Signature...
                    </span>
                  </>
                ) : (
                  <>
                    <span>Enter Control Deck</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </motion.form>

            <div className="relative z-10 mt-8 border-t border-border pt-4 flex items-center justify-between text-[11px] font-mono text-muted-foreground/75">
              <div className="inline-flex items-center gap-1.5">
                <Lock className="h-3 w-3 text-accent-blue" />
                <span>HttpOnly Session Guard</span>
              </div>
              <div className="inline-flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span>7D TTL</span>
              </div>
            </div>
          </div>
        </KineticTilt>
      </motion.div>
    </div>
  );
}
