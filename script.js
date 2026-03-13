function sayHello() {
  alert("Welcome to Khoa's Portfolio 🔥");
}
const header = document.querySelector("header");

let animationFrameId = null;
let isScrolling = false;
const isMobile = window.matchMedia("(max-width:768px)").matches
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
// 🔹 Anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {

    e.preventDefault()

    const href = this.getAttribute("href")
    const target = document.querySelector(href)
    if (!target) return

    const headerHeight = header ? header.offsetHeight + 80 : 0
    const targetPosition = target.offsetTop - headerHeight

    if (isMobile) {

      window.scrollTo(0, targetPosition)   // ⭐ NHẢY THẲNG → mượt mobile

    } else {

      smoothScrollTo(targetPosition)       // ⭐ giữ hiệu ứng desktop

    }

  })
})
// 🔹 Click vào graphics designer
const subTitle = document.querySelector(".sub-title");

if (subTitle) {
  subTitle.addEventListener("click", function () {


    if (isMobile) {
      window.scrollTo(0, 0)
    } else {
      smoothScrollTo(0)
    }

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
const tracks = document.querySelectorAll(".marquee-track")

tracks.forEach(track => {

  const content = track.innerHTML
  track.innerHTML += content   // duplicate 1 lần

  let position = 0
  const speed = 0.3

  function animate() {

    position -= speed

    if (Math.abs(position) >= track.scrollWidth / 2) {
      position = 0
    }

    track.style.transform = `translateX(${position}px)`

    requestAnimationFrame(animate)
  }

  animate()

})

document.querySelector(".name-container")
  .classList.add("start-animation");
history.scrollRestoration = "manual";
window.scrollTo(0, 0);
// 🔹 Cancel khi user tác động
window.addEventListener("wheel", cancelScroll, { passive: true });
window.addEventListener("touchstart", cancelScroll, { passive: true });
window.addEventListener("keydown", cancelScroll);
const hamburger = document.getElementById("hamburger")

if (hamburger) {

  const mobileMenu = document.getElementById("mobileMenu")
  const overlay = document.getElementById("menuOverlay")

  hamburger.addEventListener("click", () => {

    hamburger.classList.toggle("active")
    mobileMenu.classList.toggle("show")
    overlay.classList.toggle("show")

  })

}
if (isMobile) {

  const revealElements = document.querySelectorAll(".reveal")

  const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {
        entry.target.classList.add("show")
      }

    })

  }, {
    threshold: 0.15
  })

  revealElements.forEach(el => {
    observer.observe(el)
  })

}
const grid = document.querySelector('.material-grid')
const dots = document.querySelectorAll('.m-dot')

grid.addEventListener('scroll', () => {

  const scrollLeft = grid.scrollLeft
  const cardWidth = grid.querySelector('.material-card').offsetWidth + 18

  let index = Math.round(scrollLeft / cardWidth)

  dots.forEach(d => d.classList.remove('active'))

  if (dots[index]) {
    dots[index].classList.add('active')
  }

})
