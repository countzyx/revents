import * as React from 'react';
import { useSelector } from 'react-redux';
import type { TestState } from '../../Features/Sandbox/testReducer';

const Sandbox: React.FC = () => {
  const data = useSelector((state: TestState) => state.data);
  return (
    <>
      <h1>Testing 1, 2, 3...</h1>
      <h3>The data is: {data}</h3>
    </>
  );
};

export default Sandbox;
