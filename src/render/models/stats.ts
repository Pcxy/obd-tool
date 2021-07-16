import { Reducer } from 'redux';

export interface StatsStateType {
  pause: boolean;
  traceMode: boolean;
  siderMode: boolean;
}

export interface StatsModelType {
  namespace: 'stats',
  state: StatsStateType;

  reducers: {
    savePause: Reducer<StatsStateType>;
    saveTraceMode: Reducer<StatsStateType>;
    saveSiderMode: Reducer<StatsStateType>;
  }
}

const StatsModel: StatsModelType = {
  namespace: 'stats',

  state: {
    pause: false, // 暂停车辆移动
    traceMode: false, // 轨迹播放模式
    siderMode: false, // 右侧菜单切换， false: 默认的按钮， true: 轨迹列表
  },

  reducers: {
    savePause(state: any, { payload }) {
      return {
        ...state,
        pause: payload,
      }
    },

    saveTraceMode(state: any, { payload }) {
      return {
        ...state,
        traceMode: payload
      }
    },

    saveSiderMode(state: any, { payload }) {
      return {
        ...state,
        siderMode: payload,
      }
    }
  }
}

export default StatsModel;
