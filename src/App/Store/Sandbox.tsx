import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'semantic-ui-react';
import { DECREMENT_DATA, INCREMENT_DATA, TestState } from '../../Features/Sandbox/testReducer';

const Sandbox: React.FC = () => {
  const data = useSelector((state: TestState) => state.data);
  const dispatch = useDispatch();

  return (
    <>
      <h1>Testing 1, 2, 3...</h1>
      <h3>The data is: {data}</h3>
      <Button content='Increment' color='green' onClick={() => dispatch({ type: INCREMENT_DATA })} />
      <Button content='Decrement' color='red' onClick={() => dispatch({ type: DECREMENT_DATA })} />
    </>
  );
};

export default Sandbox;
