import { Reducer } from 'redux';

export interface OBDGPSStateType {
  speed: number;
  direction: number;
  position: [number, number, number];
  rotation: [number, number, number];
}

export interface OBDGPSModelType {
  namespace: 'obdgps';
  state: OBDGPSStateType;

  reducers: {
    saveSpeed: Reducer<OBDGPSStateType>;
    saveDirection: Reducer<OBDGPSStateType>;
    savePosition: Reducer<OBDGPSStateType>;
    saveRotation: Reducer<OBDGPSStateType>;
  }
}

const OBDGPSModel : OBDGPSModelType = {
  namespace: 'obdgps',
  state: {
    speed: 0, // 车速
    direction: 0, // 方向盘角度
    position: [0, 0, 0], // 位置
    rotation: [0, 0, 0], // 角度
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
  }
}

export default OBDGPSModel;