import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Button,
  Grid,
  IconButton,
  styled,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { PackageType } from 'global/enums/packageType';
import IApiError from 'global/interfaces/api';
import { IInvitationCreateRequest } from 'global/interfaces/connection';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { createInvitation } from 'services/connectionService';
import { showUIError } from 'utils/errorHandler';
import { UserPackagesSectionWrapper } from '../UserPackagesSection/UserPackagesSectionWrapper';
import { Close } from '@mui/icons-material';
import { IFrontUser } from 'global/interfaces/user';
import MessageIcon from '@mui/icons-material/Message';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import { ConnectionFirstContact } from 'global/enums/connectionFirstContact';

export const StyledBottomNavigation = styled(BottomNavigation)`
  position: relative;
  border: 0;
`;

export const StyledBottomNavigationAction = styled(BottomNavigationAction)`
  border-right: 1px solid ${({ theme }) => theme.palette.grey[300]};
`;

const TitleBox = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
  padding: 24px;
`;

export const JustifiedBox = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 8px;
  padding-bottom: 8px;
`;

interface IUserRequestConnectProps {
  user: IFrontUser;
  closeCancel: () => void;
  closeSuccess: () => void;
}

export const UserRequestConnect = ({ user, closeCancel, closeSuccess }: IUserRequestConnectProps) => {
  const [description, setDescription] = useState<string>('');
  const [error, setError] = useState<boolean>();
  const [packageType, setTabValue] = useState<PackageType>(PackageType.Loud);
  const theme = useTheme();
  const { id } = useParams();
  const [firstContact, setFirstContact] = useState<ConnectionFirstContact>(ConnectionFirstContact.Message);

  const handleRequest = async () => {
    if (description === '' || !id) {
      setError(true);
      return;
    }

    const createInvitationRequest: IInvitationCreateRequest = {
      userId: id,
      description,
      firstContact,
      package: firstContact === ConnectionFirstContact.Package ? packageType : undefined,
    };
    createInvitation(createInvitationRequest)
      .then(() => {
        closeSuccess();
        closeCancel();
      })
      .catch((err: IApiError) => {
        showUIError(err.message);
      });
  };

  return (
    <>
      <TitleBox>
        <Typography variant="h5">Connect</Typography>
        <IconButton aria-label="Close" onClick={closeCancel}>
          <Close />
        </IconButton>
      </TitleBox>
      <StyledBottomNavigation showLabels value={firstContact} onChange={(_, newValue) => setFirstContact(newValue)}>
        <StyledBottomNavigationAction value={ConnectionFirstContact.Message} label="Message" icon={<MessageIcon />} />
        <StyledBottomNavigationAction
          value={ConnectionFirstContact.Package}
          label="Package"
          icon={<Inventory2Icon />}
        />
        <BottomNavigationAction value={ConnectionFirstContact.Quote} label="Quote" icon={<RequestQuoteIcon />} />
      </StyledBottomNavigation>
      <>
        <Box paddingLeft={3} paddingRight={3} paddingTop={3} paddingBottom={2}>
          <Typography variant="subtitle1" color={theme.palette.grey[900]} fontWeight={600}>
            {firstContact === ConnectionFirstContact.Message &&
              `Introduce yourself to ${user.firstName} ${user.lastName}`}
            {firstContact === ConnectionFirstContact.Package &&
              `Enquire ${user.firstName} ${user.lastName} about a package`}
            {firstContact === ConnectionFirstContact.Quote && `Enquire ${user.firstName} ${user.lastName} a quote`}
          </Typography>
        </Box>
        {firstContact === ConnectionFirstContact.Package && (
          <Box paddingLeft={3} paddingRight={3}>
            <UserPackagesSectionWrapper
              user={user}
              tabValue={packageType}
              setTabValue={setTabValue}
              hideTitle={true}
              showBorder={true}
            />
          </Box>
        )}
        <Grid container rowSpacing={2} paddingLeft={3} paddingRight={3}>
          {firstContact === ConnectionFirstContact.Quote && (
            <Grid item xs={12}>
              <JustifiedBox>
                <Typography variant="subtitle1" color={theme.palette.grey[900]}>
                  Hourly Rate
                </Typography>
                <Typography variant="subtitle2" color={theme.palette.grey[900]}>
                  ${user.hourlyRate} / hr
                </Typography>
              </JustifiedBox>
            </Grid>
          )}
          <Grid item xs={12}>
            <TextField
              label="Message"
              multiline
              rows={5}
              fullWidth
              onChange={e => setDescription(e.target.value)}
              error={error}
              helperText={error && 'Enter a brief message'}
            />
          </Grid>

          <Grid item container xs={12} marginBottom={4} spacing={2}>
            <Grid item xs={6}>
              <Button variant="outlined" type="button" fullWidth onClick={closeCancel}>
                Cancel
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button variant="contained" type="button" fullWidth onClick={() => handleRequest()}>
                Send request
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </>
    </>
  );
};
