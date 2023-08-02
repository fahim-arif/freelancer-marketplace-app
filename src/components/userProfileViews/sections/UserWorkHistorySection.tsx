import { Box, Stack, Typography, styled, useTheme } from '@mui/material';
import { BriefcaseIcon } from 'components/icon/BriefcaseIcon';
import { IWorkHistory } from 'global/interfaces/user';
import { getHistoryDateString } from 'utils/workHistoryHelper';
import { Options, Splide, SplideSlide } from '@splidejs/react-splide';
import React from 'react';

const FlexBox = styled(Box)`
  display: flex;
  align-items: center;
`;

const PaddedBox = styled(FlexBox)(() => ({
  marginTop: '32px',
  paddingLeft: '24px',
  paddingRight: '24px',
}));

const StyledBriefcaseIcon = styled(BriefcaseIcon)(({ theme }) => ({
  width: '32px',
  height: '32px',
  fill: 'none',
  stroke: theme.palette.grey[600],
}));

const StyledWorkHistoryBox = styled(Box)(({ theme }) => ({
  cursor: 'pointer',
  display: 'flex',
  padding: '16px 24px',
  justifyContent: 'center',
  alignItems: 'center',
  borderColor: theme.palette.grey[200],
  borderWidth: '1px',
  borderStyle: 'solid',
  borderRadius: '8px',
}));

const options: Options = {
  width: '100%',
  type: 'slide',
  gap: '16px',
  pagination: false,
  fixedHeight: 122,
  autoWidth: true,
  arrows: true,
  useScroll: true,
  rewind: true,
  arrowPath:
    'M 20 6.667969 L 17.648438 9.015625 L 26.949219 18.332031 L 6.667969 18.332031 L 6.667969 21.667969 L 26.949219 21.667969 L 17.648438 30.984375 L 20 33.332031 L 33.332031 20 Z M 20 6.667969 ',
  breakpoints: {
    900: {
      // JE: This is annoying but needed to stop horizontal scrollbar
      width: 'calc(100vw - 24px)',
    },
  },
};

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
    left: '12px',
  },
  '.splide__arrow--next': {
    right: '12px',
  },
}));

interface IUserWorkHistorySectionProps {
  workHistories: IWorkHistory[];
}

export default function UserWorkHistorySection(props: IUserWorkHistorySectionProps) {
  const theme = useTheme();
  const mainRef = React.createRef<Splide>();
  return (
    <>
      <PaddedBox>
        <StyledBriefcaseIcon />
        <Typography marginLeft={2} variant="h5" color={theme.palette.grey[900]}>
          Work History
        </Typography>
      </PaddedBox>
      <MainSplide options={options} ref={mainRef} sx={{ p: 3 }}>
        {props.workHistories.map((p: IWorkHistory, index: number) => [
          <SplideSlide key={index}>
            <StyledWorkHistoryBox>
              <Stack direction="column" spacing={1} alignItems="left">
                <Typography variant="subtitle1" color={theme.palette.grey[900]}>
                  {p.title}
                </Typography>
                <Typography variant="body2" color={theme.palette.grey[600]}>
                  {getHistoryDateString(p)}
                </Typography>
                <Typography variant="body2" color={theme.palette.grey[600]}>
                  {p.company}
                </Typography>
              </Stack>
            </StyledWorkHistoryBox>
          </SplideSlide>,
        ])}
      </MainSplide>
    </>
  );
}
