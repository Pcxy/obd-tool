import React, { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import {
  useThree,
} from '@react-three/fiber';
import { Dispatch } from 'redux';
import { OBDGPSStateType } from 'umi';
import { Stats } from '@react-three/drei';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Vector3 } from 'three';
import Place from './Place';
import Car from './Car';
import Light from './Light';

interface MapProps {
  dispatch: Dispatch;
  obdgps: OBDGPSStateType;
}

const Map = (props: MapProps) => {
  const { camera, gl } = useThree();

  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);

    controls.enableRotate = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    // controls.maxPolarAngle = Math.PI / 2;
    controls.rotateSpeed = 0.5;
    controls.zoomSpeed = 0.5;
    controls.maxZoom = 20;
    controls.minZoom = 3;
    controls.target = new Vector3(70, -55, 0);

    return () => {
      controls.dispose();
    };
  }, [camera, gl]);

  return (
    <group>
      <group>
        <Suspense
          fallback={ null }
        >
          <Place obdgps={props.obdgps} dispatch={props.dispatch} />
          <Car
            position={props.obdgps.position}
            rotation={props.obdgps.rotation}
            dispatch={props.dispatch}
          />
        </Suspense>
      </group>
      <Light />
      <Stats />
    </group>
  )
}

export default Map;