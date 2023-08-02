import { Avatar, AvatarProps, styled } from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';
import { isAvatarMissing, setMissingAvatar } from './avatarMissEntries';

interface IUserAvatarProps extends AvatarProps {
  userId?: string;
  displayName?: string;
  children?: ReactNode;
}

const StyledAvatar = styled(Avatar)`
  height: 40px;
  width: 40px;
`;

const extractInitials = (displayName: string) => {
  const parts = displayName.split(' ');
  if (parts.length > 1) {
    return `${parts[0][0]}${parts[1][0]}`;
  }
  return parts[0][0];
};

export const UserAvatar = ({ userId, displayName, children, ...props }: IUserAvatarProps) => {
  const [profileSrc, setProfileSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (userId) {
      if (!isAvatarMissing(userId)) {
        setProfileSrc(`${process.env.REACT_APP_CDN_URL}/profile/${userId}/avatar.jpg`);
      }
    }
  }, [userId]);

  const onImageError = () => {
    if (userId) {
      setMissingAvatar(userId);
    }
  };

  return (
    <StyledAvatar alt={displayName} src={profileSrc} {...props} imgProps={{ onError: onImageError }}>
      {children ? children : extractInitials(displayName ?? '')}
    </StyledAvatar>
  );
};
