<script setup lang="ts">
import { computed, ref } from "vue";
import {
  BottomSheet, Chip, Hero, IconButton, NavBar, Pill, PosterCard, PosterGrid, PosterRow, PosterRows,
  toast, useBackStack, useDpadFocus,
} from "@noir-tv-ui/vue";
import { TITLES, type Title } from "./catalog";

useDpadFocus({ tv: /[?&]tv=1/.test(location.search) });
const page = ref<"home" | "lib">("home");
const picked = ref<Title>(TITLES[0]);
const sort = ref<"new" | "score">("new");
const hero = TITLES[0];

// System back / browser back / Esc all land here with the level now on top.
const nav = useBackStack((tag) => {
  if (tag === "") page.value = "home";
  else if (tag === "lib") page.value = "lib";
});
const level = nav.level;

function go(id: string) {
  if (id === "home") { if (page.value !== "home") { page.value = "home"; nav.home(); } }
  else if (page.value !== "lib") { nav.push("lib"); page.value = "lib"; window.scrollTo(0, 0); }
}
function open(t: Title) { picked.value = t; nav.push("detail"); }
const cont = TITLES.filter((t) => t.watch === "progress" || t.watch === "updated");
const lib = computed(() => (sort.value === "score" ? [...TITLES].sort((a, b) => +b.score - +a.score) : TITLES));
const items = [{ id: "home", label: "Home" }, { id: "lib", label: "Library" }];
</script>

<template>
  <NavBar :items="items" :active="page" @select="go" @brand="go('home')">
    <template #actions>
      <IconButton aria-label="Search" @click="toast('Search is left to your app')">
        <svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5l5.5 5.5" /></svg>
      </IconButton>
    </template>
  </NavBar>

  <main v-if="page === 'home'">
    <Hero :title="hero.name" :art="hero.art" badge="TOP 10" tagline="No. 1 today" score="9.6" :pill="`${hero.eps} episodes`"
      description="Vue 3 components over the same NOIR CSS classes and tokens. Abstract art, invented titles.">
      <template #actions>
        <Pill variant="play" @click="toast('Play: ' + hero.name)">&#9654; Play</Pill>
        <Pill variant="ghost" @click="open(hero)">&#9432; Details</Pill>
      </template>
    </Hero>
    <PosterRows>
      <PosterRow title="TOP10" subtitle="today">
        <PosterCard v-for="(t, i) in TITLES.slice(0, 10)" :key="t.id" :title="t.name" :poster-title="t.name" :art="t.art"
          :watch="t.watch" :progress="t.progress" :update-label="`Ep ${t.eps} out`" :rank="i + 1" @select="open(t)" />
      </PosterRow>
      <PosterRow title="Continue watching">
        <PosterCard v-for="t in cont" :key="t.id" :title="t.name" :poster-title="t.name" :art="t.art"
          :watch="t.watch" :progress="t.progress" :update-label="`Ep ${t.eps} out`" @select="open(t)" />
      </PosterRow>
      <PosterRow title="New this week">
        <PosterCard v-for="t in TITLES.slice(6)" :key="t.id" :title="t.name" :poster-title="t.name" :art="t.art"
          :watch="t.watch" :progress="t.progress" :update-label="`Ep ${t.eps} out`" @select="open(t)" />
      </PosterRow>
    </PosterRows>
    <p class="noir-note" style="margin: 24px 4% 40px">@noir-tv-ui/vue example · placeholder art</p>
  </main>

  <section v-else class="noir-page">
    <h2>Library</h2>
    <div class="noir-chips">
      <Chip :on="sort === 'new'" @click="sort = 'new'">Newest</Chip>
      <Chip :on="sort === 'score'" @click="sort = 'score'">Top rated</Chip>
    </div>
    <PosterGrid>
      <PosterCard v-for="t in lib" :key="t.id" :title="t.name" :poster-title="t.name" :art="t.art"
        :watch="t.watch" :progress="t.progress" :update-label="`Ep ${t.eps} out`" @select="open(t)" />
    </PosterGrid>
  </section>

  <BottomSheet :open="level === 'detail'" :title="picked.name" :art="picked.art" @close="nav.back('detail')">
    <template #actions>
      <Pill variant="play" autofocus-on-open @click="toast('Play')">&#9654; Resume</Pill>
      <Pill variant="glass" @click="toast('Saved')">&#9825; Favorite</Pill>
    </template>
    <div class="noir-meta"><span class="score">{{ picked.score }}</span><span class="pill">{{ picked.eps }} episodes</span></div>
    <p>An invented title with abstract art. Press system back (or Esc / browser back) and the sheet closes instead of leaving the page.</p>
  </BottomSheet>
</template>
