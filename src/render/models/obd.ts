import { Reducer } from 'redux';

export enum Gear {
  R,
  N,
  D1,
  D2,
  D3,
  D4,
  D5,
}

export enum KeyStatus {
  OFF,
  ACC,
  ON,
}

export interface OBDGPSStateType {
  speed: number;
  direction: number;
  position: [number, number, number];
  rotation: [number, number, number];
  gear: Gear;
  leftTurnLight: boolean;
  rightTurnLight: boolean;
  handbrake: boolean;
  mainSafetyBalt: boolean;
  keyStatus: KeyStatus;
  brake: boolean;
  clutch: number;
}

export interface OBDGPSModelType {
  namespace: 'obdgps';
  state: OBDGPSStateType;

  reducers: {
    saveSpeed: Reducer<OBDGPSStateType>;
    saveDirection: Reducer<OBDGPSStateType>;
    savePosition: Reducer<OBDGPSStateType>;
    saveRotation: Reducer<OBDGPSStateType>;
    saveOBD: Reducer<OBDGPSStateType>;
    reset: Reducer<OBDGPSStateType>;
  }
}

const OBDGPSModel : OBDGPSModelType = {
  namespace: 'obdgps',
  state: {
    speed: 0, // 车速
    direction: 0, // 方向盘角度
    position: [0, 0, 0], // 位置
    rotation: [0, 0, 0], // 角度
    gear: Gear.N, // 档位
    leftTurnLight: false, // 左转向灯
    rightTurnLight: false, // 右转向灯
    handbrake: false, // 手刹
    mainSafetyBalt: false, // 主驾驶安全带
    keyStatus: KeyStatus.OFF, // 钥匙状态
    brake: false, // 刹车
    clutch: 0, // 离合猜下程度
  },

  reducers: {
    saveSpeed(state: any, { payload }) {
      return {
        ...state,
        speed: payload,
      }
    },

    saveDirection(state: any, { payload }) {
      return {
        ...state,
        direction: payload,
      }
    },

    savePosition(state: any, { payload }) {
      return {
        ...state,
        position: [...payload],
      }
    },

    saveRotation(state: any, { payload }) {
      return {
        ...state,
        rotation: [...payload],
      }
    },

    saveOBD(state: any, { payload }) {
      const { key, value } = payload;
      console.log(key, value);
      return {
        ...state,
        [key]: value
      }
    },

    reset(state: any) {
      return {
        ...state,
        speed: 0,
        direction: 0,
        position: [0, 0, 0],
        rotation: [0, 0, 0]
      }
    },
  }
}

export default OBDGPSModel;