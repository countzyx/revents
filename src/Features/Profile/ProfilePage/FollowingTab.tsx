import * as React from 'react';
import { Card, Grid, Header, Tab } from 'semantic-ui-react';
import { useAppDispatch, useAppSelector } from '../../../App/Store/hooks';
import {
  fetchFollowingForProfile,
  selectProfileFollowing,
  selectProfileIsLoadingFollowing,
  selectProfileSelectedProfile,
} from '../profilesSlice';
import ProfileCard from './ProfileCard';

const FollowingTab: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedProfile = useAppSelector(selectProfileSelectedProfile);
  const following = useAppSelector(selectProfileFollowing);
  const isLoadingFollowing = useAppSelector(selectProfileIsLoadingFollowing);

  React.useEffect(() => {
    if (!selectedProfile) return undefined;

    const unsubscribe = fetchFollowingForProfile(dispatch, selectedProfile.id);
    return unsubscribe;
  }, [dispatch, selectedProfile]);

  if (!selectedProfile || !selectedProfile.displayName) return <div />;

  return (
    <Tab.Pane loading={isLoadingFollowing}>
      <Grid>
        <Grid.Column width={16}>
          <Header content='Following' floated='left' icon='heart' />
        </Grid.Column>
        <Grid.Column width={16}>
          <Card.Group itemsPerRow={5}>
            {following.length > 0 &&
              following.map((followingInfo) => (
                <ProfileCard key={followingInfo.id} profileInfo={followingInfo} />
              ))}
          </Card.Group>
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default FollowingTab;
