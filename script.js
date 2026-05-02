let currentGallery = null;

let currentIndex = 0;
let currentImages = [];

let scale = 1;
let translateX = 0;
let translateY = 0;

let isDragging = false;
let startX = 0;
let startY = 0;

// вкладки
function createTabs() {
  const mode = document.getElementById("mode");
  mode.innerHTML = "";

  galleries.forEach((g) => {
    const btn = document.createElement("button");
    btn.innerText = g.name;
    btn.onclick = () => loadGallery(g);
    mode.appendChild(btn);
  });
}

// галерея
function loadGallery(gallery) {
  currentGallery = gallery;

  const galleryDiv = document.getElementById("gallery");
  galleryDiv.innerHTML = "";

  currentImages = [];

  for (let i = 1; i <= gallery.count; i++) {
    let num = String(i).padStart(3, '0');
    let src = gallery.folder + "/" + num + ".jpg";

    currentImages.push(src);

    let img = document.createElement("img");
    img.src = src;

    img.onclick = () => openViewerByIndex(i - 1);

    galleryDiv.appendChild(img);
  }
}

// transform
function updateTransform(img) {
  img.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
}

// відкриття по індексу
function openViewerByIndex(index) {
  currentIndex = index;
  openViewer(currentImages[currentIndex]);
}

// відкриття (fit-to-screen)
function openViewer(src) {
  const viewer = document.getElementById("viewer");
  const img = document.getElementById("viewerImg");

  img.src = src;
  viewer.style.display = "flex";

  img.onload = function () {
    const vw = viewer.clientWidth;
    const vh = viewer.clientHeight;

    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    const scaleX = vw / iw;
    const scaleY = vh / ih;
    scale = Math.min(scaleX, scaleY);

    translateX = (vw - iw * scale) / 2;
    translateY = (vh - ih * scale) / 2;

    img.style.transformOrigin = "0 0";
    updateTransform(img);
  };
}

// закриття
function closeViewer() {
  document.getElementById("viewer").style.display = "none";
}

// запуск
document.addEventListener("DOMContentLoaded", function () {
  createTabs();
  loadGallery(galleries[0]);

  const viewer = document.getElementById("viewer");
  const img = document.getElementById("viewerImg");

  // 🔍 ZOOM + SCROLL
  viewer.addEventListener("wheel", function(e) {
    e.preventDefault();

    const rect = img.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    // CTRL = zoom
    if (e.ctrlKey) {
      const zoomFactor = 1.1;
      const prevScale = scale;

      if (e.deltaY < 0) scale *= zoomFactor;
      else scale /= zoomFactor;

      if (scale < 0.1) scale = 0.1;
      if (scale > 10) scale = 10;

      translateX -= (offsetX / prevScale) * (scale - prevScale);
      translateY -= (offsetY / prevScale) * (scale - prevScale);

      updateTransform(img);
      return;
    }

    // scroll = рух
    if (e.shiftKey) {
      translateX -= e.deltaY;
    } else {
      translateY -= e.deltaY;
    }

    updateTransform(img);

  }, { passive: false });

  // 🖐 DRAG START
  img.addEventListener("mousedown", function(e) {
    isDragging = true;
    startX = e.clientX - translateX;
    startY = e.clientY - translateY;
    img.style.cursor = "grabbing";
  });

  // 🖐 DRAG MOVE
  window.addEventListener("mousemove", function(e) {
    if (!isDragging) return;

    translateX = e.clientX - startX;
    translateY = e.clientY - startY;

    updateTransform(img);
  });

  // 🖐 DRAG END
  window.addEventListener("mouseup", function() {
    isDragging = false;
    img.style.cursor = "grab";
  });

  // ⬅➡ СТРІЛКИ
  document.addEventListener("keydown", function(e) {
    const viewerOpen = viewer.style.display === "flex";
    if (!viewerOpen) return;

    if (e.key === "ArrowRight") {
      currentIndex++;
      if (currentIndex >= currentImages.length) currentIndex = 0;
      openViewer(currentImages[currentIndex]);
    }

    if (e.key === "ArrowLeft") {
      currentIndex--;
      if (currentIndex < 0) currentIndex = currentImages.length - 1;
      openViewer(currentImages[currentIndex]);
    }

    if (e.key === "Escape") {
      closeViewer();
    }
  });

  // клік поза
  viewer.addEventListener("click", closeViewer);
  img.addEventListener("click", (e) => e.stopPropagation());

  img.style.cursor = "grab";
});
