import * as React from 'react';
import { Button } from 'semantic-ui-react';
import { openModal } from '../../App/Components/Modals/modalsSlice';
import { useAppDispatch, useAppSelector } from '../../App/Store/hooks';
import { decrement, increment } from './sandboxSlice';
import TestGoogleMaps from './TestGoogleMaps';
import TestGooglePlaces from './TestGooglePlaces';

const Sandbox: React.FC = () => {
  const data = useAppSelector((state) => state.sandbox.data);
  const place = useAppSelector((state) => state.sandbox.place);
  const dispatch = useAppDispatch();

  return (
    <>
      <h1>Testing 1, 2, 3...</h1>
      <h3>The data is: {data}</h3>
      <Button content='Increment' color='green' onClick={() => dispatch(increment(10))} />
      <Button content='Decrement' color='red' onClick={() => dispatch(decrement(5))} />
      <Button
        content='Open Modal'
        color='teal'
        onClick={() => dispatch(openModal({ modalType: 'TestModal', modalProps: { data } }))}
      />
      <TestGooglePlaces />
      <TestGoogleMaps center={place.latLng} />
    </>
  );
};

export default Sandbox;
