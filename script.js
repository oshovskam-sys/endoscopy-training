let currentGallery = null;

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

document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") {
    closeViewer();
  }
});
