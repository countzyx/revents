import * as React from 'react';
import type { ModalProps } from 'semantic-ui-react';
import UnauthModalBase from './UnauthModalBase';

const UnauthModalNoRedirect: React.FC<ModalProps> = (props) =>
  UnauthModalBase({ modalProps: props, goBack: false });

export default UnauthModalNoRedirect;
