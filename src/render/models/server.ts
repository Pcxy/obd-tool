import { Reducer } from 'redux';

export interface ServerStateType {
  clientList: Array<string>;
}

export interface ServerModelType {
  namespace: 'server',
  state: ServerStateType;

  reducers: {
    addClient: Reducer<ServerStateType>;
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
    }
  }
}

export default ServerModel;