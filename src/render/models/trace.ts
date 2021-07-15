import { Reducer } from 'redux';

export interface TraceMeta {
  name: string;
  description: string;
  url: string;
}

export interface TraceModelState {
  list: Array<TraceMeta>;
  current: Array<any>;
}

export interface TraceModelType {
  namespace: 'trace',
  state: TraceModelState;

  reducers: {
    saveList: Reducer<TraceModelState>;
    saveCurrent: Reducer<TraceModelState>;
  }
}

const TraceModel: TraceModelType = {
  namespace: 'trace',

  state: {
    list: [
      { name: '侧方1', description: '侧方1', url: './json/侧方1.json' },
      { name: '侧方2', description: '侧方2', url: './json/侧方2.json' },
    ],
    current: [],
  },

  reducers: {
    saveList(state: any, { payload }) {
      return {
        ...state,
        list: payload,
      }
    },
    saveCurrent(state: any, { payload }) {
      return {
        ...state,
        current: payload
      }
    }
  }
}

export default TraceModel;
