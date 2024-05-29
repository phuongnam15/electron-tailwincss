const os = require("os");
const path = require("path");
const Toastify = require("toastify-js");
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("os", {
  homedir: () => os.homedir(),
});
contextBridge.exposeInMainWorld("path", {
  join: (...args) => path.join(...args),
});
contextBridge.exposeInMainWorld("Toastify", {
  toast: (options) => Toastify(options).showToast(),
});
contextBridge.exposeInMainWorld("ipcRenderer", {
  send: (chanel, data) => ipcRenderer.send(chanel, data),
  on: (chanel, func) =>
    ipcRenderer.on(chanel, (event, ...args) => func(...args)),
});
