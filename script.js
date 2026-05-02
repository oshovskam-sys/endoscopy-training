let currentGallery = null;

let zoomLevel = 1;
let originX = 50;
let originY = 50;

let isDragging = false;
let startX = 0, startY = 0;
let translateX = 0;
let translateY = 0;

const PAN_THRESHOLD = 3;

// створення вкладок
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

// курсор
function updateCursor() {
  const img = document.getElementById("viewerImg");
  if (zoomLevel >= PAN_THRESHOLD) {
    img.style.cursor = "grab";
  } else {
    img.style.cursor = "zoom-in";
  }
}

// відкриття
function openViewer(src) {
  const viewer = document.getElementById("viewer");
  const img = document.getElementById("viewerImg");

  zoomLevel = 1;
  translateX = 0;
  translateY = 0;

  img.style.transform = "translate(0px, 0px) scale(1)";
  img.style.transformOrigin = "50% 50%";

  img.src = src;
  viewer.style.display = "flex";

  updateCursor();
}

function closeViewer() {
  document.getElementById("viewer").style.display = "none";
}

// запуск
document.addEventListener("DOMContentLoaded", function () {
  createTabs();
  loadGallery(galleries[0]);

  const img = document.getElementById("viewerImg");
  const viewer = document.getElementById("viewer");

  // 🔍 zoom по кліку (до порогу)
  img.addEventListener("click", function(e) {
    e.stopPropagation();

    if (zoomLevel >= PAN_THRESHOLD) return;

    const rect = img.getBoundingClientRect();

    originX = ((e.clientX - rect.left) / rect.width) * 100;
    originY = ((e.clientY - rect.top) / rect.height) * 100;

    zoomLevel += 0.5;

    img.style.transformOrigin = `${originX}% ${originY}%`;
    img.style.transform = `translate(${translateX}px, ${translateY}px) scale(${zoomLevel})`;

    updateCursor();
  });

  // 🖱 zoom колесом
  viewer.addEventListener("wheel", function(e) {
    e.preventDefault();

    const rect = img.getBoundingClientRect();

    originX = ((e.clientX - rect.left) / rect.width) * 100;
    originY = ((e.clientY - rect.top) / rect.height) * 100;

    if (e.deltaY < 0) zoomLevel += 0.2;
    else zoomLevel -= 0.2;

    if (zoomLevel < 1) zoomLevel = 1;
    if (zoomLevel > 6) zoomLevel = 6;

    img.style.transformOrigin = `${originX}% ${originY}%`;
    img.style.transform = `translate(${translateX}px, ${translateY}px) scale(${zoomLevel})`;

    updateCursor();
  });

  // 🖐 DRAG START
  img.addEventListener("mousedown", function(e) {
    if (zoomLevel < PAN_THRESHOLD) return;
    if (e.button !== 0) return;

    isDragging = true;
    startX = e.clientX - translateX;
    startY = e.clientY - translateY;

    img.style.cursor = "grabbing";
  });

  // 🖐 DRAG MOVE (тільки при зажатій кнопці)
  window.addEventListener("mousemove", function(e) {
    if (!isDragging || e.buttons !== 1) return;

    translateX = e.clientX - startX;
    translateY = e.clientY - startY;

    img.style.transform = `translate(${translateX}px, ${translateY}px) scale(${zoomLevel})`;
  });

  // 🖐 DRAG END
  window.addEventListener("mouseup", function() {
    if (!isDragging) return;

    isDragging = false;
    updateCursor();
  });

  // ESC
  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") closeViewer();
  });
});
