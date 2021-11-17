import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button, Header, Segment } from 'semantic-ui-react';

type Props = {
  error?: Error;
};

const Error: React.FC<Props> = (props: Props) => {
  const { error } = props;
  const location = useLocation();

  let locationError: Error | undefined;
  if (!error) {
    locationError = location.state.error;
  }

  return (
    <Segment>
      <Header
        content={error?.message || locationError?.message || 'Oops - we have an error'}
        textAlign='center'
      />
      <Button
        as={Link}
        content='Return to Events Page'
        to='/events'
        primary
        style={{ marginTop: 20 }}
      />
    </Segment>
  );
};

Error.defaultProps = { error: undefined };

export default Error;
