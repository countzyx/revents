import * as React from 'react';
import ModalWrapper from '../../App/Components/Modals/ModalWrapper';

type Props = {
  data: string;
};

const TestModal: React.FC<Props> = (props: Props) => {
  const { data } = props;

  return (
    <ModalWrapper header='Test Modal' size='mini'>
      <div>The data is: {data}</div>
    </ModalWrapper>
  );
};

export default TestModal;
