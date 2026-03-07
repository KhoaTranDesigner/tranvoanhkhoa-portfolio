function sayHello() {
  alert("Welcome to Khoa's Portfolio 🔥");
}
const header = document.querySelector("header");

let animationFrameId = null;
let isScrolling = false;

function smoothScrollTo(target, duration = 800) {
  cancelScroll(); // tránh chồng animation

  const start = window.pageYOffset;
  const distance = target - start;
  let startTime = null;
  isScrolling = true;

  function animation(currentTime) {
    if (!startTime) startTime = currentTime;

    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);

    const ease = progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    window.scrollTo(0, start + distance * ease);

    if (progress < 1 && isScrolling) {
      animationFrameId = requestAnimationFrame(animation);
    } else {
      isScrolling = false;
    }
  }

  animationFrameId = requestAnimationFrame(animation);
}

function cancelScroll() {
  if (isScrolling) {
    cancelAnimationFrame(animationFrameId);
    isScrolling = false;
  }
}
document.addEventListener("DOMContentLoaded", function () {
  const marquees = document.querySelectorAll(".marquee");

  marquees.forEach(marquee => {
    const track = marquee.querySelector(".track");
    if (!track) return;

    const marqueeWidth = marquee.offsetWidth;
    let trackWidth = track.scrollWidth;

    const originalContent = track.innerHTML;

    while (trackWidth < marqueeWidth * 2) {
      track.innerHTML += originalContent;
      trackWidth = track.scrollWidth;
    }
  });
});
// 🔹 Anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {

    const href = this.getAttribute("href");

    e.preventDefault();

    // Scroll về đầu nếu là "#"
    if (href === "#") {
      smoothScrollTo(0);
      return;
    }

    const target = document.querySelector(href);
    if (!target) return;

    const headerHeight = header ? header.offsetHeight + 80 : 0;
    const targetPosition = target.offsetTop - headerHeight;

    smoothScrollTo(targetPosition);
  });
});
// 🔹 Click vào graphics designer
const subTitle = document.querySelector(".sub-title");
if (subTitle) {
  subTitle.addEventListener("click", function () {
    smoothScrollTo(0);
  });
}
window.addEventListener("load", () => {
  setTimeout(() => {
    document.body.classList.remove("loading");
  }, 2800);
});
document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".marquee-section");

  function triggerShine(section) {
    section.classList.add("shine-active");

    setTimeout(() => {
      section.classList.remove("shine-active");

      const randomDelay = Math.random() * 6000 + 4000;
      setTimeout(() => triggerShine(section), randomDelay);

    }, 4000);
  }

  sections.forEach(section => {
    triggerShine(section);
  });
});
document.querySelector(".name-container")
  .classList.add("start-animation");
history.scrollRestoration = "manual";
window.scrollTo(0, 0);
// 🔹 Cancel khi user tác động
window.addEventListener("wheel", cancelScroll, { passive: true });
window.addEventListener("touchstart", cancelScroll, { passive: true });
window.addEventListener("keydown", cancelScroll);
