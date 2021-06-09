import React from 'react'
import { Button, Card } from 'antd';
import { connect, OBDGPSStateType } from 'umi';
import { ConnectState } from '@/models/connect';
import Field from '@components/Field';
import styles from './index.less';

interface IProps {
  obdgps: OBDGPSStateType;
}

const Index = (props: IProps) => {
  const { obdgps: { position, rotation, speed, direction } } = props;
  return (
    <div className={styles.container}>
      <div className={styles.field}>
        <Field />
      </div>
      <div className={styles.tips}>
        <span>车速：{Number(speed).toFixed(2)} km/h</span><br />
        <span>方向盘：{direction} 度</span><br />
        <span>位置：{position[0].toFixed(2)}, {position[1].toFixed(2)}, {position[2].toFixed(2)}</span><br />
        <span>转向角: {rotation[0].toFixed(2)}, {rotation[1].toFixed(2)}, {rotation[2].toFixed(2)}</span>
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
  ({ obdgps }: ConnectState) => ({ obdgps })
)(Index);

