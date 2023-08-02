import { IScreeningLinks } from 'global/interfaces/user';
import { GitHub, InsertLink, Instagram, LinkedIn, MoreHoriz, SportsBasketball, Twitter } from '@mui/icons-material';
import { BehanceIcon } from 'components/common/StyledIcons/BehanceIcon';
import { StackOverflowIcon } from 'components/common/StyledIcons/StackOverflowIcon';
import { TikTokIcon } from 'components/common/StyledIcons/TikTokIcon';
import { createElement } from 'react';
import { Box, IconButton, SvgIconProps } from '@mui/material';

interface IUserScreeningLinksProps {
  links: IScreeningLinks;
}

const iconsByType: Record<string, React.FC<SvgIconProps>> = {
  behance: BehanceIcon,
  personalSite: InsertLink,
  github: GitHub,
  linkedIn: LinkedIn,
  instagram: Instagram,
  stackOverflow: StackOverflowIcon,
  twitter: Twitter,
  dribbble: SportsBasketball,
  tikTok: TikTokIcon,
  other: MoreHoriz,
};

export const UserScreeningLinks = ({ links }: IUserScreeningLinksProps): JSX.Element => {
  const filledLinks = Object.entries(links).filter(([_, link]) => link !== null && link !== '');
  return (
    <Box sx={{ padding: 1 }}>
      {filledLinks.length > 0
        ? filledLinks.map(([type, link]) => (
            <IconButton key={type} href={link}>
              {createElement(iconsByType[type], { sx: { fontSize: 40 }, color: 'secondary' })}
            </IconButton>
          ))
        : 'No links'}
    </Box>
  );
};
