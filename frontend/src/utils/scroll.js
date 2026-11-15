// scroll.js — smooth-scroll to a section of the single page.
// Use it as the onClick of an <a href="#results">. If the section is missing,
// the browser simply follows the #link as usual.
export function scrollToSection(event, id) {
  const target = document.getElementById(id);
  if (!target) return;
  event.preventDefault();
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
}