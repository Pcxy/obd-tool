import { OBDGPSStateType  } from './obd';
import { ServerStateType} from './server';
import { TraceStateType } from './trace';
import { StatsStateType} from './stats';
export interface ConnectState {
  obdgps: OBDGPSStateType;
  server: ServerStateType;
  trace: TraceStateType;
  stats: StatsStateType;
}