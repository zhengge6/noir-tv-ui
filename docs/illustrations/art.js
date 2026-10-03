// Abstract poster art for illustrations: deep gradients plus one geometric ring or disc (the NOIR eclipse motif).
// Titles are invented. No images, no real shows.
window.NOIR_ART = (function () {
  var TITLES = ["Starfarer", "Backlit City", "Fog Harbor Letters", "Long Wind", "North Light", "Paper Planes",
    "Summer Echo", "17 Ginkgo St.", "Cloud Signal", "Mist Express", "The Seventh Sea", "Evening Station",
    "Daylight Border", "Time Inn", "Glass Garden", "Neon Fold"];
  var BASE = [["#5a0d14", "#12070a"], ["#1e3346", "#0a0e14"], ["#3b1a52", "#0e0a14"], ["#5a2410", "#120b08"],
    ["#11403a", "#080f0e"], ["#2b2b33", "#0b0b0e"], ["#6b0a12", "#16070a"], ["#173a5a", "#090d14"]];
  var ACC = ["255,77,87", "255,255,255", "255,77,87", "230,230,235", "255,77,87", "255,255,255", "255,120,110", "220,225,235"];
  function poster(i) {
    var b = BASE[i % BASE.length], a = ACC[i % ACC.length];
    var x = 30 + (i * 23) % 45, y = 22 + (i * 17) % 40, r = 26 + (i * 7) % 16;
    // an eclipse: a thin ring whose lower-right edge is brighter, or a soft disc
    var ring = i % 3 === 1
      ? "radial-gradient(circle at " + x + "% " + y + "%, rgba(" + a + ",.30) 0 " + (r - 4) + "%, transparent " + (r - 3) + "%)"
      : "radial-gradient(circle at " + (x - 2) + "% " + (y - 2) + "%, transparent 0 " + (r - 3) + "%, rgba(" + a + ",.0) " + (r - 3) + "%)," +
        "radial-gradient(circle at " + x + "% " + y + "%, transparent 0 " + (r - 3) + "%, rgba(" + a + ",.62) " + (r - 2.4) + "% " + (r - .6) + "%, transparent " + r + "%)";
    var glow = "radial-gradient(circle at " + x + "% " + y + "%, rgba(" + a + ",.14), transparent 58%)";
    return ring + "," + glow + ",linear-gradient(" + (150 + i * 23 % 60) + "deg, " + b[0] + ", " + b[1] + ")";
  }
  function hero() {
    return "url('../../brand/ring.svg') no-repeat 82% 42% / auto 92%, radial-gradient(70% 90% at 80% 40%, #2a0c10 0%, #0d0a0b 55%, #070707 100%)";
  }
  return { TITLES: TITLES, poster: poster, hero: hero };
})();
