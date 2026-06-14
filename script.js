const header = document.querySelector("header");

let animationFrameId = null;
let isScrolling = false;
const isMobile = window.matchMedia("(max-width:768px)").matches

document.querySelectorAll(".page-back-button").forEach((button) => {
  let hasLeftPageTop = false;
  let idleTimer = null;

  const showBackButton = () => {
    button.classList.remove("is-idle");
    window.clearTimeout(idleTimer);

    if (!button.classList.contains("is-hidden")) {
      idleTimer = window.setTimeout(() => {
        button.classList.add("is-idle");
      }, 1400);
    }
  };

  const updateBackButton = () => {
    const isAtPageTop = window.scrollY <= 8;

    if (!isAtPageTop) {
      hasLeftPageTop = true;
      button.classList.remove("is-hidden");
      button.classList.add("is-scroll-top");
      button.setAttribute("aria-label", "Cuộn lên đầu trang");
      showBackButton();
      return;
    }

    button.classList.remove("is-scroll-top");
    button.classList.toggle("is-hidden", !hasLeftPageTop);
    button.setAttribute("aria-label", "Quay lại trang chủ");
    showBackButton();
  };

  button.addEventListener("click", () => {
    if (window.scrollY > 8) {
      if (isMobile) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        smoothScrollTo(0);
      }
      return;
    }

    window.location.href = "index.html#Project";
  });

  window.addEventListener("scroll", updateBackButton, { passive: true });
  button.addEventListener("pointerenter", showBackButton);
  button.addEventListener("focus", showBackButton);
  button.addEventListener("touchstart", showBackButton, { passive: true });
  updateBackButton();
});

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

    if (isMobile) {
      const mobileMenu = document.getElementById("mobileMenu")
      const mobileCoverHeight = Math.max(
        header?.offsetHeight || 0,
        mobileMenu?.offsetHeight || 0
      )

      const targetTop = target.getBoundingClientRect().top + window.scrollY
      const targetPosition = targetTop - mobileCoverHeight

      window.scrollTo(0, targetPosition)   // ⭐ NHẢY THẲNG → mượt mobile

    } else {
      const headerHeight = header ? header.offsetHeight : 0
      const targetTop = target.getBoundingClientRect().top + window.scrollY
      const targetPosition = targetTop - headerHeight

      smoothScrollTo(targetPosition)       // ⭐ giữ hiệu ứng desktop

    }

  })
})
// 🔹 Click vào graphics designer
const sectionIndexLinks = [...document.querySelectorAll(".section-index-link")];

if (sectionIndexLinks.length) {
  const indexedSections = sectionIndexLinks
    .map((link) => document.getElementById(link.dataset.section))
    .filter(Boolean);
  let sectionIndexFrame = null;

  const updateSectionIndex = () => {
    sectionIndexFrame = null;
    const readingLine = window.innerHeight * 0.42;
    let activeSection = indexedSections[0];

    indexedSections.forEach((section) => {
      if (section.getBoundingClientRect().top <= readingLine) {
        activeSection = section;
      }
    });

    sectionIndexLinks.forEach((link) => {
      const isActive = link.dataset.section === activeSection?.id;
      link.classList.toggle("is-active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const requestSectionIndexUpdate = () => {
    if (sectionIndexFrame !== null) return;
    sectionIndexFrame = window.requestAnimationFrame(updateSectionIndex);
  };

  window.addEventListener("scroll", requestSectionIndexUpdate, { passive: true });
  window.addEventListener("resize", requestSectionIndexUpdate, { passive: true });
  updateSectionIndex();
}

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
const replayLogoAnimation = () => {
  const animations = window.lottie?.getRegisteredAnimations?.() || [];

  animations.forEach((animation) => {
    if (animation.wrapper?.id === "logo") {
      animation.goToAndPlay(0, true);
    }
  });
};

window.addEventListener("load", () => {
  setTimeout(() => {
    document.body.classList.remove("loading");
    window.requestAnimationFrame(replayLogoAnimation);
  }, 300);
});

window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    window.requestAnimationFrame(replayLogoAnimation);
  }
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
const marqueeTracks = [...document.querySelectorAll(".marquee-track")];

if (marqueeTracks.length) {
  let marqueeFrameId = null;
  const marqueeStates = marqueeTracks.map((track) => {
    const originalItemCount = track.children.length;
    const content = track.innerHTML;
    track.insertAdjacentHTML("beforeend", content);

    return {
      track,
      originalItemCount,
      position: 0,
      loopWidth: track.children[originalItemCount]?.offsetLeft || track.scrollWidth / 2,
      visible: false,
      speed: isMobile ? 0.18 : 0.3
    };
  });

  const stopMarqueeLoop = () => {
    if (marqueeFrameId !== null) {
      window.cancelAnimationFrame(marqueeFrameId);
      marqueeFrameId = null;
    }
  };

  const shouldAnimateMarquees = () =>
    !document.hidden &&
    marqueeStates.some((state) => state.visible);

  const animateMarquees = () => {
    marqueeFrameId = null;
    const pixelRatio = Math.max(1, window.devicePixelRatio || 1);

    marqueeStates.forEach((state) => {
      if (!state.visible) return;

      state.position -= state.speed;
      if (Math.abs(state.position) >= state.loopWidth) {
        state.position += state.loopWidth;
      }

      const pixelAlignedPosition = Math.round(state.position * pixelRatio) / pixelRatio;
      state.track.style.transform = `translate3d(${pixelAlignedPosition}px, 0, 0)`;
    });

    if (shouldAnimateMarquees()) {
      marqueeFrameId = window.requestAnimationFrame(animateMarquees);
    }
  };

  const syncMarqueeLoop = () => {
    const shouldRun = shouldAnimateMarquees();
    marqueeStates.forEach((state) => {
      state.track.classList.toggle("is-running", shouldRun && state.visible);
    });

    if (shouldRun) {
      if (marqueeFrameId === null) {
        marqueeFrameId = window.requestAnimationFrame(animateMarquees);
      }
      return;
    }

    stopMarqueeLoop();
  };

  const refreshMarqueeWidths = () => {
    marqueeStates.forEach((state) => {
      state.loopWidth =
        state.track.children[state.originalItemCount]?.offsetLeft ||
        state.track.scrollWidth / 2;
      if (Math.abs(state.position) >= state.loopWidth) {
        state.position = 0;
        state.track.style.transform = "translate3d(0, 0, 0)";
      }
    });
  };

  const marqueeObserver = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const state = marqueeStates.find((item) => item.track === entry.target);
        if (state) state.visible = entry.isIntersecting;
      });
      syncMarqueeLoop();
    })
    : null;

  marqueeStates.forEach((state) => {
    state.visible = !marqueeObserver;
    marqueeObserver?.observe(state.track);
  });

  document.addEventListener("visibilitychange", syncMarqueeLoop);

  window.addEventListener("resize", () => {
    refreshMarqueeWidths();
  }, { passive: true });

  if (document.fonts?.ready) {
    document.fonts.ready.then(refreshMarqueeWidths);
  }
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
// LIGHTBOX ẢNH BẰNG PHOTOSWIPE
// =======================================================
const PHOTO_SWIPE_VERSION = "5.4.4";
let photoSwipeModulePromise = null;
let photoSwipeStylePromise = null;

const loadPhotoSwipe = () => {
  if (!photoSwipeStylePromise) {
    photoSwipeStylePromise = new Promise((resolve, reject) => {
      const existingStylesheet = document.querySelector('link[data-portfolio-photoswipe]');
      if (existingStylesheet?.sheet) {
        resolve();
        return;
      }

      const stylesheet = existingStylesheet || document.createElement("link");
      stylesheet.rel = "stylesheet";
      stylesheet.href = `https://cdn.jsdelivr.net/npm/photoswipe@${PHOTO_SWIPE_VERSION}/dist/photoswipe.css`;
      stylesheet.dataset.portfolioPhotoswipe = "";
      stylesheet.onload = resolve;
      stylesheet.onerror = reject;

      if (!existingStylesheet) {
        document.head.appendChild(stylesheet);
      }
    });
  }

  if (!photoSwipeModulePromise) {
    photoSwipeModulePromise = import(
      `https://cdn.jsdelivr.net/npm/photoswipe@${PHOTO_SWIPE_VERSION}/dist/photoswipe.esm.js`
    );
  }

  return Promise.all([photoSwipeModulePromise, photoSwipeStylePromise])
    .then(([module]) => module);
};

const getPhotoSwipeItem = (image, source = "") => ({
  src: source || image.dataset.full || image.currentSrc || image.src,
  width: Number(image.getAttribute("width")) || image.naturalWidth || 1600,
  height: Number(image.getAttribute("height")) || image.naturalHeight || 1200,
  msrc: image.currentSrc || image.src,
  alt: image.alt || ""
});

const openPhotoSwipe = async (items, index = 0, thumbnail = null) => {
  if (!items.length) return;

  try {
    const { default: PhotoSwipe } = await loadPhotoSwipe();
    const options = {
      dataSource: items,
      index,
      bgOpacity: 0.96,
      wheelToZoom: true,
      closeOnVerticalDrag: true,
      showHideAnimationType: thumbnail ? "zoom" : "fade"
    };

    if (thumbnail) {
      options.getThumbBoundsFn = () => {
        const bounds = thumbnail.getBoundingClientRect();
        return { x: bounds.left, y: bounds.top, w: bounds.width };
      };
    }

    const lightbox = new PhotoSwipe(options);

    lightbox.on("uiRegister", () => {
      lightbox.ui.registerElement({
        name: "portfolio-caption",
        order: 9,
        isButton: false,
        appendTo: "root",
        html: "",
        onInit: (caption) => {
          const updateCaption = () => {
            const text = lightbox.currSlide?.data?.alt || "";
            caption.textContent = text;
            caption.hidden = !text;
          };

          lightbox.on("change", updateCaption);
          updateCaption();
        }
      });
    });

    lightbox.init();
  } catch (error) {
    window.location.assign(items[index].src);
  }
};

window.PortfolioLightbox = {
  open: openPhotoSwipe,
  itemFromImage: getPhotoSwipeItem
};

document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("click", (event) => {
    const galleryItem = event.target.closest("[data-photoswipe-gallery]");
    if (!galleryItem) return;

    event.preventDefault();
    const galleryName = galleryItem.dataset.photoswipeGallery;
    const galleryItems = [...document.querySelectorAll("[data-photoswipe-gallery]")]
      .filter((item) => item.dataset.photoswipeGallery === galleryName);
    const items = galleryItems.map((item) => {
      const image = item.querySelector("img");
      return {
        src: item.dataset.pswpSrc || item.href || image?.dataset.full || image?.currentSrc || image?.src,
        width: Number(item.dataset.pswpWidth) || Number(image?.getAttribute("width")) || 1080,
        height: Number(item.dataset.pswpHeight) || Number(image?.getAttribute("height")) || 1920,
        msrc: image?.currentSrc || image?.src || "",
        alt: item.dataset.caption || image?.alt || ""
      };
    });

    openPhotoSwipe(items, galleryItems.indexOf(galleryItem), galleryItem.querySelector("img"));
  });

  if (document.body.classList.contains("no-zoom-page")) return;

  const imageSelector = "img:not(.nav-item img, #logo img, .social-icons img, .skill-item img, .no-zoom)";
  document.querySelectorAll(imageSelector).forEach((image) => {
    if (image.closest("[data-photoswipe-gallery]")) return;

    image.addEventListener("click", (event) => {
      event.preventDefault();
      openPhotoSwipe([getPhotoSwipeItem(image)], 0, image);
    });
  });
});

// =======================================================
// FANCYBOX CHỈ DÙNG CHO VIDEO
// =======================================================
let fancyboxPromise = null;

const loadFancybox = () => {
  if (window.Fancybox) return Promise.resolve(window.Fancybox);
  if (fancyboxPromise) return fancyboxPromise;

  fancyboxPromise = new Promise((resolve, reject) => {
    if (!document.querySelector('link[data-portfolio-fancybox]')) {
      const stylesheet = document.createElement("link");
      stylesheet.rel = "stylesheet";
      stylesheet.href = "https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.css";
      stylesheet.dataset.portfolioFancybox = "";
      document.head.appendChild(stylesheet);
    }

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.umd.js";
    script.onload = () => resolve(window.Fancybox);
    script.onerror = reject;
    document.body.appendChild(script);
  });

  return fancyboxPromise;
};

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

  const openProjectYoutubeVideo = async (poster) => {
    try {
      await loadFancybox();
    } catch (error) {
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
      hideScrollbar: false,
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
