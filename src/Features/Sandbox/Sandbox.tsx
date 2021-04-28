import * as React from 'react';
import { Button } from 'semantic-ui-react';
import { openModal } from '../../App/Components/Modals/modalsSlice';
import { useAppDispatch, useAppSelector } from '../../App/Store/hooks';
import {
  decrement,
  increment,
  selectSandboxData,
  selectSandboxIsLoading,
  selectSandboxPlace,
} from './sandboxSlice';
import TestGoogleMaps from './TestGoogleMaps';
import TestGooglePlaces from './TestGooglePlaces';

const Sandbox: React.FC = () => {
  const data = useAppSelector(selectSandboxData);
  const isLoading = useAppSelector(selectSandboxIsLoading);
  const place = useAppSelector(selectSandboxPlace);
  const dispatch = useAppDispatch();
  const [targetName, setTargetName] = React.useState('');

  return (
    <>
      <h1>Testing 1, 2, 3...</h1>
      <h3>The data is: {data}</h3>
      <Button
        color='green'
        content='Increment'
        loading={isLoading && targetName === 'increment'}
        name='increment'
        onClick={(e) => {
          dispatch(increment(10));
          setTargetName(e.currentTarget.name);
        }}
      />
      <Button
        color='red'
        content='Decrement'
        loading={isLoading && targetName === 'decrement'}
        name='decrement'
        onClick={(e) => {
          dispatch(decrement(5));
          setTargetName(e.currentTarget.name);
        }}
      />
      <Button
        color='teal'
        content='Open Modal'
        onClick={() => dispatch(openModal({ modalType: 'TestModal', modalProps: { data } }))}
      />
      <TestGooglePlaces />
      <TestGoogleMaps center={place.latLng} />
    </>
  );
};

export default Sandbox;
