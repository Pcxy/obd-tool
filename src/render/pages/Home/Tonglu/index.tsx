import React from 'react'
import { Button, Card } from 'antd';
import { connect, Gear, KeyStatus, OBDGPSStateType, ServerStateType }  from 'umi';
import { ConnectState } from '@/models/connect';
import Field from '@components/Field';
import { radianToDegree } from '@/utils/util';
import styles from './index.less';

interface IProps {
  obdgps: OBDGPSStateType;
  server: ServerStateType;
}

const Index = (props: IProps) => {
  const { obdgps: { position, rotation, speed, direction, leftTurnLight, rightTurnLight, handbrake, mainSafetyBalt, keyStatus, brake, clutch, gear  }, server: { clientList } } = props;
  return (
    <div className={styles.container}>
      <div className={styles.field}>
        <Field />
      </div>
      <div className={styles.tips}>
        <span>车速( ↑ ↓ )：{speed} km/h</span><br />
        <span>档位( + - )：{Gear[gear]}</span><br />
        <span>方向盘( ← → )：{direction} 度</span><br />
        <span>位置：{Math.floor(position[0] * 100) / 100}, {Math.floor(position[1] * 100) / 100}, {Math.floor(position[2] * 100) / 100}</span><br />
        <span>转向角: {Math.floor(radianToDegree(rotation[0]) * 100) / 100}, {Math.floor(radianToDegree(rotation[1]) * 100) / 100}, {Math.floor(radianToDegree(rotation[2]) * 100) / 100}</span><br />
        <span>左转向灯( L )：{leftTurnLight ? '开启' : '关闭'}</span><br />
        <span>右转向灯( R )：{rightTurnLight ? '开启' : '关闭'}</span><br />
        <span>手刹( H )：{handbrake ? '开启' : '关闭'}</span><br />
        <span>安全带( S )：{mainSafetyBalt ? '已系' : '未系'}</span><br />
        <span>钥匙状态( K )：{KeyStatus[keyStatus]}</span><br />
        <span>刹车状态( B )：{brake ? '踩下' : '释放'}</span><br />
        <span>离合( ( ) ): {clutch}%</span><br />
      </div>
      <div className={styles.clients}>
        <span>当前连接用户：{clientList.map((client, index) => (
          <span key={index}>{client}</span>
        ))}</span>
      </div>
      <div className={styles.back}>
        <Button onClick={() => {
          props.history.push('/')
        }} style={{ marginTop: 10 }}>
          返回
        </Button>
      </div>
    </div>
  )
}

export default connect(
  ({ obdgps, server }: ConnectState) => ({ obdgps, server })
)(Index);

