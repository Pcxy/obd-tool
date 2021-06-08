import React from 'react'
import { Button, Card } from 'antd';
import Field from '@components/Field';
import styles from './index.less';

interface IProps {
}

const WebSocket = (props: IProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.field}>
        <Field />
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

export default WebSocket
