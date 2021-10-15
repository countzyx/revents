import * as React from 'react';
import { Button, Grid, Header, Tab } from 'semantic-ui-react';
import { UserProfile } from '../../../App/Shared/Types';

type Props = {
  profile: UserProfile;
};

const AboutTab: React.FC<Props> = (props) => {
  const { profile } = props;
  const { createdAt, description, displayName } = profile;
  const [isEditable, setIsEditable] = React.useState(false);

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16}>
          <Header content={`About ${displayName}`} floated='left' icon='user' />
          <Button
            basic
            content={isEditable ? 'Cancel' : 'Edit'}
            onClick={() => setIsEditable(!isEditable)}
            floated='right'
          />
        </Grid.Column>
        <Grid.Column width={16}>
          {isEditable ? (
            <p>profile form</p>
          ) : (
            <>
              <div style={{ marginBottom: 10 }}>Member since: {createdAt}</div>
              <div>{description}</div>
            </>
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default AboutTab;
