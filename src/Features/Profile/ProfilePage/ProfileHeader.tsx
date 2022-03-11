import * as React from 'react';
import { Button, Divider, Grid, Header, Item, Reveal, Segment, Statistic } from 'semantic-ui-react';
import { kUnknownUserImageUrl } from '../../../App/Shared/Constants';
import { useAppSelector } from '../../../App/Store/hooks';
import { selectAuthUserInfo } from '../../Auth/authSlice';
import { selectProfileSelectedProfile } from '../profilesSlice';

const ProfileHeader: React.FC = () => {
  const currentUser = useAppSelector(selectAuthUserInfo);
  const selectedProfile = useAppSelector(selectProfileSelectedProfile);
  const isCurrentUser = currentUser && currentUser.uid === selectedProfile?.id;

  if (!selectedProfile) return <div />;

  const { displayName, photoURL } = selectedProfile;

  return (
    <Segment>
      <Grid>
        <Grid.Column width={12}>
          <Item.Group>
            <Item>
              <Item.Image avatar size='small' src={photoURL || kUnknownUserImageUrl} />
              <Item.Content verticalAlign='middle'>
                <Header
                  as='h1'
                  content={displayName}
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
          {!isCurrentUser && (
            <>
              <Divider />
              <Reveal animated='move'>
                <Reveal.Content style={{ width: '100%' }} visible>
                  <Button color='teal' content='Following' fluid />
                </Reveal.Content>
                <Reveal.Content hidden style={{ width: '100%' }}>
                  <Button basic color='red' content='Unfollow' fluid />
                </Reveal.Content>
              </Reveal>
            </>
          )}
        </Grid.Column>
      </Grid>
    </Segment>
  );
};

export default ProfileHeader;
