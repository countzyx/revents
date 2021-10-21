import * as React from 'react';
import { Button, Grid, Header, Tab } from 'semantic-ui-react';
import { useAppSelector } from '../../../App/Store/hooks';
import { selectProfileCurrentProfile } from '../profilesSlice';

const AboutTab: React.FC = () => {
  const [isEditable, setIsEditable] = React.useState(false);
  const currentProfile = useAppSelector(selectProfileCurrentProfile);

  if (!currentProfile) return <div />;

  const { createdAt, description, displayName } = currentProfile;

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
