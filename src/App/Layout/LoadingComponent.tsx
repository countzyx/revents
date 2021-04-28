import * as React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

type Props = {
  content?: string;
  inverted?: boolean;
};

const LoadingComponent: React.FC<Props> = (props: Props) => {
  const { content, inverted } = props;

  return (
    <Dimmer inverted={inverted} active>
      <Loader content={content} />
    </Dimmer>
  );
};

LoadingComponent.defaultProps = {
  content: 'Loading...',
  inverted: true,
};

export default LoadingComponent;
