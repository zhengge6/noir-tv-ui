/*!
 * NOIR TV UI — behaviour helpers (vanilla JS, no dependencies). MIT License.
 *   NOIR.input       keyboard / touch / TV mode classes on <html>
 *   NOIR.backStack   one-level back via History API #hash entries (works with Android WebView back)
 *   NOIR.focus       geometric D-pad focus movement for TV remotes
 *   NOIR.longPress   touch long-press + remote long-OK
 *   NOIR.manager     shared "management mode" (× per card, multi-select, select all, delete with confirm)
 *   NOIR.sheet       detail sheet open/close
 *   NOIR.confirm     focusable confirm dialog (is its own back level)
 *   NOIR.toast
 */
(function (global) {
  "use strict";
  if (typeof document === "undefined") return;     // SSR / non-browser: nothing to do
  var root = document.documentElement;
  var NOIR = {};

  /* ---------------- input mode ---------------- */
  NOIR.version = "0.2.0";

  NOIR.input = {
    init: function (opts) {
      opts = opts || {};
      if (opts.tv) root.classList.add("tv");
      if (NOIR.input._on) return;                    // listeners are installed once
      NOIR.input._on = true;
      document.addEventListener("keydown", function (e) {
        if (e.keyCode >= 37 && e.keyCode <= 40 || e.keyCode === 9) root.classList.add("kbd");
      }, true);
      var off = function () { root.classList.remove("kbd"); };
      document.addEventListener("mousedown", off, true);
      document.addEventListener("touchstart", off, { capture: true, passive: true });
    },
    isKeyboard: function () { return root.classList.contains("kbd") || root.classList.contains("tv"); }
  };

  /* ---------------- back stack ----------------
   * Every secondary level (page, sheet, search, dialog) pushes its own URL hash, e.g. #detail.
   * Why the hash matters: hosts such as Android WebViews often implement "back" as
   *   if (url != homeUrl && webView.canGoBack()) webView.goBack(); else exitToNative();
   * comparing the URL *including* the fragment. pushState() with an unchanged URL is therefore invisible
   * to them and back leaves the page. With a hash per level, back pops exactly one level.
   * history.state = { noir: tag, d: depth }. popstate is handled state-driven: the app is told which level
   * is now on top and closes everything above it. Switching between sibling tabs uses replace().
   */
  NOIR.backStack = function (onLevel) {
    var pending = 0;
    function url(tag) { return location.pathname + location.search + (tag ? "#" + tag : ""); }
    function top() { var s = history.state; return s && s.noir ? String(s.noir) : ""; }
    function depth() { var s = history.state; return s && s.noir ? Number(s.d) || 1 : 0; }
    function go(n) {
      if (pending || n <= 0) return;
      pending = Date.now();
      setTimeout(function () { if (pending && Date.now() - pending >= 1400) pending = 0; }, 1500);
      try { history.go(-n); } catch (e) { pending = 0; }
    }
    try { if (/^#[a-z0-9-]+$/i.test(location.hash) && !(history.state && history.state.noir)) history.replaceState(null, "", url("")); } catch (e) {}
    function onPop(e) {
      pending = 0;
      onLevel(e.state && e.state.noir ? String(e.state.noir) : "");
    }
    global.addEventListener("popstate", onPop);
    return {
      push: function (tag) { if (top() === tag) return; try { history.pushState({ noir: tag, d: depth() + 1 }, "", url(tag)); } catch (e) {} },
      replace: function (tag) { try { history.replaceState({ noir: tag, d: depth() || 1 }, "", url(tag)); } catch (e) {} },
      back: function (tag) { if (!tag || top() === tag) go(1); },   // pop only if that level is on top
      home: function () { go(depth()); },
      top: top,
      depth: depth,
      destroy: function () { global.removeEventListener("popstate", onPop); }   // e.g. React effect cleanup
    };
  };

  /* ---------------- D-pad focus ---------------- */
  NOIR.focus = {
    selector: "button, [tabindex='0'], input",
    scope: function () {
      var c = document.querySelector(".noir-confirm:not([hidden])") || document.querySelector(".noir-modal.open");
      return c || document;
    },
    candidates: function () {
      var all = this.scope().querySelectorAll(this.selector), out = [];
      for (var i = 0; i < all.length; i += 1) {
        var r = all[i].getBoundingClientRect();
        if (r.width && r.height && !all[i].disabled && all[i].offsetParent !== null) out.push(all[i]);
      }
      return out;
    },
    move: function (dir) {
      var cur = document.activeElement, list = this.candidates();
      if (!cur || list.indexOf(cur) < 0) { if (list[0]) NOIR.focus.to(list[0]); return; }
      var a = cur.getBoundingClientRect(), ax = a.left + a.width / 2, ay = a.top + a.height / 2, best = null, bs = 1e9;
      for (var i = 0; i < list.length; i += 1) {
        if (list[i] === cur) continue;
        var b = list[i].getBoundingClientRect(), bx = b.left + b.width / 2, by = b.top + b.height / 2;
        var dx = bx - ax, dy = by - ay, main, cross;
        if (dir === "left") { main = -dx; cross = dy; } else if (dir === "right") { main = dx; cross = dy; }
        else if (dir === "up") { main = -dy; cross = dx; } else { main = dy; cross = dx; }
        if (main <= 4) continue;
        var s = main + Math.abs(cross) * (dir === "left" || dir === "right" ? 4 : 0.6);   // rows: stay on the same line
        if (s < bs) { bs = s; best = list[i]; }
      }
      if (best) NOIR.focus.to(best);
    },
    to: function (el) {
      try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); }
      var sc = el.closest(".noir-row-scroll");
      if (sc) {
        var pad = sc.clientWidth * 0.04 + 6;
        if (el.offsetLeft - pad < sc.scrollLeft) sc.scrollLeft = Math.max(0, el.offsetLeft - pad);
        else if (el.offsetLeft + el.offsetWidth + pad > sc.scrollLeft + sc.clientWidth) sc.scrollLeft = el.offsetLeft + el.offsetWidth + pad - sc.clientWidth;
      }
      var r = el.getBoundingClientRect(), vh = global.innerHeight;
      if (r.top < 80 || r.bottom > vh - 8) global.scrollBy(0, r.top - Math.min(140, vh * 0.2));
    },
    init: function () {
      if (NOIR.focus._on) return;                    // install once
      NOIR.focus._on = true;
      document.addEventListener("keydown", function (e) {
        if (e.defaultPrevented) return;
        var k = e.keyCode, dir = k === 37 ? "left" : k === 38 ? "up" : k === 39 ? "right" : k === 40 ? "down" : "";
        if (!dir) return;
        var a = document.activeElement;
        if (a && a.tagName === "INPUT" && (dir === "left" || dir === "right")) return;
        e.preventDefault();
        NOIR.focus.move(dir);
      });
    }
  };

  /* ---------------- long press (touch 500 ms, remote OK held >= 600 ms) ---------------- */
  NOIR.longPress = function (container, selector, cb) {
    var t = 0, sx = 0, sy = 0, fired = 0, okDown = 0, okEl = null;
    container.addEventListener("touchstart", function (e) {
      var el = e.target.closest(selector); if (!el) return;
      sx = e.touches[0].clientX; sy = e.touches[0].clientY;
      clearTimeout(t); t = setTimeout(function () { fired = Date.now(); cb(el); }, 500);
    }, { passive: true });
    container.addEventListener("touchmove", function (e) {
      if (Math.abs(e.touches[0].clientX - sx) > 10 || Math.abs(e.touches[0].clientY - sy) > 10) clearTimeout(t);
    }, { passive: true });
    container.addEventListener("touchend", function () { clearTimeout(t); }, { passive: true });
    container.addEventListener("contextmenu", function (e) { if (e.target.closest(selector)) e.preventDefault(); });
    container.addEventListener("click", function (e) { if (fired && Date.now() - fired < 800) { e.preventDefault(); e.stopPropagation(); fired = 0; } }, true);
    container.addEventListener("keydown", function (e) {
      if (e.keyCode !== 13) return;
      var el = e.target.closest && e.target.closest(selector); if (!el) return;
      e.preventDefault();                          // hold back the click; decide on keyup
      if (!okDown) { okDown = Date.now(); okEl = el; }
      else if (Date.now() - okDown >= 600 && okEl) { var x = okEl; okEl = null; fired = Date.now(); cb(x); }
    });
    container.addEventListener("keyup", function (e) {
      if (e.keyCode !== 13 || !okDown) return;
      var el = okEl, held = Date.now() - okDown; okDown = 0; okEl = null;
      if (!el) return;
      if (held >= 600) { fired = Date.now(); cb(el); } else el.click();
    });
  };

  /* ---------------- toast ---------------- */
  var toastEl = null, toastT = 0;
  NOIR.toast = function (msg, ms) {
    if (!toastEl) { toastEl = document.createElement("div"); toastEl.className = "noir-toast"; document.body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("show"); }, ms || 1600);
  };

  /* ---------------- confirm dialog ---------------- */
  NOIR.confirm = function (el, nav) {
    var yes = null, last = null;
    var api = {
      open: function (text, onYes) {
        yes = onYes; last = document.activeElement;
        el.querySelector("p").textContent = text;
        el.hidden = false;
        if (nav) nav.push("confirm");
        NOIR.focus.to(el.querySelector("[data-no]"));
      },
      close: function (ok, fromPop) {
        if (el.hidden) return;
        el.hidden = true;
        if (!fromPop && nav) nav.back("confirm");
        var f = yes; yes = null;
        if (ok && f) f(); else if (last && NOIR.input.isKeyboard()) NOIR.focus.to(last);
      },
      isOpen: function () { return !el.hidden; }
    };
    el.addEventListener("click", function (e) {
      if (e.target.closest("[data-yes]")) api.close(true);
      else if (e.target.closest("[data-no]") || e.target === el) api.close(false);
    });
    return api;
  };

  /* ---------------- detail sheet ---------------- */
  NOIR.sheet = function (modal, nav) {
    var openEl = null;
    var api = {
      open: function (fill) {
        openEl = document.activeElement;
        if (fill) fill(modal);
        modal.scrollTop = 0;
        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
        if (nav) nav.push("detail");
        var first = modal.querySelector("[data-autofocus]");
        if (first && NOIR.input.isKeyboard()) NOIR.focus.to(first);
      },
      close: function (fromPop) {
        if (!modal.classList.contains("open")) return;
        modal.classList.remove("open");                 // CSS slides the sheet down + fades the scrim (200 ms)
        modal.setAttribute("aria-hidden", "true");
        if (!fromPop && nav) nav.back("detail");
        if (NOIR.input.isKeyboard()) { if (openEl && document.body.contains(openEl)) NOIR.focus.to(openEl); }
        else if (document.activeElement && document.activeElement.blur) document.activeElement.blur();   // touch: no scroll jump
      },
      isOpen: function () { return modal.classList.contains("open"); }
    };
    modal.addEventListener("click", function (e) { if (e.target === modal || e.target.closest("[data-close]")) api.close(); });
    return api;
  };

  /* ---------------- management mode ----------------
   * opts: { grid, bar: {all, del, done, note}, items: () => [{id, title, art}], render: (item, selected) => html,
   *         onDelete: (ids) => void, confirm: NOIR.confirm instance, what: "items" }
   */
  NOIR.manager = function (opts) {
    var sel = {}, items = [];
    function ids() { var o = []; for (var k in sel) o.push(k); return o; }
    function tools() {
      var n = ids().length, tot = items.length;
      opts.bar.del.textContent = "Delete selected" + (n ? " (" + n + ")" : "");
      opts.bar.all.textContent = tot && n === tot ? "Select none" : "Select all";
      if (opts.bar.note) opts.bar.note.textContent = tot ? tot + " " + (opts.what || "items") + " · tap to select, × removes one" : "Nothing left here";
    }
    function render(focusId) {
      items = opts.items();
      var h = "", seen = {};
      for (var i = 0; i < items.length; i += 1) {
        var it = items[i], id = String(it.id); seen[id] = 1;
        h += '<div class="noir-mitem' + (sel[id] ? " on" : "") + '" data-mid="' + id + '">' +
             '<button type="button" class="noir-card" data-msel="' + id + '" aria-pressed="' + (!!sel[id]) + '">' + opts.render(it) +
             '<span class="noir-mchk">' + (sel[id] ? "&#10003;" : "") + "</span></button>" +
             '<button type="button" class="noir-mx" data-mx="' + id + '" aria-label="Remove">&#10005;</button></div>';
      }
      for (var k in sel) if (!seen[k]) delete sel[k];
      opts.grid.innerHTML = h;
      tools();
      if (NOIR.input.isKeyboard()) {
        var f = focusId && opts.grid.querySelector('[data-msel="' + focusId + '"]');
        NOIR.focus.to(f || opts.grid.querySelector("[data-msel]") || opts.bar.done);
      }
    }
    function remove(list) {
      if (!list.length) return;
      opts.onDelete(list);
      for (var i = 0; i < list.length; i += 1) delete sel[list[i]];
      NOIR.toast("Removed " + list.length);
      render();
    }
    opts.grid.addEventListener("click", function (e) {
      var x = e.target.closest("[data-mx]");
      if (x) { remove([x.getAttribute("data-mx")]); return; }
      var c = e.target.closest("[data-msel]");
      if (c) {
        var id = c.getAttribute("data-msel");
        if (sel[id]) delete sel[id]; else sel[id] = 1;
        c.parentNode.classList.toggle("on", !!sel[id]);
        c.setAttribute("aria-pressed", String(!!sel[id]));
        c.querySelector(".noir-mchk").innerHTML = sel[id] ? "&#10003;" : "";
        tools();
      }
    });
    opts.bar.all.addEventListener("click", function () {
      var n = ids().length;
      sel = {};
      if (n !== items.length) for (var i = 0; i < items.length; i += 1) sel[String(items[i].id)] = 1;
      render();
    });
    opts.bar.del.addEventListener("click", function () {
      var list = ids();
      if (!list.length) { NOIR.toast("Select something first"); return; }
      opts.confirm.open("Delete " + list.length + " " + (opts.what || "items") + "?", function () { remove(list); });
    });
    return { open: function (preselect) { sel = {}; if (preselect) sel[preselect] = 1; render(preselect); }, render: render };
  };

  global.NOIR = NOIR;
})(typeof window !== "undefined" ? window : {});
