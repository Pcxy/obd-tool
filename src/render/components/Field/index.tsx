import React from 'react';
import { Dispatch } from 'redux';
import { connect, OBDGPSStateType, StatsStateType, TraceStateType } from 'umi';
import {
  Canvas,
} from '@react-three/fiber';

// import { TraceDot } from '@/models/trace';
import { Color, Mesh, MeshStandardMaterial, Vector3 } from 'three';
import { ConnectState } from '@/models/connect';
import Map from './Map';
import KeyboardControl from './KeyboardControl';
import Trace from './Trace';

interface MapProps {
  dispatch: Dispatch;
  obdgps: OBDGPSStateType;
  trace: TraceStateType;
  stats: StatsStateType;
  url: string;
  originPoint: [number, number, number];
}

const Index = (props: MapProps) => {
  return (
    <Canvas
      orthographic
      camera={{
        left: 1920 / -14,
        right: 1920 / 14,
        top: 666 / -14,
        bottom: 666 / 14,
        near: 1,
        far: 100,
        position: [0, 0, 20],
        zoom: 25,
      }}
      onCreated={({ scene, camera }) => {
        // scene.translateX(-65);
        // scene.translateY(-70);
        scene.background = new Color(0x6f6f6f);
        // camera.up = new Vector3(0, 0, 1);
        camera.lookAt(0, 0, 0);
      }}
      style={{ width: '100%', height: '100%' }}
    >
      <Map {...props} />
      {
        props.stats.traceMode
          ? <Trace
              key={props.trace.current?.name}
              traceList={props.trace.current?.data || []}
              dispatch={props.dispatch}
            />
          : <KeyboardControl {...props}/>
      }
    </Canvas>
  );
};

export default connect(
  ({ obdgps, trace, stats }: ConnectState) => ({ obdgps, trace, stats })
)(Index);
