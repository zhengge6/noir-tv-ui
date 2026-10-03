import { useState } from "react";
import {
  BottomSheet, Chip, Hero, IconButton, NavBar, Pill, PosterCard, PosterGrid, PosterRow, PosterRows,
  toast, useBackStack, useDpadFocus,
} from "@noir-tv-ui/react";
import { TITLES, type Title } from "./catalog";

type Page = "home" | "lib";

export function App() {
  useDpadFocus({ tv: /[?&]tv=1/.test(location.search) });
  const [page, setPage] = useState<Page>("home");
  const [picked, setPicked] = useState<Title>(TITLES[0]);
  const [sort, setSort] = useState<"new" | "score">("new");

  // System back / browser back / Esc all land here with the level now on top.
  const nav = useBackStack((tag) => {
    if (tag === "") setPage("home");
    else if (tag === "lib") setPage("lib");
  });

  const go = (id: string) => {
    if (id === "home") { if (page !== "home") { setPage("home"); nav.home(); } }
    else if (page !== "lib") { nav.push("lib"); setPage("lib"); window.scrollTo(0, 0); }
  };
  const open = (t: Title) => { setPicked(t); nav.push("detail"); };
  const card = (t: Title, rank?: number) => (
    <PosterCard key={t.id} title={t.name} posterTitle={t.name} art={t.art} watch={t.watch} progress={t.progress}
      updateLabel={`Ep ${t.eps} out`} rank={rank} onClick={() => open(t)} />
  );
  const hero = TITLES[0];
  const lib = sort === "score" ? [...TITLES].sort((a, b) => +b.score - +a.score) : TITLES;

  return (
    <>
      <NavBar items={[{ id: "home", label: "Home" }, { id: "lib", label: "Library" }]} active={page} onSelect={go}
        onBrand={() => go("home")}
        actions={<IconButton aria-label="Search" onClick={() => toast("Search is left to your app")}>
          <svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5l5.5 5.5" /></svg>
        </IconButton>} />

      {page === "home" ? (
        <main>
          <Hero title={hero.name} art={hero.art} badge="TOP 10" tagline="No. 1 today" score="9.6" pill={`${hero.eps} episodes`}
            description="React components over the same NOIR CSS classes and tokens. Abstract art, invented titles."
            actions={<>
              <Pill variant="play" onClick={() => toast("Play: " + hero.name)}>&#9654; Play</Pill>
              <Pill variant="ghost" onClick={() => open(hero)}>&#9432; Details</Pill>
            </>} />
          <PosterRows>
            <PosterRow title="TOP10" subtitle="today">{TITLES.slice(0, 10).map((t, i) => card(t, i + 1))}</PosterRow>
            <PosterRow title="Continue watching">{TITLES.filter((t) => t.watch === "progress" || t.watch === "updated").map((t) => card(t))}</PosterRow>
            <PosterRow title="New this week">{TITLES.slice(6).map((t) => card(t))}</PosterRow>
          </PosterRows>
          <p className="noir-note" style={{ margin: "24px 4% 40px" }}>@noir-tv-ui/react example · placeholder art</p>
        </main>
      ) : (
        <section className="noir-page">
          <h2>Library</h2>
          <div className="noir-chips">
            <Chip on={sort === "new"} onClick={() => setSort("new")}>Newest</Chip>
            <Chip on={sort === "score"} onClick={() => setSort("score")}>Top rated</Chip>
          </div>
          <PosterGrid>{lib.map((t) => card(t))}</PosterGrid>
        </section>
      )}

      <BottomSheet open={nav.level === "detail"} onClose={() => nav.back("detail")} title={picked.name} art={picked.art}
        actions={<>
          <Pill variant="play" autoFocusOnOpen onClick={() => toast("Play")}>&#9654; Resume</Pill>
          <Pill variant="glass" onClick={() => toast("Saved")}>&#9825; Favorite</Pill>
        </>}>
        <div className="noir-meta"><span className="score">{picked.score}</span><span className="pill">{picked.eps} episodes</span></div>
        <p>An invented title with abstract art. Press system back (or Esc / browser back) and the sheet closes instead of leaving the page.</p>
      </BottomSheet>
    </>
  );
}
