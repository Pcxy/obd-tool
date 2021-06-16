import React, { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Dispatch } from 'redux';
import { connect, OBDGPSStateType } from 'umi';
import {
  useLoader,
  Canvas,
  useThree,
  useFrame,
  extend,
  PrimitiveProps,
} from '@react-three/fiber';
import { Stats } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { TraceDot } from '@/models/trace';
import { Color, Mesh, MeshStandardMaterial, Vector3 } from 'three';
import { ConnectState } from '@/models/connect';
import { radianToDegree } from '@/utils/util';
import Place from './Place';

type MapProps = {
  dispatch: Dispatch;
  obdgps: OBDGPSStateType;
}

type CarProps = {
  // traceList: Array<TraceDot>;
  position: [number, number, number];
  rotation: [number, number, number];
}


extend({ OrbitControls });

function useCurrent<T>(val: T) {
  const ref = useRef<T>();
  ref.current = val;
  return ref.current;
}


const Car: React.FC<CarProps> = ({ position, rotation }) => {
  const gltf = useLoader(GLTFLoader, './car/car.gltf');

  const fpsIndex = useRef<number>(0);

  const ref = useRef<PrimitiveProps>();

  useFrame(({ camera }) => {
    const [x, y, z] = position;
    ref.current.position.x = x;
    ref.current.position.y = y;
    ref.current.position.z = z;
    ref.current.rotation.z = -rotation[2];
    camera.position.x = x;
    camera.position.y = y;
    camera.lookAt(x, y, 3);
    camera.updateProjectionMatrix();
  });

  return (
    <group>
      <primitive ref={ref} object={gltf.scene} />
    </group>
  );
}

const CameraControls = () => {
  // Get a reference to the Three.js Camera, and the canvas html element.
  // We need these to setup the OrbitControls class.
  // https://threejs.org/docs/#examples/en/controls/OrbitControls

  const {
    camera,
    gl: { domElement },
  } = useThree();

  // Ref to the controls, so that we can update them on every frame using useFrame
  const controls = useRef();
  // useFrame(state => controls.current.update());
  return (
    <orbitControls
      ref={controls}
      args={[camera, domElement]}
      enableZoom
      enableRotate={false}
    />
  );
};


const Index = (props: MapProps) => {
  return (
    <Canvas
      camera={{
        fov: 70,
        aspect: 16 / 10,
        near: 10,
        far: 1000,
        position: [0, 0, 20],
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
      {/* <CameraControls /> */}
      <group>
        <Suspense
          fallback={ null }
        >
          <Place obdgps={props.obdgps} dispatch={props.dispatch} />
          <Car
            position={props.obdgps.position}
            rotation={props.obdgps.rotation}
          />
        </Suspense>
      </group>
      <Lights />
      <Stats />
    </Canvas>
  );
};

const Lights = () => {
  return (
    <>
      <directionalLight color={0xffffff} position={[1, 3, 3.5]} intensity={3} />
      <directionalLight color={0xffffff} position={[-3, 0.2, -1]} intensity={3} />
      <directionalLight color={0xffffff} position={[-3, -10, -1]} intensity={3} />
    </>
  )
}

export default connect(
  ({ obdgps }: ConnectState) => ({ obdgps })
)(Index);
