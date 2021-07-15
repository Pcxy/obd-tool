import React from 'react';

const Lights = () => {
  return (
    <>
      <directionalLight color={0xffffff} position={[1, 3, 3.5]} intensity={3} />
      <directionalLight color={0xffffff} position={[-3, 0.2, -1]} intensity={3} />
      <directionalLight color={0xffffff} position={[-3, -10, -1]} intensity={3} />
    </>
  )
}

export default Lights;