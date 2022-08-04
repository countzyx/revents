import * as React from 'react';
import type { ModalProps } from 'semantic-ui-react';
import UnauthModalBase from './UnauthModalBase';

const UnauthModalRedirect: React.FC<ModalProps> = (props) =>
  UnauthModalBase({ modalProps: props, goBack: true });

export default UnauthModalRedirect;
