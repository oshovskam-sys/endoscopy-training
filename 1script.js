let mode = view;
let current = 1;

const answers = {
  1 upper esophageal sphincter,
  2 esophagus,
  3 z-line,
  4 cardia,
  5 fundus,
  6 body,
  7 antrum,
  8 pylorus,
  9 duodenal bulb,
  10 duodenum
};

function loadGallery() {
  const gallery = document.getElementById(gallery);
  gallery.innerHTML = ;

  for (let i = 1; i = 20; i++) {
    let num = String(i).padStart(3, '0');
    let img = document.createElement(img);
    img.src = `images${num}.jpg`;
    img.onclick = () = openViewer(img.src);
    gallery.appendChild(img);
  }
}

function openViewer(src) {
  document.getElementById(viewer).style.display = flex;
  document.getElementById(viewerImg).src = src;
}

function closeViewer() {
  document.getElementById(viewer).style.display = none;
}

function setMode(m) {
  mode = m;

  document.getElementById(gallery).style.display = m === view  grid  none;
  document.getElementById(quiz).style.display = m === quiz  block  none;

  if (m === quiz) nextQuestion();
}

function nextQuestion() {
  current = Math.floor(Math.random()  10) + 1;
  let num = String(current).padStart(3, '0');
  document.getElementById(quizImg).src = `images${num}.jpg`;
  document.getElementById(answer).value = ;
  document.getElementById(result).innerText = ;
}

function checkAnswer() {
  let user = document.getElementById(answer).value.toLowerCase();
  let correct = answers[current];

  if (!correct) {
    document.getElementById(result).innerText = нема відповіді в базі;
    return;
  }

  if (user.includes(correct)) {
    document.getElementById(result).innerText = ✔ правильно;
  } else {
    document.getElementById(result).innerText = ✖  + correct;
  }

  setTimeout(nextQuestion, 1500);
}

loadGallery();

document.addEventListener("DOMContentLoaded", function () {
  loadGallery();
});

let currentIndex = 1;

function openViewer(src, index) {
  currentIndex = index;
  document.getElementById("viewer").style.display = "flex";
  document.getElementById("viewerImg").src = src;
}

document.addEventListener("keydown", function(e) {
  if (document.getElementById("viewer").style.display === "flex") {
    if (e.key === "ArrowRight") nextImage();
    if (e.key === "ArrowLeft") prevImage();
  }
});

function nextImage() {
  if (currentIndex < 20) currentIndex++;
  updateViewer();
}

function prevImage() {
  if (currentIndex > 1) currentIndex--;
  updateViewer();
}

function updateViewer() {
  let num = String(currentIndex).padStart(3, '0');
  document.getElementById("viewerImg").src = "images/" + num + ".jpg";
}
