import * as net from 'net';
import chunk from 'lodash/chunk';
import flatten from 'lodash/flatten';
import Store from 'electron-store';
import { webContents } from './index';

const obdKeys = [
  'code', 'keyStatus', 'batteryVoltage', 'engineSpeed', 'carSpeed', 'coolantTemp',
  'gear', 'steeringWheelAngle', 'accelerator', 'totalMileage', 'remainingOil', 'avg',
  'curMileage', 'faultCodeCount', 'runningTime', 'mainDoor', 'copilotDoor', 'behindLeftDoor',
  'behindRightDoor', 'trunk', 'mainWindow', 'copilotWindow', 'behindLeftWindow', 'behindRightWindow',
  'skylight', 'centralLock', 'mainSafetyBalt', 'copilotSafetyBalt', 'clutch', 'horn', 'wiper', 'handbrake', 'brake',
  'leftTurnLight', 'rightTurnLight', 'positionLight', 'dippedHeadlight', 'mainHeadlight', 'frontFoglight',
  'rearFoglight'
];

const gpsKeys = [
  "code", "xCoordinate", "xCoordinateDirection", "yCoordinate", "yCoordinateDirection", "zCoordinate",
  "zCoordinateDirection", "horizontalAngle", "pitchAngle", "rollAngle", "solutionState", "satellitesNum",
  "x_rate", "y_rate", "z_rate"
];

// OBD 常量的部分  xxx_no：协议中的编号  xxx_size:协议中的大小
const OBD_CONSTANT = {
  "prefix": "f1f2f3f4960084",
  "code_no": "01",
  "code_size": "10",
  "keyStatus_no": "02",
  "keyStatus_size": "01",
  "batteryVoltage_no": "03",
  "batteryVoltage_size": "02",
  "engineSpeed_no": "04",
  "engineSpeed_size": "02",
  "carSpeed_no": "05",
  "carSpeed_size": "01",
  "coolantTemp_no": "06",
  "coolantTemp_size": "02",
  "gear_no": "07",
  "gear_size": "01",
  "steeringWheelAngle_no": "08",
  "steeringWheelAngle_size": "02",
  "accelerator_no": "09",
  "accelerator_size": "01",
  "totalMileage_no": "0a",
  "totalMileage_size": "04",
  "remainingOil_no": "0b",
  "remainingOil_size": "01",
  "avg_no": "0c",
  "avg_size": "02",
  "curMileage_no": "0d",
  "curMileage_size": "04",
  "faultCodeCount_no": "0e",
  "faultCodeCount_size": "01",
  "runningTime_no": "0f",
  "runningTime_size": "04",
  "mainDoor_no": "10",
  "mainDoor_size": "01",
  "copilotDoor_no": "11",
  "copilotDoor_size": "01",
  "behindLeftDoor_no": "12",
  "behindLeftDoor_size": "01",
  "behindRightDoor_no": "13",
  "behindRightDoor_size": "01",
  "trunk_no": "14",
  "trunk_size": "01",
  "mainWindow_no": "15",
  "mainWindow_size": "01",
  "copilotWindow_no": "16",
  "copilotWindow_size": "01",
  "behindLeftWindow_no": "17",
  "behindLeftWindow_size": "01",
  "behindRightWindow_no": "18",
  "behindRightWindow_size": "01",
  "skylight_no": "19",
  "skylight_size": "01",
  "centralLock_no": "1a",
  "centralLock_size": "01",
  "mainSafetyBalt_no": "1b",
  "mainSafetyBalt_size": "01",
  "copilotSafetyBalt_no": "1c",
  "copilotSafetyBalt_size": "01",
  "clutch_no": "1d",
  "clutch_size": "01",
  "horn_no": "1e",
  "horn_size": "01",
  "wiper_no": "1f",
  "wiper_size": "01",
  "handbrake_no": "20",
  "handbrake_size": "01",
  "brake_no": "21",
  "brake_size": "01",
  "leftTurnLight_no": "22",
  "leftTurnLight_size": "01",
  "rightTurnLight_no": "23",
  "rightTurnLight_size": "01",
  "positionLight_no": "24",
  "positionLight_size": "01",
  "dippedHeadlight_no": "25",
  "dippedHeadlight_size": "01",
  "mainHeadlight_no": "26",
  "mainHeadlight_size": "01",
  "frontFoglight_no": "27",
  "frontFoglight_size": "01",
  "rearFoglight_no": "28",
  "rearFoglight_size": "01",
  "suffix": "35a30000"
}

// OBD 值的部分
const OBD = {
  "code": "30303030303030303030303030303031",
  "keyStatus": true,
  "batteryVoltage": true,
  "engineSpeed": 1094,
  "carSpeed": 2,
  "coolantTemp": 1,
  "gear": 2,
  "steeringWheelAngle": -34,
  "accelerator": 1,
  "totalMileage": 4,
  "remainingOil": 2,
  "avg": 2,
  "curMileage": 2,
  "faultCodeCount": 2,
  "runningTime": 2,
  "mainDoor": true,
  "copilotDoor": true,
  "behindLeftDoor": true,
  "behindRightDoor": true,
  "trunk": true,
  "mainWindow": true,
  "copilotWindow": true,
  "behindLeftWindow": true,
  "behindRightWindow": true,
  "skylight": true,
  "centralLock": true,
  "mainSafetyBalt": true,
  "copilotSafetyBalt": true,
  "clutch": true,
  "horn": true,
  "wiper": true,
  "handbrake": true,
  "brake": true,
  "leftTurnLight": true,
  "rightTurnLight": true,
  "positionLight": true,
  "dippedHeadlight": true,
  "mainHeadlight": true,
  "frontFoglight": true,
  "rearFoglight": false
};

const GPS_CONSTANT = {
  "prefix": "f1f2f3f4460081",
  "code_no": "01",
  "code_size": 16,
  "xCoordinate_no": "02",
  "xCoordinate_size": 4,
  "xCoordinateDirection_no": "03",
  "xCoordinateDirection_size": 1,
  "yCoordinate_no": "04",
  "yCoordinate_size": 4,
  "yCoordinateDirection_no": "05",
  "yCoordinateDirection_size": 1,
  "zCoordinate_no": "06",
  "zCoordinate_size": 4,
  "zCoordinateDirection_no": "07",
  "zCoordinateDirection_size": 1,
  "horizontalAngle_no": "08",
  "horizontalAngle_size": 4,
  "pitchAngle_no": "09",
  "pitchAngle_size": 4,
  "rollAngle_no": "0a",
  "rollAngle_size": 4,
  "solutionState_no": "0b",
  "solutionState_size": 1,
  "satellitesNum_no": "0c",
  "satellitesNum_size": 1,
  "x_rate_no": "0d",
  "x_rate_size": 4,
  "y_rate_no": "0e",
  "y_rate_size": 4,
  "z_rate_no": "0f",
  "z_rate_size": 4,
  "suffix": "bf160000"
}

const GPS = {
  "code": "30303030303030303030303030303031",
  "xCoordinate": 64,
  "xCoordinateDirection": 0,
  "yCoordinate": 80,
  "yCoordinateDirection": 0,
  "zCoordinate": 90,
  "zCoordinateDirection": 0,
  "horizontalAngle": 5,
  "pitchAngle": 12,
  "rollAngle": 4,
  "solutionState": 4,
  "satellitesNum": 12,
  "x_rate": 0,
  "y_rate": 0,
  "z_rate": 0
}

class TcpServer {

  connectedSockets;
  server;
  closed; // 当前服务端关闭状态
  port;

  timer;
  buffer;
  store;


  constructor(port) {
    this.server = null;
    this.connectedSockets = new Set();
    this.port = port;
    this.timer = null;
    this.buffer = Buffer.from('');
    this.closed = true;
    this.createServer();
  }

  createServer() {
    return new Promise((resolve, reject) => {
      this.server = net.createServer(socket => {
        this.connectedSockets.add(socket);
        console.log(`---tcp客户端已连接:${socket.remoteAddress}---`);
        webContents.send('client-add', socket.remoteAddress);

        socket.on('end', () => {
          console.log(`---tcp客户端已断开:${socket.remoteAddress}---`);
          // ipcMain.send('log-message', `---tcp客户端已断开:${socket.remoteAddress}---`);
        });

        socket.on('close', () => {
          console.log(`---tcp客户端已关闭:${socket.remoteAddress}---`);
          this.connectedSockets.delete(socket);
          webContents.send('client-remove', socket.remoteAddress);
          // ipcMain.send('log-message', `---tcp客户端已关闭:${socket.remoteAddress}---`);
        });

        socket.on('error', (error) => {
          console.log(`---tcp客户端出错:${socket.remoteAddress}---`, error.message);
          // ipcMain.send('log-message', `---tcp客户端出错:${socket.remoteAddress}---`);
        });
      });

      this.server.on('error', () => {
        console.log('---tcp服务端发生错误：---', err.message);
        // ipcMain.send('log-message', `---tcp服务端发生错误：${err.message}---`);
        reject(err);
      });

      this.server.on('close', () => {
        console.log(`---tcp服务端已停止---`);
        // ipcMain.send('log-message', `---tcp服务端已停止---`)
        this.closed = true;
      });

      this.server.listen(this.port, () => {
        console.log(`---tcp服务器已启动,监听端口${this.port}---`);
        // ipcMain.send('log-message', `---tcp服务器已启动,监听端口${this.port}---`);
        this.closed = false;
        // let buffer = this.toBuffer({ ...this.data, ...this.constData });
        // this.loopBroadCast(buffer);
        resolve(this.server);
      });
    })
  }

  closeServer() {
    return new Promise<net.Server | null>((resolve, reject) => {
      if (this.server) {
        this.closeAllSocket();
        this.server.close((err) => {
          if (err) {
            console.log('停止服务器时出错：' + err);
            reject(err);
          } else {
            resolve(this.server);
          }
        });
      }
    })
  }

  /**
   * 关闭所有的客户端
   */
  closeAllSocket() {
    this.connectedSockets.forEach(sock => {
      sock.destroy();
      this.connectedSockets.delete(sock);
    })
  }

  loopBroadCast(buffer) {
    // this.broadcast(buffer, null);
    // console.log(`${moment().format('mm:ss')}-send data:`, this.buffer);
    if (!this.closed) { // 如果服务器关闭，停止发送数据循环
      // this.timer = setTimeout(() => {
        //   if (this.closed) return; // 最后一次也不要发送
        //   this.loopBroadCast(buffer);
        // }, 1000);
      
      // this.timer = setInterval(() => {
      //   if (this.closed) {
      //     if (this.timer) {
      //       clearInterval(this.timer);
      //     }
      //     return;
      //   }
      //   this.print(buffer);
      //   this.broadcast(buffer, null);
      //   ipcRenderer.send('log-message', `${moment().format('mm:ss')}--${this.name} send data: ${buffer.toString('hex')}`)
      // }, 1000)
    }
  }

  print(buffer) {
    console.log(moment().format('hh:mm:ss') + ' send data:');
    for (let i = 0; i < buffer.length; i+=20) {
      console.log(buffer.slice(i, i + 20));
    }
  }

  broadcast(data, type) {
    this.connectedSockets.forEach(sock => {
      if (type === 'obd') {
        sock.write(this.toBuffer({ ...OBD, ...data }, obdKeys, OBD_CONSTANT));
      } else {
        sock.write(this.toBuffer({ ...GPS, ...data }, gpsKeys, GPS_CONSTANT));
      }
    });
  }

  /**
   * 将获得的数据对象解析成 协议格式
   * 输入指令的对象，输出buffer
   * @param data 输入指令数据集合
   * @param keys 待解析的值
   * @param constant 待解析的常量
   */
  toBuffer(data, keys, constant) {
    const tem = [];

    tem.push(...this.str2Bytes(constant['prefix'])); // 先加上协议前缀

    for (let key of keys) {
      const valueNo = constant[`${key}_no`];
      if (typeof valueNo === 'string') {
        tem.push(...this.str2Bytes(valueNo));
      } else {
        tem.push(...this.intOrBool2Bytes(valueNo));
      }
      const valueSize = constant[`${key}_size`];
      if (typeof valueSize === 'string') {
        tem.push(...this.str2Bytes(valueSize));
      } else {
        tem.push(...this.intOrBool2Bytes(valueSize));
      }
      const value = data[`${key}`];
      if (typeof value === 'string') {
        tem.push(...this.str2Bytes(value));
      } else {
        tem.push(...this.intOrBool2Bytes(value, parseInt(valueSize, 10) * 2));
      }
    }
  
    tem.push(...this.str2Bytes(constant['suffix']));
    let buffer = Buffer.from(tem);
    return buffer;
  }

  /**
   * 字符串转十六进制
   * @param str 输入字符串
   * @returns number[] 十六进制数组
   */
  str2Bytes(str) {
    let pos = 0;
    let len = str.length;
    if (len % 2 !== 0) return [];
    len /= 2;
    let hexArr = [];
    for (let i = 0; i < len; i++) {
      let s = str.substr(pos, 2);
      let v = parseInt(s, 16);
      hexArr.push(v);
      pos += 2;
    }
    return hexArr;
  }

  /**
   * 字节数组转置 num: 11 -> '0x0c' ->  '0x0c00'
   * @param num number
   * @param size number
   */
  intOrBool2Bytes(numOrBool, size = 2) {
    let zeroStr = '000000000000';
    if (typeof numOrBool === 'boolean') {
      numOrBool = numOrBool ? 1 : 0;
    }
    let hexStr = numOrBool.toString(16);
    hexStr = hexStr.length % 2 === 1 ? '0'.concat(hexStr) : hexStr;
    hexStr = flatten(chunk(hexStr.split(''), 2).reverse()).join('');
    if (size > hexStr.length) {
      hexStr = hexStr.concat(zeroStr.substr(0, size - hexStr.length));
    }
    return this.str2Bytes(hexStr);
  }
}

export default TcpServer;
