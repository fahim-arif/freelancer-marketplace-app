import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext, AuthType } from 'contexts/AuthContext';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import * as React from 'react';
import { useCustomEventListener } from 'react-custom-events';
import { MessagePublisherEventType } from 'global/enums/messagePublisherEventType';
import DeleteProfileDialog from 'components/common/DeleteProfileDialog/DeleteProfile';
import Container from '@mui/material/Container';
import logo from './assets/images/logo/Logo.svg';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import SearchIcon from '@mui/icons-material/Search';
import Badge from '@mui/material/Badge';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { getNumberUnread } from 'services/chatMessageService';
import IApiError from 'global/interfaces/api';
import { showUIError } from 'utils/errorHandler';
import { UserRole } from 'global/enums/userRole';
import UserSearch from 'components/common/UserSearch';
import { Stack } from '@mui/material';
import HeaderBanner from 'HeaderBanner';
import { IChatUnread } from 'global/interfaces/chatMessage';
import { getNumberConnections, getReceivedInvitationCount } from 'services/connectionService';
import { IInvitationCount } from 'global/interfaces/connection';
import { logout } from 'services/authService';
import { UserAvatar } from 'components/common/UserAvatar';

const StyledAppBar = styled(AppBar)`
  padding: 0;
`;

const Logo = styled('img')`
  display: box;
  height: ${({ theme }) => theme.spacing(4.5)};
  margin-right: ${({ theme }) => theme.spacing(2)};
`;

const StyledIconButton = styled(IconButton)`
  color: ${({ theme }) => theme.palette.grey[600]};
  margin-right: ${({ theme }) => theme.spacing(2)};
  & .MuiSvgIcon-root {
    font-size: ${({ theme }) => theme.spacing(3)};
  }
`;

const StyledBadge = styled(Badge)`
  & .MuiBadge-badge {
    font-weight: 500;
  }
`;

const Header = () => {
  const authContext = React.useContext(AuthContext) as AuthType;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isDeleteProfileVisible, setIsDeleteProfileVisible] = React.useState<boolean>(false);
  const [numberOfUnreadMessages, setNumberOfUnreadMessages] = React.useState<number>(0);
  const [numberOfConnections, setNumberOfConnections] = React.useState<number>(0);
  const [numberOfInvitations, setNumberOfInvitations] = React.useState<number>(0);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleButtonClick = (route: string) => () => {
    navigate(route);
  };

  const handleLogoutClick = (): void => {
    logout();
    authContext.refresh();
    setAnchorEl(null);
    navigate('/');
  };

  const handleNavigationClick =
    (route: string) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (e: any): void => {
      e.stopPropagation();
      navigate(route);
      setAnchorEl(null);
    };

  const handleMenu = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const handleShowDeleteProfile = (): void => {
    setAnchorEl(null);
    setIsDeleteProfileVisible(true);
  };

  const handleCloseDeleteProfile = (): void => {
    setIsDeleteProfileVisible(false);
  };

  const loadNumberUnread = (): void => {
    if (authContext.loggedIn) {
      getNumberUnread()
        .then((res: IChatUnread) => {
          setNumberOfUnreadMessages(res.numberUnread);
        })
        .catch((err: IApiError) => {
          showUIError(err.message);
        });
    }
  };

  const loadPendingInvitations = (): void => {
    if (authContext.loggedIn) {
      getReceivedInvitationCount()
        .then((res: IInvitationCount) => {
          setNumberOfInvitations(res.count);
        })
        .catch((err: IApiError) => {
          showUIError(err.message);
        });
    }
  };

  const loadNumberConnections = (): void => {
    if (authContext.loggedIn) {
      getNumberConnections()
        .then((res: number) => {
          setNumberOfConnections(res);
        })
        .catch((err: IApiError) => {
          showUIError(err.message);
        });
    }
  };

  useCustomEventListener(
    MessagePublisherEventType[MessagePublisherEventType.NewMessage],
    () => {
      loadNumberUnread();
      if (numberOfConnections < 1) {
        loadNumberConnections();
      }
    },
    [authContext],
  );

  useCustomEventListener(
    MessagePublisherEventType[MessagePublisherEventType.ReadMessages],
    () => {
      loadNumberUnread();
    },
    [authContext],
  );

  useCustomEventListener(
    MessagePublisherEventType[MessagePublisherEventType.UpdateThread],
    () => {
      loadNumberUnread();
    },
    [authContext],
  );

  useCustomEventListener(
    MessagePublisherEventType[MessagePublisherEventType.ConnectionInvite],
    () => {
      loadPendingInvitations();
    },
    [authContext],
  );

  React.useEffect(() => {
    loadNumberUnread();
    loadNumberConnections();
    loadPendingInvitations();
  }, [authContext]);

  const hasAdminRole = authContext.user && authContext.user.roles.indexOf(UserRole.Administrator) > -1;

  return (
    <>
      <StyledAppBar position="fixed">
        <Container>
          <Toolbar disableGutters variant="dense">
            <Stack alignItems="center" direction="row">
              <Stack component={Link} to="/">
                <Logo alt="Shoutt" src={logo} />
              </Stack>
              {!isMobile && (
                <Stack direction="row">
                  <UserSearch />
                </Stack>
              )}
            </Stack>

            {!authContext.loading && (
              <Stack direction="row">
                {authContext.loggedIn && (
                  <>
                    <StyledIconButton
                      color="secondary"
                      onClick={
                        numberOfInvitations > 0
                          ? handleButtonClick('/Network/Invitations')
                          : handleButtonClick('/Network')
                      }
                    >
                      <StyledBadge color="primary" badgeContent={numberOfInvitations}>
                        <PeopleOutlineIcon />
                      </StyledBadge>
                    </StyledIconButton>
                    {numberOfConnections > 0 && (
                      <StyledIconButton color="secondary" onClick={handleButtonClick('/WorkRoom')}>
                        <StyledBadge color="primary" badgeContent={numberOfUnreadMessages}>
                          <MailOutlineIcon />
                        </StyledBadge>
                      </StyledIconButton>
                    )}
                  </>
                )}
                {isMobile && (
                  <StyledIconButton color="secondary" onClick={handleButtonClick('/users')}>
                    <SearchIcon />
                  </StyledIconButton>
                )}
                {authContext.loggedIn && (
                  <>
                    <IconButton
                      aria-label="account of current user"
                      aria-controls="menu-appbar"
                      aria-haspopup="true"
                      onClick={handleMenu}
                      sx={{ padding: 0 }}
                    >
                      <Badge
                        color="success"
                        overlap="circular"
                        variant="dot"
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'right',
                        }}
                      >
                        <UserAvatar
                          userId={authContext.user?.id}
                          displayName={`${authContext?.user?.firstName} ${authContext?.user?.lastName}`}
                          sx={{
                            height: 40,
                            width: 40,
                          }}
                        />
                      </Badge>
                    </IconButton>
                    <Menu
                      id="menu-appbar"
                      anchorEl={anchorEl}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                    >
                      <MenuItem onClick={handleNavigationClick(`/users/${authContext.user?.id}`)}>My Profile</MenuItem>
                      <MenuItem onClick={handleNavigationClick('/PayoutDetails')}>Payout Details</MenuItem>
                      <MenuItem onClick={handleNavigationClick('/ContractHistory')}>Contract History</MenuItem>
                      <MenuItem onClick={handleNavigationClick('/ChangePassword')}>Change Password</MenuItem>
                      <MenuItem color="error" onClick={handleShowDeleteProfile}>
                        Delete Profile
                      </MenuItem>
                      {hasAdminRole && <MenuItem onClick={handleNavigationClick('/admin/users')}>Vetting</MenuItem>}
                      {hasAdminRole && <MenuItem onClick={handleNavigationClick('/admin/skills')}>Skills</MenuItem>}
                      {hasAdminRole && <MenuItem onClick={handleNavigationClick('/dispute')}>Disputes</MenuItem>}
                      <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
                    </Menu>
                  </>
                )}
                {!authContext.loggedIn && (
                  <Stack alignItems="center" direction="row" spacing={2}>
                    <Button color="inherit" size="medium" variant="text" onClick={handleButtonClick('/Login')}>
                      Login
                    </Button>
                    <Button color="primary" size="medium" variant="contained" onClick={handleButtonClick('/SignUp')}>
                      {isMobile ? 'Join' : 'Join Shoutt'}
                    </Button>
                  </Stack>
                )}
              </Stack>
            )}
          </Toolbar>
        </Container>
      </StyledAppBar>
      <HeaderBanner />
      <DeleteProfileDialog
        open={isDeleteProfileVisible}
        onClose={handleCloseDeleteProfile}
        onLogout={handleLogoutClick}
      />
    </>
  );
};

export default Header;
