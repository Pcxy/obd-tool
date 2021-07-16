import React from 'react';
import { Card } from 'antd';
import { TraceMeta } from '@/models/trace';

interface Props {
  list: Array<TraceMeta>;
  onCardClick: Function;
}

const CarList = (props: Props) => {

  const onCardClick = (item: TraceMeta) => {
    props.onCardClick(item)
  }

  return (
    <div style={{ marginTop: 10}}>
      {props.list.map(item => (
        <Card
          key={item.name}
          style={{ width: 240 }}
          onClick={() => onCardClick(item)}
        >
          <Card.Meta title={item.name} description={item.description} />
        </Card>
      ))}
    </div>
  )
}

export default CarList;
