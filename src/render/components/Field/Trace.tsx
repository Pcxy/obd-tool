import React, { useEffect, useRef } from 'react';
import { Dispatch } from 'redux';
import { degreeToRadian, radianToDegree } from '@utils/util';

interface Props {
  traceList: Array<any>;
  dispatch: Dispatch;
}

const rate = 10; // 发送给安卓的频率 10HZ

const X_BASE = 330256330;
const Y_BASE = 48045999;
const Z_BASE = 3944;

export default (props: Props) => {
  
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const point = props.traceList[frameRef.current];
        const x = Number(point.xcoord);
        const y = Number(point.ycoord);
        const z = Number(point.zcoord);
        const rx = degreeToRadian(Number(point.angleRoll));
        const ry = degreeToRadian(Number(point.anglePitch));
        const rz = degreeToRadian(Number(point.angleHorizontal));
        props.dispatch({
          type: 'obdgps/savePosition',
          payload: [x, y, z]
        });
        props.dispatch({
          type: 'obdgps/saveRotation',
          payload: [rx, ry, rz]
        });
        const obj = {
          xCoordinate: X_BASE + Math.floor(y * 100),
          yCoordinate: Y_BASE + Math.floor(x * 100),
          zCoordinate: Z_BASE + Math.floor(z * 100),
          horizontalAngle: Math.floor(radianToDegree(rz) * 100),
          pitchAngle: Math.floor(radianToDegree(ry) * 100),
          rollAngle: Math.floor(radianToDegree(rx) * 100),
        }
        window.sendGPS(obj);
        frameRef.current += 1;
        if (frameRef.current >= props.traceList.length) {
          frameRef.current = 0;
        }
      } catch (e) {
        console.error(e);
        clearInterval(interval);
      }
    }, 1000 / rate);

    return () => {
      clearInterval(interval);
    }
  }, []);

  return null
}
