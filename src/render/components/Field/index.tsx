import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Dispatch } from 'redux';
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

type MapProps = {
  // dispatch: Dispatch;
  // traceList: Array<TraceDot>;
}

type CarProps = {
  // traceList: Array<TraceDot>;
  position: [number, number, number];
  rotation: [number, number, number];
}


function usePrevious<T>(val: T) {
  const ref = useRef<T>(val);
  useEffect(() => {
    ref.current = val;
  }, [val]);
  return ref.current;
}

extend({ OrbitControls });

const Place = () => {
  const gltf = useLoader(GLTFLoader, './tonglu/field.gltf');
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

  useEffect(() => {
    window.addEventListener('keypress', (event: KeyboardEvent) => {
      console.log('key', event.key);
    });
  }, []);
  return (
    <>
      <primitive object={gltf.scene} />
    </>
  );
};

const Car = (props: CarProps) => {
  const gltf = useLoader(GLTFLoader, './car/car.gltf');

  const fpsIndex = useRef<number>(0);

  const ref = useRef<PrimitiveProps>();

  useFrame(({ camera }) => {
    const { position: [x, y, z], rotation } = props;
    ref.current.position.x = x;
    ref.current.position.y = y;
    ref.current.position.z = z;
    camera.position.x = x;
    camera.position.y = y;
    camera.lookAt(x, y, 3);
    camera.updateProjectionMatrix();
  });

  return (
    <group>
      <primitive ref={ref} object={gltf.scene} position={[50, 50, 3]} />
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
          <Place></Place>
          <Car position={[50, 50, 3]} />
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


export default Index;
