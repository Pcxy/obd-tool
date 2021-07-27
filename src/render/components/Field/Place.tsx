/* eslint-disable complexity */
import React, { Suspense, useEffect, useRef, } from 'react';
import { Dispatch } from 'redux';
import { OBDGPSStateType } from 'umi';
import {
  useLoader,
} from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import { TraceDot } from '@/models/trace';
import { Mesh, MeshStandardMaterial } from 'three';

interface PlaceProps {
  dispatch: Dispatch;
  obdgps: OBDGPSStateType;
  url: string;
}

const Place: React.FC<PlaceProps> = (props: PlaceProps) => {
  const gltf = useLoader(GLTFLoader, props.url);

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


  return (
    <primitive object={gltf.scene} />
  );
};

export default Place;
