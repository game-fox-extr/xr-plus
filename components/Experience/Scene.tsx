import React from 'react';
import { KeyboardControls } from '@react-three/drei';
import { Physics, RigidBody } from '@react-three/rapier';
import Ecctrl from 'ecctrl';
import { Castle } from './Castle';
import Light from './Light';

const keyboardMap = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'leftward', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'rightward', keys: ['ArrowRight', 'KeyD'] },
  { name: 'jump', keys: ['Space'] },
  { name: 'run', keys: ['Shift'] },
  { name: 'action1', keys: ['1'] },
  { name: 'action2', keys: ['2'] },
  { name: 'action3', keys: ['3'] },
  { name: 'action4', keys: ['KeyF'] },
];

const Scene = () => {
  return (
        <KeyboardControls map={keyboardMap}>
      <Light />
      <Physics timeStep="vary">
        <RigidBody type="fixed" colliders="cuboid">
          <Castle position={[0, -0.55, -5]} scale={1} castShadow receiveShadow />
        </RigidBody>
      </Physics>
    </KeyboardControls>
  );
};

export default Scene;
