// Invented titles and abstract gradient "posters". No real shows, no images.
export interface Title {
  id: string; name: string; sub: string; art: string; score: string; eps: number;
  watch: "none" | "progress" | "finished" | "updated"; progress?: number;
}
const NAMES = ["Starfarer", "Backlit City", "Fog Harbor Letters", "Long Wind", "North Light", "Paper Planes", "Summer Echo",
  "17 Ginkgo St.", "Cloud Signal", "Mist Express", "The Seventh Sea", "Evening Station", "Daylight Border", "Time Inn",
  "Cat & Whale", "Mountain Guest", "Neon Fold", "Glass Garden"];
const PAL = [["#0f2027", "#2c5364"], ["#e52d27", "#b31217"], ["#1d4350", "#a43931"], ["#41295a", "#2f0743"], ["#c94b4b", "#4b134f"],
  ["#134e5e", "#71b280"], ["#ff512f", "#dd2476"], ["#283c86", "#45a247"], ["#373b44", "#4286f4"], ["#8e2de2", "#4a00e0"]];
const DOTS = ["#ffffff", "#6be4ff", "#ffcf6e", "#ff6b6b"];
export function art(i: number): string {
  const p = PAL[i % PAL.length], a = (i * 47) % 360, d1 = DOTS[i % 4], d2 = DOTS[(i + 1) % 4];
  return `radial-gradient(circle at ${(i * 13) % 60 + 20}% ${(i * 7) % 30 + 18}%, ${d1}aa 0 18%, transparent 19%),` +
    `radial-gradient(circle at ${(i * 17) % 50 + 30}% ${(i * 5) % 20 + 62}%, ${d2}88 0 24%, transparent 25%),` +
    `linear-gradient(${a}deg, ${p[0]}, ${p[1]})`;
}
export const TITLES: Title[] = NAMES.map((name, i) => ({
  id: "t" + i, name, sub: `Season ${1 + (i % 3)}`, art: art(i), score: (((i * 7) % 20) / 10 + 8).toFixed(1), eps: ((i * 5) % 30) + 12,
  watch: i % 5 === 1 ? "progress" : i % 7 === 2 ? "finished" : i % 6 === 3 ? "updated" : "none",
  progress: ((i * 3) % 60) + 30,
}));
