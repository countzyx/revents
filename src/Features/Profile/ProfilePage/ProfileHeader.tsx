import * as React from 'react';
import { Button, Divider, Grid, Header, Item, Reveal, Segment, Statistic } from 'semantic-ui-react';
import { kUnknownUserImageUrl } from '../../../App/Shared/Constants';
import { useAppDispatch, useAppSelector } from '../../../App/Store/hooks';
import { selectAuthUserInfo } from '../../Auth/authSlice';
import {
  getIsSelectedProfileFollowed,
  selectProfileIsSelectedProfileFollowed,
  selectProfileIsUpdating,
  selectProfileSelectedProfile,
  setFollowUser,
  setUnfollowUser,
} from '../profilesSlice';

const ProfileHeader: React.FC = () => {
  const dispatch = useAppDispatch();
  const isUpdatingProfile = useAppSelector(selectProfileIsUpdating);
  const currentUser = useAppSelector(selectAuthUserInfo);
  const selectedProfile = useAppSelector(selectProfileSelectedProfile);
  const isCurrentUser = currentUser && currentUser.uid === selectedProfile?.id;
  const isSelectedProfileFollowed = useAppSelector(selectProfileIsSelectedProfileFollowed);

  React.useEffect(() => {
    if (currentUser && selectedProfile && !isCurrentUser) dispatch(getIsSelectedProfileFollowed());
  }, [dispatch, currentUser, isCurrentUser, selectedProfile]);

  const handleFollowUser = () => {
    if (selectedProfile) dispatch(setFollowUser(selectedProfile));
  };

  const handleUnfollowUser = () => {
    if (selectedProfile) dispatch(setUnfollowUser(selectedProfile.id));
  };

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
            <Statistic label='Followers' value={selectedProfile.followerCount} />
            <Statistic label='Following' value={selectedProfile.followingCount} />
          </Statistic.Group>
          {!isCurrentUser && (
            <>
              <Divider />
              <Reveal animated='move'>
                <Reveal.Content style={{ width: '100%' }} visible>
                  <Button
                    color='teal'
                    content={isSelectedProfileFollowed ? 'Following' : 'Not Following'}
                    fluid
                  />
                </Reveal.Content>
                <Reveal.Content hidden style={{ width: '100%' }}>
                  {isSelectedProfileFollowed ? (
                    <Button
                      basic
                      color='red'
                      content='Unfollow'
                      fluid
                      loading={isUpdatingProfile}
                      onClick={handleUnfollowUser}
                    />
                  ) : (
                    <Button
                      basic
                      color='green'
                      content='Follow'
                      fluid
                      loading={isUpdatingProfile}
                      onClick={handleFollowUser}
                    />
                  )}
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
