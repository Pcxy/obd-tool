import { OBDGPSStateType  } from './obd';
import { ServerStateType} from './server';
import { TraceModelState } from './trace';
export interface ConnectState {
  obdgps: OBDGPSStateType;
  server: ServerStateType;
  trace: TraceModelState;
}