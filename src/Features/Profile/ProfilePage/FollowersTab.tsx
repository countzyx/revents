import * as React from 'react';
import { Card, Grid, Header, Tab } from 'semantic-ui-react';
import { useAppDispatch, useAppSelector } from '../../../App/Store/hooks';
import {
  fetchFollowersForProfile,
  selectProfileFollowers,
  selectProfileIsLoadingFollowers,
  selectProfileSelectedProfile,
} from '../profilesSlice';
import ProfileCard from './ProfileCard';

const FollowersTab: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedProfile = useAppSelector(selectProfileSelectedProfile);
  const followers = useAppSelector(selectProfileFollowers);
  const isLoadingFollowers = useAppSelector(selectProfileIsLoadingFollowers);

  React.useEffect(() => {
    if (!selectedProfile) return undefined;

    const unsubscribe = fetchFollowersForProfile(dispatch, selectedProfile.id);
    return unsubscribe;
  }, [dispatch, selectedProfile]);

  if (!selectedProfile || !selectedProfile.displayName) return <div />;

  return (
    <Tab.Pane loading={isLoadingFollowers}>
      <Grid>
        <Grid.Column width={16}>
          <Header content='Followers' floated='left' icon='user' />
        </Grid.Column>
        <Grid.Column width={16}>
          <Card.Group itemsPerRow={5}>
            {followers.length > 0 &&
              followers.map((followerInfo) => (
                <ProfileCard key={followerInfo.id} profileInfo={followerInfo} />
              ))}
          </Card.Group>
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default FollowersTab;
