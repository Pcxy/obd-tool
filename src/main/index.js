/**
 * electron 主进程入口
 */
'use strict'

const { app, ipcMain } = require('electron')
const AppMainWindow = require('./controls/AppMainWindow')
const AppTray = require('./controls/AppTray')
const Store = require('electron-store')
const store = new Store()
const os = require('os')
const electronDev = require('electron-is-dev')
const { default: TcpServer } = require('./server')

// 测试用
store.set('LOCAL_ELECTRON_STORE', 'STORE-MSG: WELCOME TO MY TPL')
// 渲染进程保证node api可用，9.0版本已经默认开启
app.allowRendererProcessReuse = true
// win7部分系统白屏优化: 下关闭硬件加速
const isWin7 = os.release().startsWith('6.1')
if (isWin7) app.disableHardwareAcceleration()

export let webContents;

class MainApp {
  constructor() {
    this.mainWindow = null
    this.tray = null
    this.tcpServer = null;
  }
  init() {
    this.initAppLife()
    this.initIPC()
    this.initTcpServer();
  }

  // 创建右键托盘
  createTray() {
    this.tray = new AppTray(this.mainWindow)
  }

  // 创建主进程窗口
  createMainWindow() {
    this.mainWindow = new AppMainWindow()
    webContents = this.mainWindow.webContents;
    this.createTray()
    electronDev || this.handleKeepSingleApp()
  }

  handleKeepSingleApp() {
    // 限制只可以打开一个应用
    const gotTheLock = app.requestSingleInstanceLock()
    console.log('gotTheLock', gotTheLock)
    if (!gotTheLock) {
      app.quit()
    } else {
      app.on('second-instance', (event, commandLine, workingDirectory) => {
        // 当运行第二个实例时,将会聚焦到mainWindow这个窗口
        if (this.mainWindow) {
          if (this.mainWindow.isMinimized()) this.mainWindow.restore()
          this.mainWindow.focus()
          this.mainWindow.show()
        }
      })
    }
  }

  // 生命周期
  initAppLife() {
    app.whenReady().then(() => {
      this.createMainWindow()
    })

    app.on('window-all-closed', () => {
      console.log('window-all-closed')
      // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，否则绝大部分应用及其菜单栏会保持激活。
      console.log('process.platform', process.platform)
      if (process.platform !== 'darwin') {
        console.log('quit')
        app.quit()
      }
    })

    app.on('before-quit', () => {
      console.log('before-quit')
      this.mainWindow.destoryMainWindow()
    })
  }

  // 可作为IPC通讯集合
  initIPC() {
    // 关闭启动loading层, 移除loading view视图
    ipcMain.on('stop-loading-main', () => {
      this.mainWindow.removeView()
    })

    ipcMain.on('obd', (event, obj) => {
      if (this.tcpServer) {
        this.tcpServer.broadcast(obj, 'obd');
      }
    });

    ipcMain.on('gps', (event, obj) => {
      if (this.tcpServer) {
        this.tcpServer.broadcast(obj, 'gps');
      }
    })
  }

  initTcpServer() {
    console.log('init tcp server');
    if (this.tcpServer === null) {
      this.tcpServer = new TcpServer(30001);
    }
  }
}

// 初始化
new MainApp().init()
