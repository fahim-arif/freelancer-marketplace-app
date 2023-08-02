import * as React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import YoutubeIcon from '@mui/icons-material/YouTube';
import { TikTokIcon } from 'components/common/StyledIcons/TikTokIcon';
import { InstagramIcon } from 'components/common/StyledIcons/InstagramIcon';
import logo from './assets/images/logo/GreyLogo.svg';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Stack } from '@mui/material';

const Wrapper = styled('footer')`
  margin-top: auto;
  margin-bottom: 0;
  background-color: ${({ theme }) => theme.palette.grey[900]};
  color: ${({ theme }) => theme.palette.grey[200]};
  ${({ theme }) => theme.breakpoints.down('lg')} {
    padding-bottom: ${({ theme }) => theme.spacing(3)};
  }
`;

const FooterBottom = styled(Box)`
  padding-top: ${({ theme }) => theme.spacing(3)};
  padding-bottom: ${({ theme }) => theme.spacing(3)};
`;

const Title = styled(Typography)`
  margin-top: ${({ theme }) => theme.spacing(4)};
  margin-bottom: ${({ theme }) => theme.spacing(1.5)};
  color: ${({ theme }) => theme.palette.common.white};
`;

const BodyText = styled(Typography)`
  color: ${({ theme }) => theme.palette.grey[400]};
`;

const LinkList = styled(List)`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  padding: 0;
`;

const LinkListItem = styled(ListItem)`
  margin-bottom: ${({ theme }) => theme.spacing(0.5)};
  padding: 0;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  position: relative;
  &:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    height: 2px;
    width: 0;
    background: ${({ theme }) => theme.palette.grey[500]};
    transition: all 0.5s cubic-bezier(0.77, 0.2, 0.05, 1);
  }

  &:hover::after {
    width: 100%;
  }
`;

const LinkText = styled(Typography)`
  color: ${({ theme }) => theme.palette.grey[200]};
`;

const SubscribeButton = styled(Button)`
  height: 40px;
`;

const StyledIconButton = styled(IconButton)`
  & .MuiSvgIcon-root {
    fill: ${({ theme }) => theme.palette.grey[400]};
    opacity: 0.8;
    &:hover {
      opacity: 1;
    }
  }
`;

const StyledYouTubeIcon = styled(YoutubeIcon)`
  font-size: 22px;
`;

const StyledTikTokIcon = styled(TikTokIcon)`
  font-size: 18px;
`;

const StyledInstagramIcon = styled(InstagramIcon)`
  font-size: 18px;
`;

const FooterBottomGrid = styled(Grid)`
  margin-top: ${({ theme }) => theme.spacing(3)};
`;

const EmailTextField = styled(TextField)`
  margin-right: ${({ theme }) => theme.spacing(1.5)};
  & .MuiInputLabel-root {
    color: ${({ theme }) => theme.palette.common.white};
    &.Mui-focused {
      color: ${({ theme }) => theme.palette.common.white};
    }
  }
  & .MuiInputBase-root {
    background-color: transparent;
    & fieldset {
      border-color: ${({ theme }) => theme.palette.grey[600]};
    }
    &.Mui-focused fieldset {
      border-color: ${({ theme }) => theme.palette.grey[600]};
    }
  }
  & .MuiInputBase-input {
    color: ${({ theme }) => theme.palette.common.white};
    font-size: 16px;
    line-height: 24px;
    ::placeholder {
      color: ${({ theme }) => theme.palette.common.white};
      opacity: 1;
    }
  }
`;

const StyledInputAdornment = styled(InputAdornment)`
  color: ${({ theme }) => theme.palette.grey[400]};
`;

const Footer = () => {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');

  const handleHomeClick = (): void => {
    navigate('/');
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (/\S+@\S+\.\S+/.test(e.target.value)) {
      setEmail(e.target.value);
    } else {
      setEmail('');
    }
  };

  return (
    <Wrapper>
      <Container>
        <Box>
          <Grid container spacing={0}>
            <Grid item xs={12} sm={4} md={2}>
              <Title variant="h6">Company</Title>
              <LinkList>
                <LinkListItem>
                  <StyledLink href="#">
                    <LinkText variant="body2">About</LinkText>
                  </StyledLink>
                </LinkListItem>
                <LinkListItem>
                  <StyledLink href="#">
                    <LinkText variant="body2">Careers</LinkText>
                  </StyledLink>
                </LinkListItem>
                <LinkListItem>
                  <StyledLink href="#">
                    <LinkText variant="body2">Contact</LinkText>
                  </StyledLink>
                </LinkListItem>
                <LinkListItem>
                  <StyledLink href="#">
                    <LinkText variant="body2">Terms & conditions</LinkText>
                  </StyledLink>
                </LinkListItem>
              </LinkList>
            </Grid>
            <Grid item xs={12} sm={4} md={2}>
              <Title variant="h6">Marketers</Title>
              <LinkList>
                <LinkListItem>
                  <StyledLink href="#">
                    <LinkText variant="body2">Info</LinkText>
                  </StyledLink>
                </LinkListItem>
                <LinkListItem>
                  <StyledLink href="#">
                    <LinkText variant="body2">Register</LinkText>
                  </StyledLink>
                </LinkListItem>
                <LinkListItem>
                  <StyledLink href="#">
                    <LinkText variant="body2">FAQ</LinkText>
                  </StyledLink>
                </LinkListItem>
                <LinkListItem>
                  <StyledLink href="#">
                    <LinkText variant="body2">Contact</LinkText>
                  </StyledLink>
                </LinkListItem>
              </LinkList>
            </Grid>
            <Grid item xs={12} sm={4} md={2}>
              <Title variant="h6">Creators / Agents</Title>
              <LinkList>
                <LinkListItem>
                  <StyledLink href="#">
                    <LinkText variant="body2">Info</LinkText>
                  </StyledLink>
                </LinkListItem>
                <LinkListItem>
                  <StyledLink href="#">
                    <LinkText variant="body2">Apply</LinkText>
                  </StyledLink>
                </LinkListItem>
                <LinkListItem>
                  <StyledLink href="#">
                    <LinkText variant="body2">FAQ</LinkText>
                  </StyledLink>
                </LinkListItem>
                <LinkListItem>
                  <StyledLink href="#">
                    <LinkText variant="body2">Contact</LinkText>
                  </StyledLink>
                </LinkListItem>
              </LinkList>
            </Grid>
            <Grid item xs={12} md={4} sx={{ ml: 'auto' }}>
              <Title variant="h6">Stay tuned</Title>
              <BodyText variant="body2" sx={{ mb: 3 }}>
                Subscribe to our newsletter and never miss our designs, latest news, etc.
              </BodyText>
              <Box sx={{ display: 'flex' }}>
                <EmailTextField
                  variant="outlined"
                  placeholder="Enter email"
                  size="small"
                  type="email"
                  onChange={handleEmailChange}
                  label="Subscription"
                  InputProps={{
                    startAdornment: (
                      <StyledInputAdornment position="start">
                        <MailOutlineIcon />
                      </StyledInputAdornment>
                    ),
                  }}
                />
                <SubscribeButton
                  color="primary"
                  variant="contained"
                  size="large"
                  type="submit"
                  aria-label="subscribe"
                  onClick={() => {
                    console.log(email);
                  }}
                >
                  Subscribe
                </SubscribeButton>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <FooterBottom>
          <Grid container spacing={0}>
            <FooterBottomGrid item xs={12} sm={6} md={1} lg={1} container alignItems="center">
              <Box
                component="img"
                onClick={handleHomeClick}
                sx={{ height: 32, cursor: 'pointer' }}
                alt="Shoutt"
                src={logo}
              />
            </FooterBottomGrid>
            <FooterBottomGrid item xs={12} sm={6} md={5} lg={3} container alignItems="center">
              <BodyText variant="body1" marginLeft={{ xs: 0, md: 6, lg: 3 }}>
                © Shoutt International Ltd. {new Date().getFullYear()}
              </BodyText>
            </FooterBottomGrid>
            <FooterBottomGrid item xs={12} sm={12} md={3} lg={2} sx={{ ml: 'auto' }}>
              <Stack direction="row" justifyContent={{ xs: 'flex-start', sm: 'center', md: 'flex-end' }}>
                <Link href="#">
                  <StyledIconButton>
                    <StyledYouTubeIcon />
                  </StyledIconButton>
                </Link>
                <Link href="#">
                  <StyledIconButton>
                    <StyledTikTokIcon />
                  </StyledIconButton>
                </Link>
                <Link href="#">
                  <StyledIconButton>
                    <StyledInstagramIcon />
                  </StyledIconButton>
                </Link>
              </Stack>
            </FooterBottomGrid>
          </Grid>
        </FooterBottom>
      </Container>
    </Wrapper>
  );
};

export default Footer;
