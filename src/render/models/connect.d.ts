import { OBDGPSStateType  } from './obd';
import { ServerStateType} from './server';

export interface ConnectState {
  obdgps: OBDGPSStateType;
  server: ServerStateType;
}