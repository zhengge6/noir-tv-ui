import { defineComponent, h, nextTick, ref, watch } from "vue";
import type { PropType, VNode } from "vue";
import { cx, noir } from "./noir.js";

export type PillVariant = "play" | "ghost" | "glass" | "danger";
export type WatchState = "none" | "progress" | "finished" | "updated";
export interface NavItem { id: string; label: string; dot?: boolean; }

function art(artBg?: string, image?: string): VNode {
  return image
    ? h("img", { class: "art", src: image, alt: "", loading: "lazy", style: { width: "100%", height: "100%", objectFit: "cover" } })
    : h("span", { class: "art", style: { background: artBg || "#222" } });
}

/** Pill-shaped action button: `.noir-btn.play | .ghost | .glass | .danger`. */
export const Pill = defineComponent({
  name: "NoirPill",
  props: {
    variant: { type: String as PropType<PillVariant>, default: "ghost" },
    on: { type: Boolean, default: false },
    /** Receives initial focus inside an opening BottomSheet (keyboard / remote only). */
    autofocusOnOpen: { type: Boolean, default: false },
  },
  setup(props, { slots }) {
    return () => h("button", {
      type: "button",
      class: cx("noir-btn", props.variant, props.on && "on"),
      "aria-pressed": props.variant === "glass" ? String(props.on) : undefined,
      "data-autofocus": props.autofocusOnOpen ? "" : undefined,
    }, [slots.icon?.(), slots.default?.()]);
  },
});

/** Rounded chip for sort tabs and toolbars: `.noir-chip`. */
export const Chip = defineComponent({
  name: "NoirChip",
  props: { on: { type: Boolean, default: false } },
  setup(props, { slots }) {
    return () => h("button", { type: "button", class: cx("noir-chip", props.on && "on"), "aria-pressed": String(props.on) }, slots.default?.());
  },
});

/** Fixed top bar with gradient + progressive blur and a red active pill: `.noir-topbar`. */
export const NavBar = defineComponent({
  name: "NoirNavBar",
  props: {
    items: { type: Array as PropType<NavItem[]>, required: true },
    active: { type: String, default: "" },
    brand: { type: String, default: "NOIR" },
  },
  emits: { select: (_id: string) => true, brand: () => true },
  setup(props, { emit, slots }) {
    return () => h("header", { class: "noir-topbar" }, [
      h("button", { type: "button", class: "noir-brand", "aria-label": "Home", onClick: () => emit("brand") }, slots.brand?.() ?? props.brand),
      h("nav", { class: "noir-nav" }, props.items.map((it) => h("button", {
        key: it.id, type: "button",
        class: cx(it.id === props.active && "on", it.dot !== undefined && "noir-dot", it.dot && "has"),
        "aria-current": it.id === props.active ? "page" : undefined,
        onClick: () => emit("select", it.id),
      }, it.label))),
      h("div", { class: "noir-spacer" }),
      slots.actions?.(),
    ]);
  },
});

/** Round icon button for the nav bar: `.noir-icon-btn`. */
export const IconButton = defineComponent({
  name: "NoirIconButton",
  setup(_, { slots }) { return () => h("button", { type: "button", class: "noir-icon-btn" }, slots.default?.()); },
});

/** Full-bleed billboard with vignette, display title, score, pill and actions: `.noir-hero`. */
export const Hero = defineComponent({
  name: "NoirHero",
  props: {
    title: { type: String, required: true },
    art: String, badge: String, tagline: String, score: String, pill: String, description: String,
  },
  setup(props, { slots }) {
    return () => h("section", { class: "noir-hero" }, [
      h("div", { class: "noir-hero-bg", style: { background: props.art } }),
      h("div", { class: "noir-hero-vig" }),
      h("div", { class: "noir-hero-body" }, [
        (props.badge || props.tagline) ? h("div", { class: "noir-tag" }, [props.badge ? h("b", props.badge) : null, props.tagline ? h("span", props.tagline) : null]) : null,
        h("h1", { class: "noir-hero-title" }, slots.title?.() ?? props.title),
        (props.score || props.pill) ? h("div", { class: "noir-meta" }, [
          props.score ? h("span", { class: "score" }, props.score) : null,
          props.pill ? h("span", { class: "pill" }, props.pill) : null]) : null,
        props.description ? h("p", { class: "noir-desc" }, props.description) : null,
        slots.actions?.(),
      ]),
    ]);
  },
});

/** Horizontally scrolling row with hidden scrollbar: `.noir-row`. */
export const PosterRow = defineComponent({
  name: "NoirPosterRow",
  props: { title: { type: String, required: true }, subtitle: String },
  setup(props, { slots }) {
    return () => h("section", { class: "noir-row" }, [
      h("div", { class: "noir-row-title" }, [props.title, props.subtitle ? h("small", props.subtitle) : null, slots.action?.()]),
      h("div", { class: "noir-row-scroll" }, slots.default?.()),
    ]);
  },
});

/** Lets rows overlap the bottom of the hero: `.noir-rows`. */
export const PosterRows = defineComponent({
  name: "NoirPosterRows",
  setup(_, { slots }) { return () => h("div", { class: "noir-rows" }, slots.default?.()); },
});

/** Responsive poster grid: `.noir-grid`. */
export const PosterGrid = defineComponent({
  name: "NoirPosterGrid",
  setup(_, { slots }) { return () => h("div", { class: "noir-grid" }, slots.default?.()); },
});

/** Poster card with watch-state badges and optional TOP10 rank: `.noir-card`. */
export const PosterCard = defineComponent({
  name: "NoirPosterCard",
  props: {
    /** Caption under the poster. */
    title: { type: String, required: true },
    /** Display title drawn on the art. */
    posterTitle: String,
    /** CSS background (e.g. a gradient placeholder). */
    art: String,
    /** Image URL; wins over `art`. */
    image: String,
    watch: { type: String as PropType<WatchState>, default: "none" },
    /** 0–100 for watch = "progress". */
    progress: { type: Number, default: 0 },
    updateLabel: { type: String, default: "New" },
    /** 1–10: outlined TOP10 numeral behind the card. */
    rank: Number,
  },
  emits: { select: () => true },
  setup(props, { emit }) {
    return () => {
      const pct = Math.max(0, Math.min(100, props.progress));
      const badges: Array<VNode | null> = [
        props.watch === "progress" ? h("span", { class: "noir-badge-bar", role: "progressbar", "aria-valuenow": pct, "aria-valuemin": 0, "aria-valuemax": 100 }, [h("i", { style: { width: pct + "%" } })]) : null,
        props.watch === "finished" ? h("span", { class: "noir-badge-check", "aria-label": "Finished" }, "\u2713") : null,
        props.watch === "updated" ? h("span", { class: "noir-badge-update" }, props.updateLabel) : null,
        props.watch === "updated" ? h("span", { class: "noir-badge-dot" }) : null,
      ];
      const card = h("button", { type: "button", class: "noir-card", onClick: () => emit("select") }, [
        h("span", { class: "noir-poster" }, [art(props.art, props.image), props.posterTitle ? h("span", { class: "ttl" }, props.posterTitle) : null, ...badges]),
        h("span", { class: "noir-card-name" }, props.title),
      ]);
      if (!props.rank) return card;
      return h("div", { class: cx("noir-card-top", props.rank >= 10 && "r10") }, [h("span", { class: "rank", "aria-hidden": "true" }, String(props.rank)), card]);
    };
  },
});

/**
 * Detail sheet: centred panel on desktop, bottom sheet on phones (`.noir-modal` / `.noir-sheet`).
 * Stays mounted so the close animation can play. Pair it with useBackStack so system back closes it.
 */
export const BottomSheet = defineComponent({
  name: "NoirBottomSheet",
  props: {
    open: { type: Boolean, required: true },
    title: { type: String, required: true },
    art: String,
    image: String,
    closeLabel: { type: String, default: "Close" },
  },
  emits: { close: () => true },
  setup(props, { emit, slots }) {
    const modal = ref<HTMLElement | null>(null);
    let opener: Element | null = null;
    watch(() => props.open, async (open) => {
      await nextTick();
      const N = noir(), el = modal.value;
      if (!el) return;
      if (open) {
        opener = document.activeElement;
        el.scrollTop = 0;
        const first = el.querySelector("[data-autofocus]");
        if (first && N?.input.isKeyboard()) N.focus.to(first);
      } else if (opener) {
        const prev = opener; opener = null;
        if (N?.input.isKeyboard() && document.body.contains(prev)) N.focus.to(prev);
        else if (el.contains(document.activeElement)) (document.activeElement as HTMLElement).blur();
      }
    });
    return () => h("div", {
      ref: modal, class: cx("noir-modal", props.open && "open"), "aria-hidden": String(!props.open),
      onClick: (e: MouseEvent) => { if (e.target === e.currentTarget) emit("close"); },
    }, [
      h("div", { class: "noir-sheet", role: "dialog", "aria-modal": "true" }, [
        h("button", { type: "button", class: "noir-sheet-x", "aria-label": props.closeLabel, onClick: () => emit("close") }, "\u2715"),
        h("div", { class: "noir-sheet-art" }, [
          art(props.art, props.image), h("div", { class: "fade" }),
          h("div", { class: "st" }, [h("h3", props.title), slots.actions?.()]),
        ]),
        h("div", { class: "noir-sheet-body" }, slots.default?.()),
      ]),
    ]);
  },
});
