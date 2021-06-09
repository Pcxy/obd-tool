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

type MapProps = {
  dispatch: Dispatch;
  obdgps: OBDGPSStateType;
}

type CarProps = {
  // traceList: Array<TraceDot>;
  position: [number, number, number];
  rotation: [number, number, number];
}

type PlaceProps = {
  dispatch: Dispatch;
  speed: number;
  direction: number;
  rotation: [number, number, number];
  position: [number, number, number];
}

const MAX_SPEED = 60;
const MIN_SPEED = -10;
const MAX_DIRECTION = 540;
const MIN_DIRECTION = -540;


extend({ OrbitControls });

function useCurrent<T>(val: T) {
  const ref = useRef<T>();
  ref.current = val;
  return ref.current;
}

const Place: React.FC<PlaceProps> = ({ dispatch, speed, direction, rotation, position }) => {
  const gltf = useLoader(GLTFLoader, './tonglu/field.gltf');

  const speedRef = useRef<number>(0);
  speedRef.current = speed;
  const directionRef = useRef<number>(0);
  directionRef.current = direction;
  const positionRef = useRef<[number, number, number]>([0, 0, 0]);
  positionRef.current = position;
  const rotationRef = useRef<[number, number, number]>([0, 0, 0]);
  rotationRef.current = rotation;


  // 绑定键盘控制事件
  useEffect(() => {
    window.addEventListener('keydown', onKeyboardDown);
    let interval = setInterval(() => {
      // let [rx, ry, rz] = rotation;
      // dispatch({
        //   type: 'obdgps/saveDirection',
        //   payload: [rx, ry, rz]
        // });
      let [x, y, z] = positionRef.current;
      let [rx, ry, rz] = rotationRef.current;
      const d = speedRef.current / 3.6 / 60; // 当前每一帧，车辆移动的距离
      x += d * Math.sin(rz);
      y += d * Math.cos(rz);

      // 假设车辆方向由下面这个公式（方向盘角度，车速）决定
      rz += directionRef.current / 360 / 360 * 20 / 60 * speedRef.current;
      
      // x += speedRef.current / 3.6 / 60;

      dispatch({
        type: 'obdgps/savePosition',
        payload: [x, y, z]
      });

      dispatch({
        type: 'obdgps/saveRotation',
        payload: [rx, ry, rz]
      })

      console.log('positon', [x, y, z]);
    }, 1000 / 60);
    return () => {
      window.removeEventListener('keydown', onKeyboardDown);
      clearInterval(interval);
    }
  }, []);

  // 加载gltf
  useEffect(() => {
    if (gltf) {
      /**
       * 隐藏碰撞体
       */
      const colliderOverline = gltf.scene.getObjectByName('collider-overline');
      const colliderDirection = gltf.scene.getObjectByName('collider-direction');
      const colliderOverlineRoadline = gltf.scene.getObjectByName('collider-roadline');

      if (colliderOverline) {
        for (let item of colliderOverline.children) {
          (item as Mesh).material = new MeshStandardMaterial({
            transparent: true,
            opacity: 0,
          });
        }
      }
      if (colliderOverlineRoadline) {
        for (let item of colliderOverlineRoadline.children) {
          (item as Mesh).material = new MeshStandardMaterial({
            transparent: true,
            opacity: 0,
          });
        }
      }
      if (colliderDirection) {
        for (let item of colliderDirection.children) {
          (item as Mesh).material = new MeshStandardMaterial({
            transparent: true,
            opacity: 0,
          });
        }
      }
    }
  }, [gltf]);

  const onKeyboardDown = (event: KeyboardEvent) => {
    let e = event || window.event;
    console.log('key', e.key);
    switch (e.key) {
      case 'ArrowUp':
        dispatch({
          type: 'obdgps/saveSpeed',
          payload: speedRef.current < MAX_SPEED ? speedRef.current + 1 : MAX_SPEED,
        }); break;
      
      case 'ArrowDown':
        dispatch({
          type: 'obdgps/saveSpeed',
          payload: speedRef.current > MIN_SPEED ? speedRef.current - 1: MIN_SPEED,
        }); break;
      
      case 'ArrowLeft':
        dispatch({
          type: 'obdgps/saveDirection',
          payload: directionRef.current > MIN_DIRECTION ? directionRef.current - 5: MIN_DIRECTION 
        }); break;

      case 'ArrowRight':
        dispatch({
          type: 'obdgps/saveDirection',
          payload: directionRef.current < MAX_DIRECTION ? directionRef.current + 5: MAX_DIRECTION
        }); break;
    }
  };

  return (
    <>
      <primitive object={gltf.scene} />
    </>
  );
};

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
            // <div className={styles.loading}>
            //     <img src={loadingPng} width="70" height="70"></img>
            //   </div>
            // }
        >
          <Place
            dispatch={props.dispatch}
            speed={props.obdgps.speed}
            direction={props.obdgps.direction}
            rotation={props.obdgps.rotation}
            position={props.obdgps.position}
          />
          <Car
            position={props.obdgps.position}
            rotation={props.obdgps.rotation}
          />
        </Suspense>
        {/* <Suspense fallback={null}>
        </Suspense> */}
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

/**
 * 角度转换成弧度
 *
 * @param degree - 角度
 * @returns 弧度
 */
 const degreeToRadian = (degree: number) => {
  const radian = (Math.PI * degree) / 180;
  return radian;
};


export default connect(
  ({ obdgps }: ConnectState) => ({ obdgps })
)(Index);
