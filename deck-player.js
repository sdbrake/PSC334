/* Review player for chartroom HTML decks.
   Replace the review copy's old navigation script with a link to this file.
   Supported markup: #canvas (fixed-size slide canvas), .s (each slide).
   All slide content and styling remain in the lecture HTML. */
(() => {
  "use strict";
  const slides = Array.from(document.querySelectorAll("#canvas .s"));
  const canvas = document.getElementById("canvas");
  // Review is immediate: no crossfades that overlap text during quick paging.
  slides.forEach(slide => { slide.style.transition = "none"; });
  let index = 0;
  if (!canvas || !slides.length) return;
  // Existing chartroom reveal classes: main bullets use .on; sublists use .vis.
  canvas.querySelectorAll(".rail .f").forEach(bullet => bullet.classList.add("on"));
  canvas.querySelectorAll(".rail .conseq").forEach(list => list.classList.add("vis"));

  function report() {
    if (parent !== window) parent.postMessage({ type: "chartroom:state", index, total: slides.length }, location.protocol === "file:" ? "*" : location.origin);
  }
  function show(position) {
    index = Math.max(0, Math.min(position, slides.length - 1));
    slides.forEach((slide, number) => {
      slide.classList.toggle("on", number === index);
      slide.setAttribute("aria-hidden", String(number !== index));
      slide.inert = number !== index;
    });
    report();
  }
  function scale() {
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    const factor = Math.min(innerWidth / width, innerHeight / height);
    canvas.style.transform = `scale(${factor})`;
    canvas.style.left = `${(innerWidth - width * factor) / 2}px`;
    canvas.style.top = `${(innerHeight - height * factor) / 2}px`;
  }
  window.addEventListener("message", event => {
    if (event.source !== parent || event.origin !== (location.protocol === "file:" ? "null" : location.origin)) return;
    if (event.data?.type !== "chartroom:command") return;
    if (event.data.action === "next") show(index + 1);
    if (event.data.action === "previous") show(index - 1);
    if (event.data.action === "first") show(0);
    if (event.data.action === "last") show(slides.length - 1);
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && parent !== window) {
      parent.postMessage({type: "chartroom:exit"}, location.protocol === "file:" ? "*" : location.origin);
      return;
    }
    if (event.target.closest("input, textarea, select, [contenteditable='true']") || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === " " && event.target.closest("button, a")) return;
    const positions = {ArrowRight: index + 1, PageDown: index + 1, " ": index + 1, ArrowLeft: index - 1, PageUp: index - 1, Home: 0, End: slides.length - 1};
    if (Object.hasOwn(positions, event.key)) { event.preventDefault(); show(positions[event.key]); }
  });
  // Review navigation never reads or writes saved teaching positions.
  const progress = document.getElementById("progress");
  if (progress) progress.hidden = true;
  window.addEventListener("resize", scale);
  scale();
  show(0);
})();
