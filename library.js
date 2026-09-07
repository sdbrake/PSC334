/* Library shell. Course content belongs in course.js, not here.
   Decks report their position through the small deck-player.js bridge.
   No fetch(), CDN, framework, or build step: local files also work. */
(() => {
  "use strict";
  const course = window.COURSE;
  const $ = id => document.getElementById(id);
  const frame = $("deck");
  let activeLecture = null;
  let loadTimer;

  document.title = `${course.title} — Lecture review`;
  $("course-title").textContent = course.title;
  $("course-code").textContent = course.code;
  $("course-subtitle").textContent = course.subtitle;
  $("lecture-total").textContent = String(course.lectures.length).padStart(2, "0");

  function setMenu(open) {
    document.querySelector(".sidebar").classList.toggle("menu-open", open);
    $("menu-toggle").setAttribute("aria-expanded", String(open));
  }
  $("menu-toggle").addEventListener("click", () => setMenu($("menu-toggle").getAttribute("aria-expanded") !== "true"));

  function selectLecture(lecture, index) {
    activeLecture = lecture;
    setMenu(false);
    if (matchMedia("(max-width: 800px)").matches) $("menu-toggle").focus();
    $("lecture-title").textContent = lecture.title;
    $("lecture-number").textContent = `LECTURE ${String(index + 1).padStart(2, "0")} / REVIEW`;
    $("slide-count").textContent = "Loading slides…";
    $("previous").disabled = $("next").disabled = true;
    $("fullscreen").disabled = true;
    $("progress-fill").style.width = "0%";
    frame.hidden = true;
    $("viewer-message").hidden = false;
    $("viewer-message").textContent = "Loading lecture…";
    document.querySelectorAll(".lecture-item").forEach((button, position) => {
      button.setAttribute("aria-current", String(position === index));
    });
    frame.title = `${lecture.title} — slides`;
    frame.src = lecture.file;
    clearTimeout(loadTimer);
    loadTimer = setTimeout(() => {
      $("viewer-message").textContent = "This lecture could not be opened. Check its file path and deck-player.js link in the review copy.";
      $("slide-count").textContent = "Lecture unavailable";
    }, 8000);
  }

  course.lectures.forEach((lecture, index) => {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.className = "lecture-item";
    button.disabled = !lecture.file;
    const number = document.createElement("span");
    number.className = "lecture-index";
    number.textContent = String(index + 1).padStart(2, "0");
    number.setAttribute("aria-hidden", "true");
    const label = document.createElement("span");
    label.className = "lecture-label";
    label.textContent = lecture.title;
    if (!lecture.file) {
      const status = document.createElement("span");
      status.className = "coming-soon";
      status.textContent = "Coming soon";
      label.append(status);
    }
    button.append(number, label);
    button.addEventListener("click", () => selectLecture(lecture, index));
    item.append(button);
    $("lecture-list").append(item);
  });

  window.addEventListener("message", event => {
    if (event.source !== frame.contentWindow || !activeLecture) return;
    // Local file previews have origin "null". Hosted decks must be same-origin.
    if (event.origin !== (location.protocol === "file:" ? "null" : location.origin)) return;
    if (event.data?.type === "chartroom:exit") { exitFullscreen(); return; }
    const state = event.data;
    if (state?.type !== "chartroom:state" || !Number.isInteger(state.index) ||
        !Number.isInteger(state.total) || state.total < 1 || state.index < 0 || state.index >= state.total) return;
    clearTimeout(loadTimer);
    frame.hidden = false;
    $("viewer-message").hidden = true;
    $("slide-count").textContent = `Slide ${state.index + 1} of ${state.total}`;
    $("progress-fill").style.width = `${(state.index + 1) / state.total * 100}%`;
    $("previous").disabled = state.index === 0;
    $("next").disabled = state.index === state.total - 1;
    $("fullscreen").disabled = false;
  });

  // The fallback behaves like a modal: background content cannot receive focus.
  const backgroundState = new Map();
  function enterFocusMode() {
    document.querySelectorAll(".sidebar, .skip-link, .lecture-heading, .reader-footer").forEach(element => {
      backgroundState.set(element, element.inert);
      element.inert = true;
    });
    document.body.classList.add("focus-mode");
  }
  document.addEventListener("focusin", event => {
    if (document.body.classList.contains("focus-mode") && !$("presentation").contains(event.target)) {
      $("exit-fullscreen").focus();
    }
  });

  async function exitFullscreen() {
    if (document.fullscreenElement) await document.exitFullscreen();
    document.body.classList.remove("focus-mode");
    backgroundState.forEach((wasInert, element) => { element.inert = wasInert; });
    backgroundState.clear();
    $("fullscreen").focus();
  }
  $("fullscreen").addEventListener("click", async () => {
    try {
      if (!$("presentation").requestFullscreen) throw new Error("Fullscreen unsupported");
      await $("presentation").requestFullscreen();
    } catch {
      // Embedded previews / mobile browsers may deny the Fullscreen API.
      enterFocusMode();
    }
    $("exit-fullscreen").focus();
  });
  $("exit-fullscreen").addEventListener("click", exitFullscreen);
  document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement) $("fullscreen").focus();
  });

  function command(action) {
    if (frame.hidden) return;
    frame.contentWindow.postMessage({type: "chartroom:command", action}, location.protocol === "file:" ? "*" : location.origin);
  }
  $("previous").addEventListener("click", () => command("previous"));
  $("next").addEventListener("click", () => command("next"));

  document.addEventListener("keydown", event => {
    if (event.key === "Tab" && document.body.classList.contains("focus-mode")) {
      const controls = Array.from($("presentation").querySelectorAll("button:not(:disabled), iframe:not([hidden])"))
        .filter(element => element.getClientRects().length);
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    }
    if (event.key === "Escape") { exitFullscreen(); setMenu(false); return; }
    if (event.target.closest("input, textarea, select, [contenteditable='true']") || event.altKey || event.ctrlKey || event.metaKey) return;
    // Space on a focused button keeps its native activation behavior.
    if (event.key === " " && event.target.closest("button, a")) return;
    const actions = {ArrowRight: "next", PageDown: "next", " ": "next", ArrowLeft: "previous", PageUp: "previous", Home: "first", End: "last"};
    if (actions[event.key]) { event.preventDefault(); command(actions[event.key]); }
  });

  const first = course.lectures.findIndex(lecture => lecture.file);
  if (first !== -1) selectLecture(course.lectures[first], first);
})();
