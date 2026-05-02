let currentGallery = null;

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

  for (let i = 1; i <= gallery.count; i++) {
    let num = String(i).padStart(3, '0');

    let img = document.createElement("img");
    img.src = gallery.folder + "/" + num + ".jpg";
    img.onclick = () => openViewer(img.src);

    galleryDiv.appendChild(img);
  }
}

// застосування трансформації
function updateTransform(img) {
  img.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
}

// відкриття
function openViewer(src) {
  const viewer = document.getElementById("viewer");
  const img = document.getElementById("viewerImg");

  scale = 1;
  translateX = 0;
  translateY = 0;

  img.style.transformOrigin = "0 0";
  img.src = src;

  updateTransform(img);
  viewer.style.display = "flex";
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

      if (scale < 1) scale = 1;
      if (scale > 10) scale = 10;

      // зум в точку курсора
      translateX -= (offsetX / prevScale) * (scale - prevScale);
      translateY -= (offsetY / prevScale) * (scale - prevScale);

      updateTransform(img);
      return;
    }

    // 🖱 SCROLL = рух
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

  // курсор
  img.style.cursor = "grab";

  // ESC
  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") closeViewer();
  });

  // клік поза зображенням
  viewer.addEventListener("click", closeViewer);

  img.addEventListener("click", function(e) {
    e.stopPropagation();
  });
});
