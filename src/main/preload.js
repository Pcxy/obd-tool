/**
 * 为window挂载方法
 */
const { ipcRenderer } = require('electron')

/** 挂载停止启动loading方法 */
window.stopLoading = function () {
  ipcRenderer.send('stop-loading-main')
}

window.sendOBD = function(obj) {
  ipcRenderer.send('obd', obj);
}

window.sendGPS = function(obj) {
  ipcRenderer.send('gps', obj);
}


