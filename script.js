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
    // Tìm tất cả ảnh, TRỪ logo, icon và những ảnh có class .no-zoom
    const imageSelector = "img:not(.nav-item img, #logo img, .social-icons img, .skill-item img, .no-zoom)";

    // Gắn Fancybox vào các ảnh đó
    Fancybox.bind(imageSelector, {
      Hash: false, // Tắt việc tự đổi link URL khi xem ảnh
      Toolbar: {
        display: {
          left: [],
          // Các nút hiển thị ở giữa: Phóng to, Thu nhỏ, Zoom 1:1
          middle: ["zoomIn", "zoomOut", "toggle1to1"],
          right: ["close"],
        },
      },
      Images: {
        zoom: true, // Kích hoạt chức năng soi chi tiết
      }
    });
  };
});
// =======================================================
// HIỆU ỨNG THẺ 3D (VANILLA-TILT.JS)
// =======================================================
document.addEventListener("DOMContentLoaded", () => {
  // Tải thư viện Vanilla Tilt
  const tiltJS = document.createElement("script");
  tiltJS.src = "https://cdnjs.cloudflare.com/ajax/libs/vanilla-tilt/1.8.1/vanilla-tilt.min.js";
  document.body.appendChild(tiltJS);

  tiltJS.onload = () => {
    // Tự động gắn hiệu ứng 3D cho các thẻ Card của Khoa
    const cards = document.querySelectorAll(".project-card, .service-card, .material-card, .sw-card");

    VanillaTilt.init(cards, {
      max: 8,             // Độ nghiêng tối đa (số càng to nghiêng càng nhiều)
      speed: 400,         // Tốc độ hồi phục về ban đầu
      glare: true,        // Bật hiệu ứng lóa sáng như kính
      "max-glare": 0.3,   // Độ lóa sáng tối đa (0.3 là vừa đẹp)
      scale: 1.02         // Khi hover vào thẻ tự động phóng to nhẹ lên 2%
    });
  };
});
// =======================================================
// HIỆU ỨNG CUỘN TRANG (AOS - ANIMATE ON SCROLL)
// =======================================================
document.addEventListener("DOMContentLoaded", () => {
  // 1. Chèn CSS của AOS
  const aosCSS = document.createElement("link");
  aosCSS.rel = "stylesheet";
  aosCSS.href = "https://unpkg.com/aos@2.3.1/dist/aos.css";
  document.head.appendChild(aosCSS);

  // 2. Chèn JS của AOS
  const aosJS = document.createElement("script");
  aosJS.src = "https://unpkg.com/aos@2.3.1/dist/aos.js";
  document.body.appendChild(aosJS);

  // 3. Kích hoạt sau khi tải xong
  aosJS.onload = () => {
    // Tự động gắn hiệu ứng cho các khối nội dung
    const animateElements = document.querySelectorAll('.project-card, .service-card, .material-card, .phil-card, .sw-card');

    animateElements.forEach((el, index) => {
      el.setAttribute('data-aos', 'fade-up');
      // Tạo hiệu ứng xuất hiện lần lượt (stagger)
      el.setAttribute('data-aos-delay', (index % 3) * 150);
    });

    // Khởi tạo AOS
    AOS.init({
      duration: 800, // Thời gian chạy hiệu ứng (0.8s)
      easing: 'ease-out-cubic', // Gia tốc mượt mà
      once: true, // Chỉ chạy hiệu ứng 1 lần khi cuộn xuống
      offset: 50 // Cách đáy màn hình 50px thì bắt đầu chạy
    });
  };
});
// =======================================================
// HIỆU ỨNG CUỘN TRANG MƯỢT MÀ (LENIS SMOOTH SCROLL)
// =======================================================
document.addEventListener("DOMContentLoaded", () => {
  // Bỏ qua trên mobile để giữ nguyên trải nghiệm vuốt tự nhiên của điện thoại
  if (window.matchMedia("(max-width: 768px)").matches) return;

  const lenisScript = document.createElement("script");
  lenisScript.src = "https://unpkg.com/@studio-freight/lenis@1.0.39/dist/lenis.min.js";
  document.body.appendChild(lenisScript);

  lenisScript.onload = () => {
    const lenis = new Lenis({
      duration: 1.2, // Độ trượt dài sau khi ngừng lăn chuột (càng to càng trượt dài)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Gia tốc mượt
      smooth: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  };
});
// =======================================================
// HIỆU ỨNG NÚT BẤM NAM CHÂM (MAGNETIC ELEMENTS)
// =======================================================
document.addEventListener("DOMContentLoaded", () => {
  if (window.matchMedia("(max-width: 768px)").matches) return; // Bỏ qua trên mobile

  // Tìm các nút bấm và menu để gắn nam châm
  const magnets = document.querySelectorAll('.btn, .nav-item, .contact-box');

  magnets.forEach((magnet) => {
    magnet.addEventListener('mousemove', function (e) {
      const position = magnet.getBoundingClientRect();
      // Tính toán khoảng cách từ chuột đến tâm của nút bấm
      const x = e.clientX - position.left - position.width / 2;
      const y = e.clientY - position.top - position.height / 2;

      // Cho nút di chuyển nhẹ theo hướng chuột (nhân với 0.3 để giảm lực hút cho mượt)
      magnet.style.transform = `translate(${x * 0.3}px, ${y * 0.4}px)`;
      magnet.style.transition = 'transform 0.1s ease-out';
    });

    // Khi chuột rời đi, nút nảy lại vị trí cũ
    magnet.addEventListener('mouseleave', function (e) {
      magnet.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      magnet.style.transform = 'translate(0px, 0px)';
    });
  });
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

  // 2. Tính toán và cập nhật độ dài liên tục mỗi khi cuộn chuột
  window.addEventListener("scroll", () => {
    // Vị trí hiện tại tính từ đầu trang xuống
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    // Tổng chiều dài của toàn bộ trang web có thể cuộn được
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

    // Tính phần trăm (%)
    const scrollPercentage = (scrollTop / scrollHeight) * 100;

    // Đổ kết quả vào thanh màu xanh
    progressBar.style.width = scrollPercentage + "%";
  });
});
// =======================================================
// TỰ ĐỘNG THÊM LAZY LOADING CHO ẢNH (TỐI ƯU TỐC ĐỘ TẢI)
// =======================================================
document.addEventListener("DOMContentLoaded", () => {
  // Tìm tất cả thẻ img trên trang, TRỪ những ảnh nằm trong Header hoặc phần Hero trên cùng
  const images = document.querySelectorAll("img:not(header img):not(.hero-avatar):not(.keyvisual-wrapper img):not(.sw-hero img)");

  images.forEach(img => {
    // Nếu ảnh chưa có thuộc tính loading thì tự động gắn 'lazy' vào
    if (!img.hasAttribute("loading")) {
      img.setAttribute("loading", "lazy");
    }
  });
});