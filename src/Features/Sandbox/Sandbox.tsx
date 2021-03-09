import * as React from 'react';
import { Button } from 'semantic-ui-react';
import { useAppDispatch, useAppSelector } from '../../App/Store/hooks';
import { decrement, increment } from './sandboxSlice';

const Sandbox: React.FC = () => {
  const data = useAppSelector((state) => state.sandbox.data);
  const dispatch = useAppDispatch();

  return (
    <>
      <h1>Testing 1, 2, 3...</h1>
      <h3>The data is: {data}</h3>
      <Button content='Increment' color='green' onClick={() => dispatch(increment(10))} />
      <Button content='Decrement' color='red' onClick={() => dispatch(decrement(5))} />
    </>
  );
};

export default Sandbox;
