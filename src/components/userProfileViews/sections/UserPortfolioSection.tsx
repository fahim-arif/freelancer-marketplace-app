import { Box, Grid, styled, Typography, useTheme } from '@mui/material';
import React, { useEffect } from 'react';
import { Options, Splide, SplideSlide } from '@splidejs/react-splide';
import { profileContainer as ProfileContainer, VideoThumbnailExtension } from 'global/constants';
import { FileType } from 'global/enums/fileTypes';
import { getThumbnailId } from 'utils/file';
import '@splidejs/react-splide/css';
import { IFileMetadata } from 'global/interfaces/file';
import { PaintBucketIcon } from 'components/icon/PaintBucketIcon';

const ViewSlideContainer = styled('div')`
  height: 100%;
  background-color: black;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  img,
  video {
    object-fit: cover;
    max-height: 100%;
    max-width: 100%;
  }
`;

const MainSplide = styled(Splide)(({ theme }) => ({
  '.splide__arrows .splide__arrow': {
    backgroundColor: theme.palette.common.white,
    opacity: 1,
    boxShadow: '0px 1px 3px rgba(16, 24, 40, 0.1), 0px 1px 2px rgba(16, 24, 40, 0.06);',
    width: '32px',
    height: '32px',
  },
  '.splide__arrows .splide__arrow svg': {
    width: '16px',
    height: '16px',
  },
  '.splide__arrows .splide__arrow:hover': {
    opacity: 0.8,
  },
  '.splide__arrow--prev': {
    left: '-12px',
  },
  '.splide__arrow--next': {
    right: '-12px',
  },
}));

const ThumbSplide = styled(Splide)(({ theme }) => ({
  '.splide__track--nav>.splide__list>.splide__slide': {
    border: 'none',
    opacity: 0.6,
  },

  '.splide__track--nav>.splide__list>.splide__slide.is-active': {
    border: `2px solid ${theme.palette.grey[600]}`,
    opacity: 1.0,
  },
}));

const FlexBox = styled(Box)`
  display: flex;
  align-items: center;
`;

const PaddedBox = styled(FlexBox)(() => ({
  marginTop: '32px',
  paddingLeft: '24px',
  paddingRight: '24px',
}));

const StyledPaintBucketIcon = styled(PaintBucketIcon)(({ theme }) => ({
  width: '32px',
  height: '32px',
  fill: 'none',
  stroke: theme.palette.grey[600],
}));

const StyledGrid = styled(Grid)(() => ({
  marginTop: '16px',
  paddingLeft: '24px',
  paddingRight: '24px',
  marginBottom: '16px',
}));

interface IUserPortfolioSectionProps {
  imageVideoFiles: IFileMetadata[];
}

export default function UserPortfolioSection(props: IUserPortfolioSectionProps) {
  const theme = useTheme();
  const mainRef = React.createRef<Splide>();
  const thumbsRef = React.createRef<Splide>();

  const mainOptions: Options = {
    type: 'loop',
    perPage: 1,
    perMove: 1,
    gap: '1rem',
    pagination: false,
    heightRatio: 0.75,
    width: '100%',
    lazyLoad: 'nearby',
    arrowPath:
      'M 20 6.667969 L 17.648438 9.015625 L 26.949219 18.332031 L 6.667969 18.332031 L 6.667969 21.667969 L 26.949219 21.667969 L 17.648438 30.984375 L 20 33.332031 L 33.332031 20 Z M 20 6.667969 ',
  };

  const thumbsOptions: Options = {
    width: '100%',
    type: 'slide',
    rewind: true,
    gap: '1rem',
    pagination: false,
    fixedWidth: 160,
    fixedHeight: 120,
    arrows: false,
    isNavigation: true,
    cover: true,
    useScroll: true,
    breakpoints: {
      900: {
        fixedWidth: 80,
        fixedHeight: 60,
        // JE: This is annoying but needed to stop horizontal scrollbar
        width: 'calc(100vw - 48px)',
      },
    },
  };

  useEffect(() => {
    if (
      mainRef?.current !== undefined &&
      thumbsRef?.current !== undefined &&
      thumbsRef?.current?.splide !== undefined
    ) {
      if (mainRef?.current != null) {
        mainRef.current.sync(thumbsRef.current.splide);
      }
    }
  });

  const renderThumbnails = (): JSX.Element[] =>
    props.imageVideoFiles.map((slide, i) => {
      let imagePath = '';
      if (slide.type === FileType.Video) {
        imagePath = `${ProfileContainer}/${slide.directory}/${getThumbnailId(slide.id)}${VideoThumbnailExtension}`;
      } else {
        imagePath = `${ProfileContainer}/${slide.directory}/${getThumbnailId(slide.id)}${slide.extension}`;
      }
      const imageUrl = `${process.env.REACT_APP_CDN_URL ?? ''}/${imagePath}`;
      return (
        <SplideSlide key={i}>
          <img src={imageUrl} alt={slide.name} />
        </SplideSlide>
      );
    });

  const renderImages = (): JSX.Element[] =>
    props.imageVideoFiles.map((slide, i) => {
      const imageUrl = `${process.env.REACT_APP_CDN_URL ?? ''}/${ProfileContainer}/${slide.path}`;
      if (slide.type === FileType.Video) {
        return (
          <SplideSlide key={i}>
            <ViewSlideContainer>
              <video controls src={imageUrl} />
            </ViewSlideContainer>
          </SplideSlide>
        );
      } else {
        return (
          <SplideSlide key={i}>
            <ViewSlideContainer>
              <img data-splide-lazy={imageUrl} alt={slide.name} />
            </ViewSlideContainer>
          </SplideSlide>
        );
      }
    });

  return (
    <>
      <PaddedBox>
        <StyledPaintBucketIcon />
        <Typography marginLeft={2} variant="h5" color={theme.palette.grey[900]}>
          Portfolio
        </Typography>
      </PaddedBox>
      <StyledGrid container spacing={2}>
        <Grid item xs={12}>
          <MainSplide options={mainOptions} ref={mainRef} aria-labelledby="thumbnail-slider-example">
            {renderImages()}
          </MainSplide>
        </Grid>

        <Grid item xs={12}>
          <ThumbSplide
            options={thumbsOptions}
            ref={thumbsRef}
            aria-label="The carousel with thumbnails. Selecting a thumbnail will change the main carousel"
          >
            {renderThumbnails()}
          </ThumbSplide>
        </Grid>
      </StyledGrid>
    </>
  );
}
