import * as React from 'react';
import { Button, Divider, Grid, Header, Item, Reveal, Segment, Statistic } from 'semantic-ui-react';
import { UserProfile } from '../../../App/Shared/Types';

type Props = {
  profile: UserProfile;
};

const ProfileHeader: React.FC<Props> = (props) => {
  const { profile } = props;

  return (
    <Segment>
      <Grid>
        <Grid.Column width={12}>
          <Item.Group>
            <Item>
              <Item.Image avatar size='small' src={profile.photoURL || '/assets/user.png'} />
              <Item.Content verticalAlign='middle'>
                <Header
                  as='h1'
                  content={profile.displayName}
                  style={{ display: 'block', marginBottom: 10 }}
                />
              </Item.Content>
            </Item>
          </Item.Group>
        </Grid.Column>
        <Grid.Column width={4}>
          <Statistic.Group>
            <Statistic label='Followers' value={10} />
            <Statistic label='Following' value={5} />
          </Statistic.Group>
          <Divider />
          <Reveal animated='move'>
            <Reveal.Content style={{ width: '100%' }} visible>
              <Button color='teal' content='Following' fluid />
            </Reveal.Content>
            <Reveal.Content hidden style={{ width: '100%' }}>
              <Button basic color='red' content='Unfollow' fluid />
            </Reveal.Content>
          </Reveal>
        </Grid.Column>
      </Grid>
    </Segment>
  );
};

export default ProfileHeader;
