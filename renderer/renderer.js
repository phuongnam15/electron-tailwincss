const img = document.querySelector("#uploadImage");

function loadImage(e) {
  console.log(e.target.files[0]);
}

img.addEventListener("change", loadImage);
