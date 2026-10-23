/**
 * A small, honest architecture diagram of the self-hosted environment —
 * drawn from practice: Coolify on Ubuntu, proxy-fronted services,
 * PostgreSQL and Redis, deploys from GitHub, SSH operation, and a tunnel
 * path for sharing local work. Thin strokes, mono labels, one accent.
 */
export function InfraDiagram() {
  const stroke = "currentColor";
  const label = {
    fontFamily: "var(--font-geist-mono), monospace",
    fontSize: "10.5px",
    letterSpacing: "1.2px",
    fill: "currentColor",
    opacity: "0.75",
  } as const;
  const sub = {
    fontFamily: "var(--font-geist-mono), monospace",
    fontSize: "8.5px",
    letterSpacing: "0.8px",
    fill: "currentColor",
    opacity: "0.45",
  } as const;

  return (
    <svg
      viewBox="0 0 760 470"
      className="h-auto w-full text-foreground"
      role="img"
      aria-label="Diagram of the self-hosted infrastructure: deploys flow from GitHub through Coolify on an Ubuntu host; browser requests arrive through the reverse proxy to application containers backed by PostgreSQL and Redis; SSH and Cloudflare Tunnel provide operation and secure sharing paths."
    >
      {/* External sources */}
      <g fill="none" stroke={stroke} strokeWidth="1">
        <rect x="40" y="40" width="150" height="52" rx="6" opacity="0.5" />
        <rect x="40" y="140" width="150" height="52" rx="6" opacity="0.5" />
        <rect x="570" y="40" width="150" height="52" rx="6" opacity="0.5" />
      </g>
      <text x="52" y="60" style={label}>DEVELOPER</text>
      <text x="52" y="76" style={sub}>ssh · terminal</text>
      <text x="52" y="160" style={label}>GITHUB</text>
      <text x="52" y="176" style={sub}>repositories</text>
      <text x="582" y="60" style={label}>BROWSER</text>
      <text x="582" y="76" style={sub}>https requests</text>

      {/* Ubuntu host container */}
      <g fill="none" stroke={stroke} strokeWidth="1">
        <rect x="200" y="120" width="360" height="320" rx="10" opacity="0.6" />
      </g>
      <text x="220" y="146" style={label}>UBUNTU HOST</text>
      <text x="220" y="160" style={sub}>aws ec2 · linux</text>

      {/* Proxy layer */}
      <g fill="none" stroke={stroke} strokeWidth="1">
        <rect x="240" y="180" width="280" height="44" rx="6" opacity="0.7" />
      </g>
      <text x="252" y="198" style={label}>REVERSE PROXY</text>
      <text x="252" y="212" style={sub}>tls · routing (coolify-managed)</text>

      {/* Coolify + containers row */}
      <g fill="none" stroke={stroke} strokeWidth="1">
        <rect x="240" y="252" width="84" height="44" rx="6" className="text-accent-blue" opacity="0.9" />
        <rect x="344" y="252" width="84" height="44" rx="6" opacity="0.5" />
        <rect x="448" y="252" width="84" height="44" rx="6" opacity="0.5" />
      </g>
      <text x="256" y="270" style={label} className="text-accent-blue">COOLIFY</text>
      <text x="256" y="284" style={sub}>deploys</text>
      <text x="360" y="270" style={label}>APPS</text>
      <text x="360" y="284" style={sub}>containers</text>
      <text x="470" y="270" style={label}>MEDIADB</text>
      <text x="470" y="284" style={sub}>sqlite</text>

      {/* Data layer */}
      <g fill="none" stroke={stroke} strokeWidth="1">
        <rect x="240" y="330" width="128" height="44" rx="6" opacity="0.5" />
        <rect x="404" y="330" width="128" height="44" rx="6" opacity="0.5" />
      </g>
      <text x="252" y="348" style={label}>POSTGRESQL</text>
      <text x="252" y="362" style={sub}>durable data</text>
      <text x="416" y="348" style={label}>REDIS</text>
      <text x="416" y="362" style={sub}>cache · queues</text>

      {/* Tunnel note */}
      <g fill="none" stroke={stroke} strokeWidth="1" opacity="0.5">
        <rect x="570" y="140" width="150" height="52" rx="6" strokeDasharray="4 4" />
      </g>
      <text x="582" y="160" style={label}>CLOUDFLARE</text>
      <text x="582" y="176" style={sub}>tunnel (local sharing)</text>

      {/* Flows */}
      <g fill="none" stroke={stroke} strokeWidth="1">
        {/* SSH: developer → host */}
        <path d="M 190 66 L 230 66 L 230 112" opacity="0.4" strokeDasharray="4 4" />
        <path d="M 226 108 L 230 112 L 234 108" opacity="0.4" />
        {/* GitHub → Coolify (deploy) */}
        <path
          d="M 190 166 L 228 166 L 228 274 L 240 274"
          className="text-accent-blue"
          strokeDasharray="5 4"
          opacity="0.9"
        />
        <path d="M 236 270 L 240 274 L 236 278" className="text-accent-blue" opacity="0.9" />
        {/* Browser → proxy */}
        <path d="M 570 66 L 380 66 L 380 180" opacity="0.6" />
        <path d="M 376 176 L 380 180 L 384 176" opacity="0.6" />
        {/* Proxy → apps */}
        <path d="M 386 252 L 386 240 L 380 224" opacity="0.5" />
        {/* Apps → data */}
        <path d="M 304 296 L 304 330" opacity="0.4" />
        <path d="M 468 296 L 468 330" opacity="0.4" />
        {/* Tunnel → host (dashed) */}
        <path d="M 570 166 L 560 166 L 560 274 L 532 274" opacity="0.35" strokeDasharray="4 4" />
      </g>

      {/* Flow labels */}
      <text x="196" y="130" style={sub} className="text-accent-blue">deploy</text>
      <text x="396" y="58" style={sub}>request</text>
      <text x="536" y="262" style={sub}>https</text>
    </svg>
  );
}
