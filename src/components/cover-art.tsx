import type { CoverVariant } from "@/lib/project-types";
import { cn } from "@/lib/utils";

/**
 * CoverArt — abstract, typographic compositions rendered as inline SVG.
 *
 * These are *designed covers*, deliberately not product screenshots:
 * this portfolio never fabricates imagery. Every variant is drawn with
 * thin strokes in the current text color, with a single restrained
 * accent element, so the set stays coherent across light and dark themes.
 */

interface CoverArtProps {
  variant: CoverVariant;
  name: string;
  className?: string;
}

const W = 400;
const H = 250;

function DotTexture() {
  const dots: { x: number; y: number }[] = [];
  for (let x = 24; x <= W - 16; x += 28) {
    for (let y = 24; y <= H - 40; y += 28) {
      dots.push({ x, y });
    }
  }
  return (
    <g stroke="currentColor" strokeWidth="1" opacity="0.08">
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r="1" fill="currentColor" stroke="none" />
      ))}
    </g>
  );
}

function CoverLabel({ name }: { name: string }) {
  return (
    <g>
      <line x1="24" y1={H - 34} x2="58" y2={H - 34} stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <text
        x="66"
        y={H - 30}
        fontSize="10"
        letterSpacing="2.4"
        fill="currentColor"
        opacity="0.55"
        style={{ fontFamily: "var(--font-geist-mono), monospace", textTransform: "uppercase" }}
      >
        {name.toUpperCase()}
      </text>
    </g>
  );
}

/* ── Variants ─────────────────────────────────────────────── */

function WindowVariant() {
  return (
    <g fill="none" stroke="currentColor" strokeWidth="1">
      <rect x="88" y="52" width="224" height="130" rx="6" opacity="0.5" />
      <line x1="88" y1="76" x2="312" y2="76" opacity="0.35" />
      <circle cx="102" cy="64" r="2.5" fill="currentColor" stroke="none" opacity="0.35" />
      <circle cx="112" cy="64" r="2.5" fill="currentColor" stroke="none" opacity="0.35" />
      <line x1="104" y1="92" x2="200" y2="92" opacity="0.3" />
      <line x1="104" y1="106" x2="240" y2="106" opacity="0.3" />
      <rect x="104" y="122" width="72" height="44" rx="4" className="text-accent-blue" stroke="currentColor" opacity="0.9" />
      <line x1="188" y1="122" x2="296" y2="122" opacity="0.3" />
      <line x1="188" y1="136" x2="280" y2="136" opacity="0.3" />
      <line x1="188" y1="150" x2="296" y2="150" opacity="0.3" />
      <line x1="188" y1="164" x2="260" y2="164" opacity="0.3" />
      <line x1="252" y1="92" x2="296" y2="92" className="text-accent-blue" stroke="currentColor" opacity="0.9" />
    </g>
  );
}

function RingsVariant() {
  return (
    <g fill="none" stroke="currentColor">
      <circle cx="200" cy="112" r="18" opacity="0.5" />
      <circle cx="200" cy="112" r="40" opacity="0.35" />
      <circle cx="200" cy="112" r="62" opacity="0.22" />
      <circle cx="200" cy="112" r="84" opacity="0.14" />
      <line x1="200" y1="112" x2="272" y2="52" className="text-accent-blue" opacity="0.9" />
      <circle cx="200" cy="112" r="3" fill="currentColor" stroke="none" opacity="0.7" />
      <circle cx="272" cy="52" r="4" className="text-accent-blue" fill="currentColor" stroke="none" />
      <circle cx="158" cy="150" r="4" fill="currentColor" stroke="none" opacity="0.45" />
      <circle cx="244" cy="144" r="3" fill="currentColor" stroke="none" opacity="0.45" />
      <path d="M 116 112 A 84 84 0 0 1 132 66" opacity="0.3" />
    </g>
  );
}

function NodesVariant() {
  const nodes = [
    { x: 120, y: 80, r: 6 },
    { x: 200, y: 56, r: 10 },
    { x: 284, y: 92, r: 6 },
    { x: 164, y: 148, r: 7 },
    { x: 248, y: 156, r: 5 },
    { x: 208, y: 116, r: 4 },
  ];
  const edges: [number, number][] = [
    [0, 1], [1, 2], [0, 5], [1, 5], [2, 4], [3, 5], [4, 5], [0, 3], [3, 4],
  ];
  return (
    <g stroke="currentColor" fill="none">
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a].x}
          y1={nodes[a].y}
          x2={nodes[b].x}
          y2={nodes[b].y}
          strokeWidth="1"
          opacity="0.28"
        />
      ))}
      {nodes.map((n, i) => (
        <circle
          key={i}
          cx={n.x}
          cy={n.y}
          r={n.r}
          strokeWidth="1"
          opacity={i === 1 ? 0.95 : 0.5}
          className={i === 1 ? "text-accent-blue" : undefined}
          fill={i === 1 ? "currentColor" : "none"}
          stroke="currentColor"
        />
      ))}
    </g>
  );
}

function PipelineVariant() {
  const boxes = [
    { x: 52, label: "→" },
    { x: 132, label: "→" },
    { x: 212, label: "→" },
    { x: 292, label: "" },
  ];
  return (
    <g fill="none" stroke="currentColor" strokeWidth="1">
      {boxes.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y="84" width="56" height="44" rx="5" opacity={i === 2 ? 0.95 : 0.5} className={i === 2 ? "text-accent-blue" : undefined} stroke="currentColor" />
          {i < boxes.length - 1 && (
            <>
              <line x1={b.x + 56} y1="106" x2={b.x + 70} y2="106" opacity="0.5" />
              <path d={`M ${b.x + 66} 102 L ${b.x + 70} 106 L ${b.x + 66} 110`} opacity="0.5" />
            </>
          )}
        </g>
      ))}
      <line x1="52" y1="150" x2="348" y2="150" opacity="0.2" strokeDasharray="3 5" />
      <rect x="52" y="62" width="10" height="10" rx="2" fill="currentColor" stroke="none" opacity="0.4" />
      <rect x="70" y="62" width="10" height="10" rx="2" fill="currentColor" stroke="none" opacity="0.25" />
      <rect x="88" y="62" width="10" height="10" rx="2" fill="currentColor" stroke="none" opacity="0.15" />
      <circle cx="200" cy="176" r="4" className="text-accent-blue" fill="currentColor" stroke="none" />
    </g>
  );
}

function MarketVariant() {
  return (
    <g fill="none" stroke="currentColor" strokeWidth="1">
      <line x1="52" y1="170" x2="348" y2="170" opacity="0.25" strokeDasharray="4 4" />
      <rect x="80" y="96" width="16" height="44" opacity="0.4" />
      <line x1="88" y1="92" x2="88" y2="84" opacity="0.4" />
      <rect x="140" y="110" width="16" height="34" className="text-accent-blue" opacity="0.9" stroke="currentColor" />
      <line x1="148" y1="106" x2="148" y2="144" className="text-accent-blue" opacity="0.9" />
      <rect x="196" y="86" width="16" height="56" opacity="0.4" />
      <line x1="204" y1="82" x2="204" y2="74" opacity="0.4" />
      <rect x="252" y="104" width="16" height="40" opacity="0.4" />
      <rect x="236" y="98" width="48" height="26" opacity="0.25" strokeDasharray="3 3" className="text-accent-blue" />
      <path d="M 96 150 C 130 142, 140 128, 170 130 S 230 96, 260 104" opacity="0.5" />
      <circle cx="260" cy="104" r="3" fill="currentColor" stroke="none" className="text-accent-blue" />
      <text x="288" y="88" fontSize="9" fill="currentColor" opacity="0.5" style={{ fontFamily: "var(--font-geist-mono), monospace" }}>
        FVG
      </text>
    </g>
  );
}

function MapVariant() {
  return (
    <g fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M 40 200 C 110 160, 120 120, 200 130 S 330 90, 360 60" opacity="0.2" />
      <path d="M 40 220 C 120 190, 140 150, 220 160 S 340 120, 360 90" opacity="0.14" />
      <path d="M 60 90 C 130 110, 200 80, 260 110 S 330 150, 355 140" opacity="0.14" />
      <path d="M 96 176 C 150 148, 190 140, 244 118" className="text-accent-blue" opacity="0.9" strokeDasharray="5 4" />
      <circle cx="96" cy="176" r="5" opacity="0.6" />
      <path d="M 239 106 L 244 118 L 249 106 Z" className="text-accent-blue" fill="currentColor" stroke="none" />
      <circle cx="239" cy="106" r="3.5" className="text-accent-blue" fill="currentColor" stroke="none" opacity="0.9" />
      <circle cx="320" cy="86" r="3" fill="currentColor" stroke="none" opacity="0.4" />
      <circle cx="150" cy="96" r="3" fill="currentColor" stroke="none" opacity="0.4" />
    </g>
  );
}

function GridVariant() {
  const cells: { x: number; y: number; o: number }[] = [];
  const startX = 100, startY = 60, size = 32, gap = 8;
  for (let col = 0; col < 6; col++) {
    for (let row = 0; row < 4; row++) {
      cells.push({
        x: startX + col * (size + gap),
        y: startY + row * (size + gap),
        o: col === 0 ? 0.4 : 0.12,
      });
    }
  }
  return (
    <g fill="none" stroke="currentColor" strokeWidth="1">
      {cells.map((c, i) => (
        <rect key={i} x={c.x} y={c.y} width={size} height={size} rx="4" opacity={c.o} />
      ))}
      <rect x={startX} y={startY} width={size * 2 + gap} height={size * 2 + gap} rx="6" className="text-accent-blue" stroke="currentColor" opacity="0.9" />
      <circle cx={startX + size + gap / 2} cy={startY + size + gap / 2} r="6" className="text-accent-blue" fill="currentColor" stroke="none" opacity="0.25" />
      <circle cx={startX + size + gap / 2} cy={startY + size + gap / 2} r="3" className="text-accent-blue" fill="currentColor" stroke="none" />
    </g>
  );
}

function LedgerVariant() {
  return (
    <g fill="none" stroke="currentColor" strokeWidth="1">
      <line x1="72" y1="70" x2="328" y2="70" opacity="0.5" />
      {["ACCOUNT", "AMOUNT"].map((t, i) => (
        <text key={t} x={i === 0 ? 72 : 250} y="62" fontSize="8.5" letterSpacing="1.6" fill="currentColor" opacity="0.45" style={{ fontFamily: "var(--font-geist-mono), monospace" }}>
          {t}
        </text>
      ))}
      {[88, 108, 128, 148, 168].map((y, i) => (
        <g key={y} className={i === 2 ? "text-accent-blue" : undefined}>
          <line x1="72" y1={y} x2="328" y2={y} opacity={i === 2 ? 0.7 : 0.18} stroke="currentColor" />
          <line x1="72" y1={y - 12} x2="130" y2={y - 12} opacity="0.3" stroke="currentColor" />
          <line x1={i === 2 ? 250 : 268} y1={y - 12} x2={i === 2 ? 310 : 328} y2={y - 12} opacity={i === 2 ? 0.9 : 0.3} stroke="currentColor" />
        </g>
      ))}
      <rect x="250" y="182" width="78" height="8" rx="4" className="text-accent-blue" fill="currentColor" stroke="none" opacity="0.8" />
      <text x="72" y="188" fontSize="8.5" fill="currentColor" opacity="0.45" style={{ fontFamily: "var(--font-geist-mono), monospace" }}>
        BALANCE
      </text>
    </g>
  );
}

function TerminalVariant() {
  return (
    <g fill="none" stroke="currentColor" strokeWidth="1">
      <rect x="76" y="48" width="248" height="140" rx="6" opacity="0.5" />
      <line x1="76" y1="70" x2="324" y2="70" opacity="0.35" />
      <circle cx="90" cy="59" r="2.5" fill="currentColor" stroke="none" opacity="0.35" />
      <circle cx="100" cy="59" r="2.5" fill="currentColor" stroke="none" opacity="0.35" />
      <g style={{ fontFamily: "var(--font-geist-mono), monospace" }} fill="currentColor" stroke="none">
        <text x="92" y="92" fontSize="10" opacity="0.6">$ check --site example.app</text>
        <text x="92" y="112" fontSize="10" opacity="0.4">status 200 · tls ok · 184ms</text>
        <text x="92" y="132" fontSize="10" opacity="0.6">$ capture --full</text>
        <text x="92" y="152" fontSize="10" className="text-accent-blue" opacity="0.9">saved → evidence/01.png</text>
        <text x="92" y="172" fontSize="10" opacity="0.6">$</text>
        <rect x="106" y="164" width="7" height="11" className="text-accent-blue" fill="currentColor" opacity="0.9" />
      </g>
    </g>
  );
}

const variants: Record<CoverVariant, () => React.ReactElement> = {
  window: WindowVariant,
  rings: RingsVariant,
  nodes: NodesVariant,
  pipeline: PipelineVariant,
  market: MarketVariant,
  map: MapVariant,
  grid: GridVariant,
  ledger: LedgerVariant,
  terminal: TerminalVariant,
};

export function CoverArt({ variant, name, className }: CoverArtProps) {
  const Art = variants[variant];
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className={cn("h-full w-full text-foreground", className)}
      role="img"
      aria-label={`Abstract cover artwork for ${name}`}
    >
      <g className="transition-transform duration-500 ease-out group-hover:translate-x-1 group-hover:translate-y-1 motion-reduce:transform-none">
        <DotTexture />
      </g>
      <g className=" origin-center transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:scale-[1.03] motion-reduce:transform-none">
        <Art />
      </g>
      <g className="transition-transform duration-500 ease-out group-hover:translate-x-1.5 motion-reduce:transform-none">
        <CoverLabel name={name} />
      </g>
    </svg>
  );
}
