import React, { useEffect, useRef  } from 'react';
import {
  useLoader,
  useThree,
  useFrame,
  PrimitiveProps,
} from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import { Dispatch } from 'umi';

type CarProps = {
  // traceList: Array<TraceDot>;
  position: [number, number, number];
  rotation: [number, number, number];
  dispatch: Dispatch;
}

const Car: React.FC<CarProps> = ({ position, rotation, dispatch }) => {
  const gltf = useLoader(GLTFLoader, './car/car.gltf');

  // const ref = useRef<PrimitiveProps>();

  const { camera, gl } = useThree();

  useEffect(() => {
    const controls = new DragControls([gltf.scene], camera, gl.domElement);
    controls.transformGroup = true;
    controls.addEventListener('drag', onDrag);
    controls.addEventListener('dragstart', onDragStart);
    controls.addEventListener('dragend', onDragEnd);
    return () => {
      controls.removeEventListener('drag', onDrag);
      controls.removeEventListener('dragstart', onDragStart);
      controls.removeEventListener('dragend', onDragEnd);
    }
  }, []);

  useFrame(({ camera }) => {
    const [x, y, z] = position;
    camera.position.x = x;
    camera.position.y = y;
    camera.lookAt(x, y, 3);
    // camera.updateProjectionMatrix();
  });

  const onDrag = (event: THREE.Event) => {
    // console.log('in drag', event);
    
  }

  const onDragStart = (event: THREE.Event) => {
    // console.log('in start', event);
    // 拖拽前先暂停
    dispatch({
      type: 'obdgps/savePause',
      payload: true,
    });
  }

  const onDragEnd = (event: THREE.Event) => {
    // console.log('in end', event)
    const { x, y, z } = event.object.position;
    // 拖拽后开始
    dispatch({
      type: 'obdgps/savePause',
      payload: false,
    });
    dispatch({
      type: 'obdgps/savePosition',
      payload: [x, y, z]
    });
  }

  return (
    <group>
      <primitive object={gltf.scene} position={position} rotation={[rotation[0], rotation[1], -rotation[2]]} />
    </group>
  );
}

export default Car;
