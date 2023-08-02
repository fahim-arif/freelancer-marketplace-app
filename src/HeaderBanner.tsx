import Container from '@mui/material/Container';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Box, Typography } from '@mui/material';
import contentCreationIllustration from 'assets/images/content creator flat illustration-01 1.svg';

const BannerBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary['900'],
  width: '100%',
  marginTop: theme.spacing(9),
}));

const ContentCreationIllustrationBox = styled(Box)(() => ({
  position: 'absolute',
  backgroundImage: `url("${contentCreationIllustration}")`,
  width: '903px',
  height: '602px',
  right: '-110px',
  top: '38px',
}));

const BannerTextGroupBox = styled(Box)(({ theme }) => ({
  left: theme.spacing(0),
  position: 'relative',
  zIndex: 1,
}));

const LargeBannerTextGroupBox = styled(BannerTextGroupBox)(({ theme }) => ({
  width: theme.spacing(113),
  height: theme.spacing(36),
  top: theme.spacing(15),
}));

const BannerTextContainerBox = styled(Box)(({ theme }) => ({
  height: theme.spacing(16.5),
  borderRadius: theme.spacing(1.25),
  display: 'flex',
  alignItems: 'center',
  textAlign: 'center',
}));

const WhiteBannerTextContainerBox = styled(BannerTextContainerBox)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
}));

const BlueBannerTextContainerBox = styled(BannerTextContainerBox)(({ theme }) => ({
  backgroundColor: theme.palette.primary[600],
  transform: 'rotate(2.4deg)',
}));

const BannerTextTypography = styled(Typography)(() => ({
  fontWeight: 700,
  fontStyle: 'normal',
  letterSpacing: '-1.32846px',
  width: '100%',
}));

const LargeBannerTextTypography = styled(BannerTextTypography)(({ theme }) => ({
  fontSize: '72px',
  lineHeight: theme.spacing(11.5),
  height: theme.spacing(11.5),
}));

const SmallBannerTextTypography = styled(BannerTextTypography)(({ theme }) => ({
  fontSize: '28px',
  lineHeight: theme.spacing(7),
  height: theme.spacing(7),
}));

const BannerContainer = styled(Container)(() => ({
  position: 'relative',
  overflow: 'hidden',
}));

const HeaderBanner = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const showHeaderGraphic = location.pathname.toLowerCase() === '/';

  const largeContainerHeight = theme.spacing(80);
  const smallContainerHeight = theme.spacing(33);

  return (
    <>
      {!isMobile && showHeaderGraphic && (
        <BannerBox
          sx={{
            height: largeContainerHeight,
          }}
        >
          <BannerContainer sx={{ height: largeContainerHeight }}>
            <LargeBannerTextGroupBox>
              <WhiteBannerTextContainerBox
                sx={{
                  width: theme.spacing(85),
                  marginLeft: theme.spacing(1),
                }}
              >
                <LargeBannerTextTypography sx={{ color: theme.palette.primary['900'] }}>
                  Vetted Freelancers
                </LargeBannerTextTypography>
              </WhiteBannerTextContainerBox>
              <BlueBannerTextContainerBox
                sx={{
                  width: theme.spacing(112),
                  marginTop: theme.spacing(1),
                }}
              >
                <LargeBannerTextTypography sx={{ color: theme.palette.common.white }}>
                  for all your content needs
                </LargeBannerTextTypography>
              </BlueBannerTextContainerBox>
            </LargeBannerTextGroupBox>
            <ContentCreationIllustrationBox />
          </BannerContainer>
        </BannerBox>
      )}
      {isMobile && showHeaderGraphic && (
        <BannerBox
          sx={{
            height: smallContainerHeight,
          }}
        >
          <BannerContainer sx={{ height: smallContainerHeight }}>
            <BannerTextGroupBox sx={{ width: theme.spacing(42), height: theme.spacing(15), top: theme.spacing(8) }}>
              <WhiteBannerTextContainerBox
                sx={{
                  height: theme.spacing(7),
                  width: theme.spacing(32),
                  borderRadius: theme.spacing(1),
                }}
              >
                <SmallBannerTextTypography sx={{ color: theme.palette.primary['900'] }}>
                  Vetted Freelancers
                </SmallBannerTextTypography>
              </WhiteBannerTextContainerBox>
              <BlueBannerTextContainerBox
                sx={{
                  width: theme.spacing(42),
                  height: theme.spacing(7),
                  borderRadius: theme.spacing(1),
                }}
              >
                <SmallBannerTextTypography sx={{ color: theme.palette.common.white }}>
                  for all your content needs
                </SmallBannerTextTypography>
              </BlueBannerTextContainerBox>
            </BannerTextGroupBox>
          </BannerContainer>
        </BannerBox>
      )}
    </>
  );
};

export default HeaderBanner;
