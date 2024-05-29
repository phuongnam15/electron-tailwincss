const { app, BrowserWindow, Menu, ipcMain, shell } = require("electron");
const path = require("path");
const os = require("os");
const fs = require("fs");
const resizeImg = require('resize-img');

process.env.NODE_ENV = "production";
let mainWindow;

const isDev = process.env.NODE_ENV !== "production";

function createWindow() {
  mainWindow = new BrowserWindow({
    title: "Image Resizer",
    width: 500,
    height: 700,
    contextIsolation: true,
    webPreferences: {
      sandbox: false,
      preload: path.join(__dirname, `preload.js`)
  }
  });

  if(isDev) {
    mainWindow.webContents.openDevTools();
  }
  mainWindow.loadFile(path.join(__dirname, "./src/renderer/index.html"));
}

app.whenReady().then(() => {
  createWindow();

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

ipcMain.on("image:resize", (event, data) => {
  data.des = path.join(os.homedir(), "imageresizer");
  return resizeImage(data);
});

async function resizeImage({ width, height, imagePath, des }) {
  try{
    const newImage = await resizeImg(fs.readFileSync(imagePath), {
      width: +width,
      height: +height,
    });

    //create file name
    const filename = path.basename(imagePath);

    //create dest folder if not exist
    if(!fs.existsSync(des)) {
      fs.mkdirSync(des);
    }
    //write to dest
    fs.writeFileSync(path.join(des, filename), newImage);

    //send success to renderer
    mainWindow.webContents.send("image:done");

    //open new image
    shell.openPath(des);

  }catch(err) {
    console.log(err);
  }
};

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
