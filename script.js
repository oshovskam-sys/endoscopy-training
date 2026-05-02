let currentGallery = null;
let zoomLevel = 1;

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

// fullscreen + reset zoom
function openViewer(src) {
  const viewer = document.getElementById("viewer");
  const img = document.getElementById("viewerImg");

  zoomLevel = 1;
  img.style.transform = "scale(1)";
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

  // zoom по кліку
  img.onclick = function(e) {
    e.stopPropagation();

    zoomLevel += 0.5;
    if (zoomLevel > 3) zoomLevel = 1;

    img.style.transform = `scale(${zoomLevel})`;
  };

  // zoom колесом
  viewer.addEventListener("wheel", function(e) {
    e.preventDefault();

    if (e.deltaY < 0) zoomLevel += 0.2;
    else zoomLevel -= 0.2;

    if (zoomLevel < 1) zoomLevel = 1;
    if (zoomLevel > 5) zoomLevel = 5;

    img.style.transform = `scale(${zoomLevel})`;
  });

  // закриття по ESC
  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
      closeViewer();
    }
  });
});
