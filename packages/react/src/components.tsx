import { useEffect, useRef } from "react";
import type { ButtonHTMLAttributes, CSSProperties, HTMLAttributes, ReactNode } from "react";
import { cx, noir } from "./noir.js";

/* ------------------------------------------------------------------ Pill / Chip */

export type PillVariant = "play" | "ghost" | "glass" | "danger";

export interface PillProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: PillVariant;
  /** Toggled state (glass variant renders inverted). */
  on?: boolean;
  icon?: ReactNode;
  /** Receives initial focus when it sits inside an opening BottomSheet (keyboard / remote only). */
  autoFocusOnOpen?: boolean;
}

/** Pill-shaped action button: `.noir-btn.play | .ghost | .glass | .danger`. */
export function Pill({ variant = "ghost", on, icon, autoFocusOnOpen, className, children, type = "button", ...rest }: PillProps) {
  return (
    <button type={type} className={cx("noir-btn", variant, on && "on", className)} aria-pressed={variant === "glass" ? !!on : undefined}
      data-autofocus={autoFocusOnOpen ? "" : undefined} {...rest}>
      {icon}{children}
    </button>
  );
}

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> { on?: boolean; }

/** Small rounded chip for sort tabs and toolbars: `.noir-chip`. */
export function Chip({ on, className, type = "button", ...rest }: ChipProps) {
  return <button type={type} className={cx("noir-chip", on && "on", className)} aria-pressed={!!on} {...rest} />;
}

/* ------------------------------------------------------------------ NavBar */

export interface NavItem { id: string; label: ReactNode; /** Red notification dot. */ dot?: boolean; }

export interface NavBarProps extends Omit<HTMLAttributes<HTMLElement>, "onSelect"> {
  items: NavItem[];
  active?: string;
  onSelect?: (id: string) => void;
  /** Brand slot; defaults to the "NOIR" wordmark text. */
  brand?: ReactNode;
  onBrand?: () => void;
  /** Right-aligned slot (search, profile). */
  actions?: ReactNode;
}

/** Fixed top bar with gradient + progressive blur and a red active pill: `.noir-topbar`. */
export function NavBar({ items, active, onSelect, brand = "NOIR", onBrand, actions, className, ...rest }: NavBarProps) {
  return (
    <header className={cx("noir-topbar", className)} {...rest}>
      <button type="button" className="noir-brand" onClick={onBrand} aria-label="Home">{brand}</button>
      <nav className="noir-nav">
        {items.map((it) => (
          <button key={it.id} type="button" className={cx(it.id === active && "on", it.dot !== undefined && "noir-dot", it.dot && "has")}
            aria-current={it.id === active ? "page" : undefined} onClick={() => onSelect?.(it.id)}>
            {it.label}
          </button>
        ))}
      </nav>
      <div className="noir-spacer" />
      {actions}
    </header>
  );
}

/** Round icon button for the nav bar: `.noir-icon-btn`. */
export function IconButton({ className, type = "button", ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type={type} className={cx("noir-icon-btn", className)} {...rest} />;
}

/* ------------------------------------------------------------------ Art helper */

function Art({ art, image, alt = "" }: { art?: string; image?: string; alt?: string }) {
  if (image) return <img className="art" src={image} alt={alt} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  return <span className="art" style={{ background: art || "#222" } as CSSProperties} />;
}

/* ------------------------------------------------------------------ Hero */

export interface HeroProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title: ReactNode;
  /** CSS background for the billboard (gradient or url()). */
  art?: string;
  /** Badge text before the tag line, e.g. "TOP 10". */
  badge?: ReactNode;
  tagline?: ReactNode;
  score?: ReactNode;
  pill?: ReactNode;
  description?: ReactNode;
  /** Action buttons (usually <Pill variant="play"> and <Pill variant="ghost">). */
  actions?: ReactNode;
}

/** Full-bleed billboard with vignette, display title, score, episode pill and actions: `.noir-hero`. */
export function Hero({ title, art, badge, tagline, score, pill, description, actions, className, ...rest }: HeroProps) {
  return (
    <section className={cx("noir-hero", className)} {...rest}>
      <div className="noir-hero-bg" style={{ background: art }} />
      <div className="noir-hero-vig" />
      <div className="noir-hero-body">
        {(badge || tagline) && <div className="noir-tag">{badge && <b>{badge}</b>}{tagline && <span>{tagline}</span>}</div>}
        <h1 className="noir-hero-title">{title}</h1>
        {(score || pill) && (
          <div className="noir-meta">{score && <span className="score">{score}</span>}{pill && <span className="pill">{pill}</span>}</div>
        )}
        {description && <p className="noir-desc">{description}</p>}
        {actions}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ PosterRow */

export interface PosterRowProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Right-aligned slot in the title line (e.g. a "See all" <Chip>). */
  action?: ReactNode;
}

/** Horizontally scrolling row with hidden scrollbar: `.noir-row`. */
export function PosterRow({ title, subtitle, action, className, children, ...rest }: PosterRowProps) {
  return (
    <section className={cx("noir-row", className)} {...rest}>
      <div className="noir-row-title">{title}{subtitle && <small>{subtitle}</small>}{action}</div>
      <div className="noir-row-scroll">{children}</div>
    </section>
  );
}

/** Container that lets rows overlap the bottom of the hero: `.noir-rows`. */
export function PosterRows({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("noir-rows", className)} {...rest} />;
}

/** Responsive poster grid: `.noir-grid`. */
export function PosterGrid({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("noir-grid", className)} {...rest} />;
}

/* ------------------------------------------------------------------ PosterCard */

export type WatchState = "none" | "progress" | "finished" | "updated";

export interface PosterCardProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "title"> {
  /** Caption under the poster. */
  title: ReactNode;
  /** Display title drawn on the art. */
  posterTitle?: ReactNode;
  /** CSS background (e.g. a gradient placeholder). */
  art?: string;
  /** Image URL; takes precedence over `art`. */
  image?: string;
  /** Watch state badge: thin bar, round check, or "new episodes" tag + dot. */
  watch?: WatchState;
  /** 0–100, used when watch = "progress". */
  progress?: number;
  /** Text for watch = "updated", e.g. "Ep 12 out". */
  updateLabel?: ReactNode;
  /** 1–10: renders the outlined TOP10 numeral behind the card. */
  rank?: number;
}

/** Poster card with watch-state badges and optional TOP10 rank: `.noir-card`. */
export function PosterCard({ title, posterTitle, art, image, watch = "none", progress = 0, updateLabel = "New", rank,
  className, type = "button", ...rest }: PosterCardProps) {
  const pct = Math.max(0, Math.min(100, progress));
  const card = (
    <button type={type} className={cx("noir-card", className)} {...rest}>
      <span className="noir-poster">
        <Art art={art} image={image} />
        {posterTitle && <span className="ttl">{posterTitle}</span>}
        {watch === "progress" && <span className="noir-badge-bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}><i style={{ width: pct + "%" }} /></span>}
        {watch === "finished" && <span className="noir-badge-check" aria-label="Finished">&#10003;</span>}
        {watch === "updated" && <><span className="noir-badge-update">{updateLabel}</span><span className="noir-badge-dot" /></>}
      </span>
      <span className="noir-card-name">{title}</span>
    </button>
  );
  if (!rank) return card;
  return (
    <div className={cx("noir-card-top", rank >= 10 && "r10")}>
      <span className="rank" aria-hidden="true">{rank}</span>
      {card}
    </div>
  );
}

/* ------------------------------------------------------------------ BottomSheet */

export interface BottomSheetProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  /** CSS background for the 16:9 art. */
  art?: string;
  image?: string;
  /** Buttons under the title. Give one `autoFocusOnOpen` for remote users. */
  actions?: ReactNode;
  closeLabel?: string;
}

/**
 * Detail sheet: a centred panel on desktop, a bottom sheet on phones (`.noir-modal` / `.noir-sheet`).
 * Stays mounted so the close animation can play. Pair it with useBackStack so system back closes it.
 */
export function BottomSheet({ open, onClose, title, art, image, actions, closeLabel = "Close", className, children, ...rest }: BottomSheetProps) {
  const modal = useRef<HTMLDivElement>(null);
  const opener = useRef<Element | null>(null);

  useEffect(() => {
    const N = noir(), el = modal.current;
    if (!el) return;
    if (open) {
      opener.current = document.activeElement;
      el.scrollTop = 0;
      const first = el.querySelector("[data-autofocus]");
      if (first && N?.input.isKeyboard()) N.focus.to(first);
    } else if (opener.current) {
      const prev = opener.current; opener.current = null;
      if (N?.input.isKeyboard() && document.body.contains(prev)) N.focus.to(prev);
      else if (el.contains(document.activeElement)) (document.activeElement as HTMLElement).blur();
    }
  }, [open]);

  return (
    <div ref={modal} className={cx("noir-modal", open && "open", className)} aria-hidden={!open}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} {...rest}>
      <div className="noir-sheet" role="dialog" aria-modal="true">
        <button type="button" className="noir-sheet-x" aria-label={closeLabel} onClick={onClose}>&#10005;</button>
        <div className="noir-sheet-art">
          <Art art={art} image={image} />
          <div className="fade" />
          <div className="st"><h3>{title}</h3>{actions}</div>
        </div>
        <div className="noir-sheet-body">{children}</div>
      </div>
    </div>
  );
}
