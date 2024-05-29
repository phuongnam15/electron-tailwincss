
const img = document.querySelector("#upload_image");
const form = document.querySelector(".form_resize")
const widthImage = document.querySelector("#width_image");
const heightImage = document.querySelector("#height_image");
const nameImage = document.querySelector("#input_image");
const outputImage = document.querySelector("#output_image");
const styleAlert = {
  position: 'fixed',
  padding: "2px 0",
  width: '100%',
  color: 'white',
  textAlign: 'center',
  fontSize: "0.85rem",
};

function loadImage(e) {
  const file = e.target.files[0];

  if(!isImage(file)) {
    alertError("Please upload an image file");
    return;
  }

  form.style.display = "block";
  nameImage.innerHTML = file.name;
  outputImage.innerHTML = path.join(os.homedir(), 'imageresizer', file.name);

  const image = new Image();
  image.src = URL.createObjectURL(file);
  image.onload = function() {
    widthImage.value = this.width;
    heightImage.value = this.height;
  }

  alertSuccess("Image loaded successfully");
}

function isImage(file) {
  const acceptedImageTypes = ["image/gif", "image/jpeg", "image/png"];
  return file && acceptedImageTypes.includes(file["type"]);
}

function resizeImage(e) {
  e.preventDefault();
  const width = widthImage.value;
  const height = heightImage.value;
  const imagePath = img.files[0].path;

  if(!img.files[0]){
    alertError("Please upload an image file");
    return;
  }

  if(width === "" || height === "") {
    alertError("Please enter the width and height");
    return;
  }

  //send to main using ipc renderer
  ipcRenderer.send("image:resize", { width, height, imagePath });
}

function alertError(message) {
  Toastify.toast({
    text: message,
    duration: 5000,
    style: {
      ...styleAlert,
      backgroundColor: "#f44336"
    }
  });
}
function alertSuccess(message) {
  Toastify.toast({
    text: message,
    duration: 5000,
    style: {
      ...styleAlert,
      backgroundColor: "#4CAF50"
    }
  });
}

ipcRenderer.on("image:done", () => {
  alertSuccess(`Image resized to ${widthImage.value} x ${heightImage.value}`);
});

img.addEventListener("change", loadImage);
form.addEventListener("submit", resizeImage);
