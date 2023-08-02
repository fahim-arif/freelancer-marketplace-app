import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { Box, styled } from '@mui/material';

interface StyledBoxProps {
  showTopPadding: boolean;
  showGreyBackground: boolean;
}

//top paddings are calculated offset for app bar
const StyledBox = styled(Box, {
  // Configure which props should be forwarded on DOM
  shouldForwardProp: prop => prop !== 'showTopPadding' && prop !== 'showGreyBackground',
})<StyledBoxProps>(({ theme, showTopPadding, showGreyBackground }) => ({
  paddingTop: showTopPadding ? '72px' : '0',
  backgroundColor: showGreyBackground ? theme.palette.grey[50] : theme.palette.common.white,
}));

interface IMainBoxProps {
  children: React.ReactNode;
}

function MainBox(props: IMainBoxProps): JSX.Element {
  const location = useLocation();

  const [showGreyScale, setShowGreyScale] = React.useState<boolean>(true);
  const [showTopPadding, setShowTopPadding] = React.useState<boolean>(false);

  React.useEffect(() => {
    const isHomePage = location.pathname.toLowerCase() === '/';
    setShowGreyScale(isHomePage);
    setShowTopPadding(!isHomePage);
  }, [location]);

  return (
    <StyledBox showTopPadding={showTopPadding} showGreyBackground={showGreyScale}>
      {props.children}
    </StyledBox>
  );
}

export default MainBox;
