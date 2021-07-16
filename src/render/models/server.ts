import { Reducer } from 'redux';

export interface ServerStateType {
  clientList: Array<string>;
}

export interface ServerModelType {
  namespace: 'server',
  state: ServerStateType;

  reducers: {
    addClient: Reducer<ServerStateType>;
    removeClient: Reducer<ServerStateType>;
  }
}

const ServerModel: ServerModelType = {
  namespace: 'server',
  state: {
    clientList: [],
  },
  reducers: {
    addClient(state: any, { payload }) {
      return {
        ...state,
        clientList: [...state.clientList, payload]
      }
    },
    
    removeClient(state: any, { payload }) {
      const index = state.clientList.find(c => c === payload);
      state.clientList.splice(index, 1);
      return {
        ...state,
        clientList: [...state.clientList]
      }
    }
  }
}

export default ServerModel;