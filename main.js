const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");

function createWindow() {
  const mainWindow = new BrowserWindow({
    title: "Image Resizer",
    width: 1000,
    height: 600,
  });
  mainWindow.webContents.openDevTools();
  mainWindow.loadFile(path.join(__dirname, "./renderer/index.html"));
}
const menu = [
  {
    label: "File",
    submenu: [
      {
        label: "Exit",
        click() {
          app.quit();
        },
        accelerator: "CmdOrCtrl+Q",
      },
    ],
  },
];

app.whenReady().then(() => {
  createWindow();

  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
