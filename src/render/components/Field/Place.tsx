/* eslint-disable complexity */
import React, { Suspense, useEffect, useRef, } from 'react';
import { Dispatch } from 'redux';
import { connect, Gear, KeyStatus, OBDGPSStateType } from 'umi';
import {
  useLoader,
} from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import { TraceDot } from '@/models/trace';
import { Mesh, MeshStandardMaterial } from 'three';
import { radianToDegree } from '@/utils/util';
import { ConnectState } from '@/models/connect';

type PlaceProps = {
  dispatch: Dispatch;
  obdgps: OBDGPSStateType
}

const MAX_SPEED = 60;
const MIN_SPEED = -10;
const MAX_DIRECTION = 540;
const MIN_DIRECTION = -540;

const X_BASE = 330256330;

const Y_BASE = 48045999;

const Z_BASE = 3944;

const FPS = 60;

const Place: React.FC<PlaceProps> = ({
  dispatch,
  obdgps,
}) => {
  const gltf = useLoader(GLTFLoader, './tonglu/field.gltf');

  const latestObdgps = useRef(obdgps);
  useEffect(() => {
    latestObdgps.current = obdgps;
  });

  // 绑定键盘控制事件
  useEffect(() => {
    window.addEventListener('keydown', onKeyboardDown);
    const renderInterval = setInterval(renderIntervalCallback, 1000 / FPS);
    const sendOBDToMainInterval = setInterval(sendOBDToMainCallback, 200);
    const sendGPSToMainInterval = setInterval(sendGPSToMainCallback, 100);
    return () => {
      window.removeEventListener('keydown', onKeyboardDown);
      clearInterval(renderInterval);
      clearInterval(sendOBDToMainInterval);
      clearInterval(sendGPSToMainInterval);
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
    const { speed, direction, leftTurnLight, rightTurnLight, handbrake, mainSafetyBalt, keyStatus, brake, clutch, gear, rotation } = latestObdgps.current;
    let e = event || window.event;
    // console.log('key', e);
    switch (e.key) {
      case 'ArrowUp':
        dispatch({
          type: 'obdgps/saveSpeed',
          payload: speed < MAX_SPEED ? speed + 1 : MAX_SPEED,
        });
        break;

      case 'ArrowDown':
        dispatch({
          type: 'obdgps/saveSpeed',
          payload: speed > MIN_SPEED ? speed - 1: MIN_SPEED,
        }); break;
      
      case 'ArrowLeft':
        e.shiftKey
          ? dispatch({
              type: 'obdgps/saveRotation',
              payload: [rotation[0], rotation[1], rotation[2] - 5 / 180 * Math.PI]
            })
          : dispatch({
            type: 'obdgps/saveDirection',
            payload: direction > MIN_DIRECTION ? direction - 5: MIN_DIRECTION 
          });
        break;

      case 'ArrowRight':
        e.shiftKey
          ? dispatch({
            type: 'obdgps/saveRotation',
            payload: [rotation[0], rotation[1], rotation[2] + 5 / 180 * Math.PI]
          })
          : dispatch({
            type: 'obdgps/saveDirection',
            payload: direction < MAX_DIRECTION ? direction + 5: MAX_DIRECTION
          });
        break;

      case 'L':
        dispatch({
          type: 'obdgps/saveOBD',
          payload: {
            key: 'leftTurnLight',
            value: !leftTurnLight
          }
        }); break;
      case 'R': {
        dispatch({
          type: 'obdgps/saveOBD',
          payload: {
            key: 'rightTurnLight',
            value: !rightTurnLight,
          }
        }); break;
      }
      case 'H': {
        dispatch({
          type: 'obdgps/saveOBD',
          payload: {
            key: 'handbrake',
            value: !handbrake,
          }
        }); break;
      }
      case 'S': {
        dispatch({
          type: 'obdgps/saveOBD',
          payload: {
            key: 'mainSafetyBalt',
            value: !mainSafetyBalt,
          }
        }); break;
      }
      case 'K': {
        dispatch({
          type: 'obdgps/saveOBD',
          payload: {
            key: 'keyStatus',
            value: switchKeyStatus(keyStatus)
          }
        }); break;
      }
      case 'B': {
        dispatch({
          type: 'obdgps/saveOBD',
          payload: {
            key: 'brake',
            value: !brake
          }
        }); break;
      }
      case '+': {
        dispatch({
          type: 'obdgps/saveOBD',
          payload: {
            key: 'gear',
            value: increaseGear(gear)
          }
        }); break;
      }
      case '-': {
        dispatch({
          type: 'obdgps/saveOBD',
          payload: {
            key: 'gear',
            value: decreaseGear(gear)
          }
        }); break;
      }
      case '(': {
        dispatch({
          type: 'obdgps/saveOBD',
          payload: {
            key: 'clutch',
            value: increaseClutch(clutch)
          }
        }); break;
      }
      case ')': {
        dispatch({
          type: 'obdgps/saveOBD',
          payload: {
            key: 'clutch',
            value: decreaseClutch(clutch)
          }
        }); break;
      }
    }
  };

  /**
   * 60帧渲染定时器回调方法
   */
  const renderIntervalCallback = () => {
    const { position, rotation, speed, direction, pause } = latestObdgps.current;
    if (pause) return; // 暂停时不计算下一帧的gps
    let [x, y, z] = position;
    let [rx, ry, rz] = rotation;
    // 当前每一帧，车辆移动的距离，只考虑FPS=60的情况
    const d = speed / 3.6 / FPS;
    // 计算 两个方向上的增量
    x += d * Math.sin(rz);
    y += d * Math.cos(rz);

    // 假设车辆方向由下面这个公式（方向盘角度，车速）决定
    rz += direction / 360 / 360 * 30 / FPS * speed;

    if (rz < 0) {
      rz += Math.PI * 2;
    } else if (rz > Math.PI * 2) {
      rz -= Math.PI * 2;
    }

    dispatch({
      type: 'obdgps/savePosition',
      payload: [x, y, z]
    });

    dispatch({
      type: 'obdgps/saveRotation',
      payload: [rx, ry, rz]
    });
  }

  /**
   * 10HZ 发送OBDGPS数据给Main线程回调方法
   */
  const sendOBDToMainCallback = () => {
    const { speed, direction, leftTurnLight, rightTurnLight, handbrake, mainSafetyBalt, keyStatus, brake, clutch, gear } = latestObdgps.current;
    // console.log('direction', direction);
    const obj = {
      gear: gear === Gear.R ? 38 : gear + 31, // 详情参看协议
      carSpeed: speed,
      steeringWheelAngle: direction >= 0 ? Math.floor(direction * 100 / 540) + 0x1000 : 0x2000 - Math.floor(direction * 100 / 540),
      leftTurnLight,
      rightTurnLight,
      handbrake,
      mainSafetyBalt,
      keyStatus: keyStatus + 1,
      brake,
      clutch,
    }
    window.sendOBD(obj);
  }

  const sendGPSToMainCallback = () => {
    const { position, rotation } = latestObdgps.current;
    const obj = {
      xCoordinate: X_BASE + Math.floor(position[1] * 100),
      yCoordinate: Y_BASE + Math.floor(position[0] * 100),
      zCoordinate: Z_BASE + Math.floor(position[2] * 100),
      horizontalAngle: Math.floor(radianToDegree(rotation[2]) * 100),
      pitchAngle: Math.floor(radianToDegree(rotation[1]) * 100),
      rollAngle: Math.floor(radianToDegree(rotation[0]) * 100),
    };
    window.sendGPS(obj);
  }

  const switchKeyStatus = (keyStatus: KeyStatus) => {
    let result = KeyStatus.OFF;
    switch (keyStatus) {
      case KeyStatus.OFF: result = KeyStatus.ACC; break;
      case KeyStatus.ACC: result = KeyStatus.ON; break;
      case KeyStatus.ON: result = KeyStatus.OFF; break;
    }
    return result;
  }

  const increaseGear = (gear: Gear) => {
    if (gear === Gear.D5) return gear;
    return gear + 1;
  }

  const decreaseGear = (gear: Gear) => {
    if (gear === Gear.R) return gear;
    return gear - 1;
  }

  const increaseClutch = (clutch: number) => {
    let c = clutch + 17;
    return Math.min(c, 100);
  }

  const decreaseClutch = (clutch: number) => {
    let c
    if (clutch === 100) {
      c = 85;
    } else {
      c = clutch - 17;
    }
    return Math.max(c, 0);
  }

  return (
    <primitive object={gltf.scene} />
  );
};

export default Place;
