import * as React from 'react';
import { Link } from 'react-router-dom';
import { Card, Image } from 'semantic-ui-react';
import { kUnknownUserImageUrl } from '../../../App/Shared/Constants';
import type { UserBasicInfo } from '../../../App/Shared/Types';

type Props = {
  profileInfo: UserBasicInfo;
};

const ProfileCard: React.FC<Props> = (props) => {
  const { profileInfo } = props;
  const { displayName, id, photoURL } = profileInfo;
  return (
    <Card as={Link} to={`/profile/${id}`}>
      <Image src={photoURL || kUnknownUserImageUrl} />
      <Card.Content>
        <Card.Header content={displayName} />
      </Card.Content>
    </Card>
  );
};

export default ProfileCard;
