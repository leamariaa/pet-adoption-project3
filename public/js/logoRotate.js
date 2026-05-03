const logo = document.getElementById("rotatingLogo");

let rotation = 0;

let isDragging = false;

let startX = 0;

logo.addEventListener("mousedown", (e) => {

  isDragging = true;

  startX = e.clientX;

});

document.addEventListener("mouseup", () => {

  isDragging = false;

});

document.addEventListener("mousemove", (e) => {

  if (!isDragging) return;

  const moveX = e.clientX - startX;

  rotation += moveX * 0.7;

  logo.style.transform = `rotateY(${rotation}deg)`;

  startX = e.clientX;

});