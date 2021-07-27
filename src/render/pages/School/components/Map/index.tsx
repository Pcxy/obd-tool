import React from 'react'
import { Button, Tag } from 'antd';
import { connect, Gear, KeyStatus, OBDGPSStateType, ServerStateType, StatsStateType, TraceMeta, TraceStateType, history }  from 'umi';
import { Dispatch } from 'dva';
import { ConnectState } from '@/models/connect';
import Field from '@components/Field';
import CardList from '@components/CardList';
import { radianToDegree } from '@/utils/util';
import styles from './index.less';
import Axios from 'axios';
import { useEffect } from 'react';

interface IProps {
  obdgps: OBDGPSStateType;
  server: ServerStateType;
  trace: TraceStateType;
  stats: StatsStateType;
  dispatch: Dispatch;
  fieldUrl: string;
  originPoint: [number, number, number];
}

const Index = (props: IProps) => {
  const {
    obdgps: { position, rotation, speed, direction, leftTurnLight, rightTurnLight, handbrake, mainSafetyBalt, keyStatus, brake, clutch, gear  },
    server: { clientList },
    trace: { list: traceList },
    stats: { siderMode },
    dispatch,
    fieldUrl,
    originPoint,
  } = props;

  useEffect(() => {
    return () => {
      console.log('in reset')
      dispatch({
        type: 'obdgps/reset'
      });
    }
  }, [])

  const onCardClick = (item: TraceMeta) => {
    // console.log('item', item);
    Axios.request({
      url: item.url,
      method: 'get',
    }).then(res => {
      // console.log(res.data);
      dispatch({
        type: 'trace/saveCurrent',
        payload: {
          ...item,
          data: res.data.data || [],
        }
      });
      // 进入播放轨迹模式
      dispatch({
        type: 'stats/saveTraceMode',
        payload: true,
      })
    })
  }

  return (
    <div className={styles.container}>
      <div className={styles.field}>
        <Field url={fieldUrl} originPoint={originPoint} />
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
        <span>当前连接终端地址：{clientList.map((client, index) => (
          <Tag key={index}>{client}</Tag>
        ))}</span>
      </div>
      <div className={styles.sider}>
        { siderMode
          ? <>
              <Button style={{ width: '100%', marginTop: 10 }} onClick={() => {
                dispatch({
                  type: 'stats/saveSiderMode',
                  payload: false,
                });
                dispatch({
                  type: 'stats/saveTraceMode',
                  payload: false,
                })
              }}>返回自由模式</Button>
              <CardList list={traceList} onCardClick={onCardClick} /> 
            </>
          : <div className={styles.buttons}>
              <Button onClick={() => {
                props.dispatch({
                  type: 'stats/saveSiderMode',
                  payload: true,
                })
              }} style={{ marginTop: 10 }}>
                轨迹回放模式
              </Button>
              <Button onClick={() => {
                props.dispatch({
                  type: 'obdgps/reset'
                });
              }} style={{ marginTop: 10 }}>
                回到原点
              </Button>
              <Button onClick={() => {
                history.push('/')
              }} style={{ marginTop: 10 }}>
                返回首页
              </Button>
            </div>
        }
      </div>
    </div>
  )
}

export default connect(
  ({ obdgps, server, trace, stats }: ConnectState) => ({ obdgps, server, trace, stats })
)(Index);

