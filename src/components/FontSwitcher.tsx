'use client';

import { useState, useEffect } from 'react';

const FONTS = [
  { id: 'geist',     label: 'Geist',              detail: 'Clean & techy' },
  { id: 'jakarta',   label: 'Plus Jakarta Sans',   detail: 'Geometric & modern' },
  { id: 'inter',     label: 'Inter',               detail: 'Neutral & versatile' },
  { id: 'bricolage', label: 'Bricolage + DM Sans', detail: 'Bold & editorial' },
  { id: 'cabinet',   label: 'Cabinet + Satoshi',   detail: 'Clean & premium' },
  { id: 'sora',      label: 'Sora',                detail: 'Geometric & friendly' },
] as const;

type FontId = (typeof FONTS)[number]['id'];

const LS_KEY = 'portfolio-font';

function applyFont(id: FontId) {
  if (id === 'geist') {
    document.documentElement.removeAttribute('data-font');
  } else {
    document.documentElement.setAttribute('data-font', id);
  }
}

export default function FontSwitcher() {
  const [current, setCurrent] = useState<FontId>('geist');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = (localStorage.getItem(LS_KEY) ?? 'geist') as FontId;
    setCurrent(saved);
    applyFont(saved);
    setMounted(true);
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const id = e.target.value as FontId;
    setCurrent(id);
    localStorage.setItem(LS_KEY, id);
    applyFont(id);
  }

  // Render a placeholder of the same size during SSR to avoid layout shift
  if (!mounted) {
    return <div className="w-[160px] h-7" aria-hidden="true" />;
  }

  return (
    <div className="flex items-center gap-1.5" title="Switch font">
      <span className="text-xs text-muted-foreground select-none font-mono">Aa</span>
      <select
        value={current}
        onChange={handleChange}
        aria-label="Switch font"
        className="text-xs bg-transparent border border-border rounded-md px-2 py-1 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer transition-colors"
      >
        {FONTS.map((f) => (
          <option key={f.id} value={f.id}>
            {f.label}
          </option>
        ))}
      </select>
    </div>
  );
}
