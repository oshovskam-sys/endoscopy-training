let currentGallery = null;
let zoomLevel = 1;
let originX = 50;
let originY = 50;

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

// завантаження галереї
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

// fullscreen
function openViewer(src) {
  const viewer = document.getElementById("viewer");
  const img = document.getElementById("viewerImg");

  zoomLevel = 1;
  originX = 50;
  originY = 50;

  img.style.transform = "scale(1)";
  img.style.transformOrigin = "50% 50%";

  img.src = src;
  viewer.style.display = "flex";
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

  // 🔍 zoom в точку кліку
  img.addEventListener("click", function(e) {
    e.stopPropagation();

    const rect = img.getBoundingClientRect();

    originX = ((e.clientX - rect.left) / rect.width) * 100;
    originY = ((e.clientY - rect.top) / rect.height) * 100;

    zoomLevel += 0.5;
    if (zoomLevel > 4) zoomLevel = 1;

    img.style.transformOrigin = `${originX}% ${originY}%`;
    img.style.transform = `scale(${zoomLevel})`;
  });

  // 🖱 zoom колесом (теж у точку курсора)
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
    img.style.transform = `scale(${zoomLevel})`;
  });

  // ESC
  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
      closeViewer();
    }
  });
});
