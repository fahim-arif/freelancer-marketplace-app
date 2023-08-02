import { Grid, Typography, styled, useTheme } from '@mui/material';
import { IFrontUserBase } from 'global/interfaces/user';
import React from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import VerticalUserCard from './VerticalUserCard';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

interface IUserSectionProps {
  users: IFrontUserBase[];
  title: string;
  onListViewUsers: (id: string) => void;
  onClickUserCard: (id: string) => void;
}

interface MobileProps {
  isMobile: boolean;
}

const StyledGrid = styled(Grid, {
  // Configure which props should be forwarded on DOM
  shouldForwardProp: prop => prop !== 'isMobile',
})<MobileProps>(({ isMobile }) => ({
  paddingLeft: isMobile ? '0px' : '12px',
  paddingRight: '0px',
  marginBottom: '24px',
}));

const StyledCarousel = styled(Carousel, {
  // Configure which props should be forwarded on DOM
  shouldForwardProp: prop => prop !== 'isMobile',
})<MobileProps>(({ theme, isMobile }) => ({
  marginBottom: isMobile ? '64px' : '96px',
  '.react-multiple-carousel__arrow--right': {
    right: '0px',
  },
  '.react-multiple-carousel__arrow--left': {
    left: '0px',
  },
  '.react-multiple-carousel__arrow': {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.grey[900],
    opacity: 1,
    boxShadow: '0px 1px 3px rgba(16, 24, 40, 0.1), 0px 1px 2px rgba(16, 24, 40, 0.06);',
    minWidth: '36px',
    minHeight: '36px',
    top: '50%',
    //JE: Needed to fix an issue on iPhone/iPad. The user agent was adding padding-left and right to buttons of 11px
    padding: '0px',
  },
  '.react-multiple-carousel__arrow:hover': {
    opacity: 0.6,
  },
  '.react-multiple-carousel__arrow::before': {
    content:
      //Took SVG from ArrowBackIcon in the Icons folder and url encoded it
      'url(data:image/svg+xml,%20%20%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%20%20%20%20%3Cpath%20d%3D%22M20%2011H7.83L13.42%205.41L12%204L4%2012L12%2020L13.41%2018.59L7.83%2013H20V11Z%22%20fill%3D%22%234B5563%22%20%2F%3E%0A%20%20%3C%2Fsvg%3E)',
  },
  '.react-multiple-carousel__arrow--left::before': {
    paddingTop: '5px',
  },
  '.react-multiple-carousel__arrow--right::before': {
    paddingTop: '2px',
    transform: 'rotate(-180deg)',
  },
}));

export default function UserSection(props: IUserSectionProps) {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const responsiveProps = {
    desktop: {
      breakpoint: { max: 3000, min: 1200 },
      items: 4,
      slidesToSlide: 4,
    },
    tablet: {
      breakpoint: { max: 1200, min: theme.breakpoints.values.md },
      items: 3,
      slidesToSlide: 3,
    },
    tablet2: {
      breakpoint: { max: theme.breakpoints.values.md, min: theme.breakpoints.values.sm },
      items: 2,
      slidesToSlide: 2,
    },
    mobile: {
      breakpoint: { max: theme.breakpoints.values.sm, min: 0 },
      items: 1,
      slidesToSlide: 1,
    },
  };

  return (
    <React.Fragment>
      <StyledGrid container alignItems="center" justifyContent="space-between" isMobile={isMobile}>
        <Grid item xs={12}>
          <Typography
            variant={isTablet ? (isMobile ? 'h5' : 'h4') : 'h3'}
            component="div"
            sx={{ color: theme.palette.grey[800] }}
          >
            {props.title}
          </Typography>
        </Grid>
      </StyledGrid>
      <StyledCarousel responsive={responsiveProps} partialVisible={false} isMobile={isMobile}>
        {props.users.map((user, i) => (
          <VerticalUserCard
            onListViewUsers={props.onListViewUsers}
            onClickUserCard={props.onClickUserCard}
            key={i}
            users={user}
          />
        ))}
      </StyledCarousel>
    </React.Fragment>
  );
}
