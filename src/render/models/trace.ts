import { Reducer } from 'redux';

export interface TraceMeta {
  name: string;
  description: string;
  url: string;
}

export interface TraceStateType {
  list: Array<TraceMeta>;
  current: TraceMeta & {
    data: Array<any>
  } | null;
}

export interface TraceModelType {
  namespace: 'trace',
  state: TraceStateType;

  reducers: {
    saveList: Reducer<TraceStateType>;
    saveCurrent: Reducer<TraceStateType>;
  }
}

const TraceModel: TraceModelType = {
  namespace: 'trace',

  state: {
    list: [
      { name: '侧方1', description: '侧方1', url: './json/侧方1.json' },
      { name: '侧方2', description: '侧方2', url: './json/侧方2.json' },
    ],
    current: null,
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
