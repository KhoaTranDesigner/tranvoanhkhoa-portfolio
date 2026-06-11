function sayHello() {
  alert("Welcome to Khoa's Portfolio 🔥");
}
const header = document.querySelector("header");

let animationFrameId = null;
let isScrolling = false;
const isMobile = window.matchMedia("(max-width:768px)").matches
const runWhenIdle = (callback, timeout = 1200) => {
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(callback, { timeout });
    return;
  }

  window.setTimeout(callback, 250);
};
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
  }, 300);
});

if (header) {
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 50);
  }, { passive: true });
}
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
const marqueeStates = [...document.querySelectorAll(".marquee-track")].map(track => {
  const content = track.innerHTML
  track.innerHTML += content

  return {
    track,
    position: 0,
    visible: true,
    speed: isMobile ? 0.18 : 0.3
  }
})

if (marqueeStates.length) {
  const marqueeObserver = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const state = marqueeStates.find(item => item.track === entry.target)
        if (state) state.visible = entry.isIntersecting
      })
    })
    : null

  marqueeStates.forEach(state => marqueeObserver?.observe(state.track))

  function animateMarquees() {
    marqueeStates.forEach(state => {
      if (!state.visible) return

      state.position -= state.speed

      if (Math.abs(state.position) >= state.track.scrollWidth / 2) {
        state.position = 0
      }

      state.track.style.transform = `translate3d(${state.position}px, 0, 0)`
    })

    requestAnimationFrame(animateMarquees)
  }

  requestAnimationFrame(animateMarquees)
}

document.querySelector(".name-container")?.classList.add("start-animation");

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
const grid = document.querySelector('.material-grid')
const dots = document.querySelectorAll('.m-dot')

if (grid && dots.length) {

  grid.addEventListener('scroll', () => {

    const scrollLeft = grid.scrollLeft
    const card = grid.querySelector('.material-card')

    if (!card) return

    const cardWidth = card.offsetWidth + 18

    let index = Math.round(scrollLeft / cardWidth)

    dots.forEach(d => d.classList.remove('active'))

    if (dots[index]) {
      dots[index].classList.add('active')
    }

  })

}

// =======================================================
// TÍNH NĂNG XEM ẢNH CHUYÊN NGHIỆP CÓ ZOOM (FANCYBOX)
// =======================================================
document.addEventListener("DOMContentLoaded", () => {
  // Nếu trang có class no-zoom-page thì bỏ qua
  if (document.body.classList.contains("no-zoom-page")) return;

  // 1. Tự động chèn thư viện CSS của Fancybox
  const fancyboxCSS = document.createElement("link");
  fancyboxCSS.rel = "stylesheet";
  fancyboxCSS.href = "https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.css";
  document.head.appendChild(fancyboxCSS);

  // 2. Tự động chèn thư viện JS của Fancybox
  const fancyboxJS = document.createElement("script");
  fancyboxJS.src = "https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.umd.js";
  document.body.appendChild(fancyboxJS);

  // 3. Kích hoạt tính năng sau khi thư viện tải xong
  fancyboxJS.onload = () => {
    // 1. Gắn Fancybox cho các ảnh lẻ bình thường (Code cũ của Khoa)
    const imageSelector = "img:not(.nav-item img, #logo img, .social-icons img, .skill-item img, .no-zoom)";
    Fancybox.bind(imageSelector, {
      Hash: false,
      Toolbar: { display: { left: [], middle: ["zoomIn", "zoomOut", "toggle1to1"], right: ["close"] } },
      Images: { zoom: true }
    });

    // 2. Gắn Fancybox cho Album KOL 18 tấm (ĐOẠN CODE BỔ SUNG)
    Fancybox.bind('[data-fancybox="kol-gallery"]', {
      Hash: false,
      Toolbar: { display: { left: [], middle: ["zoomIn", "zoomOut", "toggle1to1"], right: ["close"] } },
      Images: { zoom: true }
    });
  };
});

// =======================================================
// THUMBNAIL + POPUP CHO TOÀN BỘ VIDEO YOUTUBE NHÚNG
// =======================================================
document.addEventListener("DOMContentLoaded", () => {
  const youtubeFrames = [...document.querySelectorAll(
    '.md-shorts-frame iframe[src*="youtube"], .md-landscape-frame iframe[src*="youtube"], .shorts-wrapper iframe[src*="youtube"]'
  )];

  if (!youtubeFrames.length) return;

  const stopProjectYoutubeVideos = () => {
    document.querySelectorAll(".fancybox__container iframe").forEach((iframe) => {
      iframe.src = "about:blank";
      iframe.remove();
    });
  };

  const openProjectYoutubeVideo = (poster) => {
    if (!window.Fancybox) {
      window.open(`https://www.youtube.com/watch?v=${poster.dataset.videoId}`, "_blank", "noopener");
      return;
    }

    const currentInstance = Fancybox.getInstance?.();
    if (currentInstance) currentInstance.close();
    stopProjectYoutubeVideos();

    Fancybox.show([{
      src: poster.href,
      type: "iframe",
      width: Number(poster.dataset.width),
      height: Number(poster.dataset.height),
      caption: poster.dataset.caption
    }], {
      Hash: false,
      dragToClose: false,
      Toolbar: {
        display: {
          left: [],
          middle: [],
          right: ["close"]
        }
      },
      on: {
        close: stopProjectYoutubeVideos,
        destroy: stopProjectYoutubeVideos
      }
    });
  };

  youtubeFrames.forEach((iframe, index) => {
    const source = iframe.getAttribute("src") || "";
    const match = source.match(/\/embed\/([A-Za-z0-9_-]{11})/);
    if (!match) return;

    const videoId = match[1];
    const frame = iframe.parentElement;
    const isVertical = frame.classList.contains("md-shorts-frame") ||
      frame.classList.contains("shorts-wrapper");
    const poster = document.createElement("a");
    const thumbnail = document.createElement("img");
    const playIcon = document.createElement("span");
    const title = iframe.getAttribute("title") || `YouTube video ${index + 1}`;

    poster.className = "youtube-poster";
    poster.href = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
    poster.dataset.videoId = videoId;
    poster.dataset.width = isVertical ? "405" : "960";
    poster.dataset.height = isVertical ? "720" : "540";
    poster.dataset.caption = title;
    poster.setAttribute("aria-label", `Phát ${title}`);

    thumbnail.className = "youtube-poster-thumb no-zoom";
    thumbnail.src = isVertical
      ? `https://i.ytimg.com/vi/${videoId}/oar2.jpg`
      : `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
    thumbnail.dataset.fallback = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    thumbnail.alt = title;
    thumbnail.loading = "lazy";
    thumbnail.decoding = "async";
    thumbnail.addEventListener("error", () => {
      const fallback = thumbnail.dataset.fallback;
      if (!fallback) return;
      thumbnail.src = fallback;
      thumbnail.removeAttribute("data-fallback");
    });

    playIcon.className = "youtube-poster-play";
    playIcon.setAttribute("aria-hidden", "true");
    poster.append(thumbnail, playIcon);
    poster.addEventListener("click", (event) => {
      event.preventDefault();
      openProjectYoutubeVideo(poster);
    });

    iframe.replaceWith(poster);
    frame.querySelector(".youtube-cover")?.remove();
  });
});
// =======================================================
// HIỆU ỨNG CUỘN TRANG (AOS - ANIMATE ON SCROLL)
// =======================================================
document.addEventListener("DOMContentLoaded", () => {
  runWhenIdle(() => {
    const animateElements = document.querySelectorAll('.project-card, .service-card, .material-card, .phil-card, .sw-card');

    if (!animateElements.length) return;

    const aosCSS = document.createElement("link");
    aosCSS.rel = "stylesheet";
    aosCSS.href = "https://unpkg.com/aos@2.3.1/dist/aos.css";
    document.head.appendChild(aosCSS);

    const aosJS = document.createElement("script");
    aosJS.src = "https://unpkg.com/aos@2.3.1/dist/aos.js";
    aosJS.async = true;
    document.body.appendChild(aosJS);

    aosJS.onload = () => {
      animateElements.forEach((el, index) => {
        el.setAttribute('data-aos', 'fade-up');
        el.setAttribute('data-aos-delay', (index % 3) * 150);
      });

      AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 50
      });
    };
  }, 1000);
});
// =======================================================
// THANH TIẾN TRÌNH ĐỌC (READING PROGRESS BAR)
// =======================================================
document.addEventListener("DOMContentLoaded", () => {
  // 1. Tự động tạo khối HTML cho thanh tiến trình và chèn vào web
  const progressContainer = document.createElement("div");
  progressContainer.classList.add("progress-container");

  const progressBar = document.createElement("div");
  progressBar.classList.add("progress-bar");

  progressContainer.appendChild(progressBar);
  document.body.appendChild(progressContainer);
});

// 1. Khai báo key lưu trữ duy nhất cho từng trang
const scrollKey = 'scrollPosition_' + window.location.pathname;

// 2. Dùng 'pagehide' thay cho 'beforeunload' để không phá vỡ bộ nhớ đệm (BFCache) trên iPhone
window.addEventListener('pagehide', () => {
  sessionStorage.setItem(scrollKey, window.scrollY);
});
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
// 3. Xử lý khi trang hiển thị
window.addEventListener('pageshow', (event) => {
  // 1. Kiểm tra xem có lệnh reset từ Logo không
  const isReset = sessionStorage.getItem('resetScroll') === 'true';

  // 2. Nếu là reset từ Logo thì xóa cờ hiệu và cuộn về đầu
  if (isReset) {
    sessionStorage.removeItem('resetScroll');
    window.scrollTo(0, 0);
    return; // Dừng lại, không chạy code nhớ vị trí nữa
  }

  // 3. Nếu không phải reset thì mới chạy logic nhớ vị trí cũ
  const scrollPos = sessionStorage.getItem(scrollKey);
  if (scrollPos) {
    setTimeout(() => {
      window.scrollTo({
        top: parseInt(scrollPos),
        behavior: 'instant'
      });
    }, 100);
  }
});
