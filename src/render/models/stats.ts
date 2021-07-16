import { Reducer } from 'redux';

export interface StatsStateType {
  pause: boolean;
  traceMode: boolean;
}

export interface StatsModelType {
  namespace: 'stats',
  state: StatsStateType;

  reducers: {
    savePause: Reducer<StatsStateType>;
    saveTraceMode: Reducer<StatsStateType>;
  }
}

const StatsModel: StatsModelType = {
  namespace: 'stats',

  state: {
    pause: false,
    traceMode: false,
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
    }
  }
}

export default StatsModel;
