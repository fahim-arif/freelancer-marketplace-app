import { Button, Grid, Skeleton, styled, Typography, useMediaQuery, useTheme } from '@mui/material';
import IApiError from 'global/interfaces/api';
import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getConnectionToUser } from 'services/connectionService';
import { showUIError } from 'utils/errorHandler';
import PeopleIcon from '@mui/icons-material/People';
import { BorderedBox } from '../../common/BorderedBox';
import MessageIcon from '@mui/icons-material/Message';
import { ConnectionStatus } from 'global/enums/connectionStatus';
import { AuthContext, AuthType } from 'contexts/AuthContext';

export const StyledSkeleton = styled(Skeleton)`
  width: 100%;
  height: 20px;
`;

enum ConnectionStep {
  NotSent = 0,
  Sent = 1,
  Active = 2,
  NotShown = 3,
}

interface IUserConnectionSectionProps {
  openConnectDrawer: () => void;
  requestSent: boolean;
}

export const UserConnectionSection = ({ openConnectDrawer, requestSent }: IUserConnectionSectionProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>();
  const [connectionStep, setConnectionStep] = useState<ConnectionStep>(ConnectionStep.NotShown);
  const [chatThreadId, setChatThreadId] = useState<string>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { id } = useParams();
  const authContext = useContext(AuthContext) as AuthType;

  useEffect(() => {
    if (requestSent) {
      setConnectionStep(ConnectionStep.Sent);
    }
  }, [requestSent]);

  useEffect(() => {
    if (authContext?.user && id !== undefined && id !== authContext?.user?.id) {
      setLoading(true);
      getConnectionToUser(id)
        .then(connection => {
          if (!connection) {
            setConnectionStep(ConnectionStep.NotSent);
          } else if (connection.status === ConnectionStatus.Active) {
            setConnectionStep(ConnectionStep.Active);
            setChatThreadId(connection.chatThreadId);
          } else if (connection.status === ConnectionStatus.Invitation) {
            setConnectionStep(ConnectionStep.Sent);
          } else {
            setConnectionStep(ConnectionStep.NotShown);
          }
          setLoading(false);
        })
        .catch((err: IApiError) => {
          setLoading(false);
          showUIError(err.message);
        });
    }
  }, [id, authContext?.user?.id]);

  if (loading) {
    return (
      <Grid>
        {[...Array(2)].map((e, index) => (
          <Grid marginTop={2} key={index}>
            <StyledSkeleton variant="rounded" />
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <>
      {connectionStep === ConnectionStep.NotSent && (
        <Grid container>
          <Button endIcon={<PeopleIcon />} variant="contained" size="large" fullWidth onClick={openConnectDrawer}>
            Connect
          </Button>
        </Grid>
      )}
      {connectionStep === ConnectionStep.Sent && (
        <BorderedBox showBorder={!isMobile} padding={3} textAlign="center" marginBottom={3}>
          <Button color="success" variant="outlined" disabled startIcon={<PeopleIcon />}>
            Connection request is sent.
          </Button>
          <Typography variant="h6" marginTop={2}>
            Waiting for a reply...
          </Typography>
        </BorderedBox>
      )}
      {connectionStep === ConnectionStep.Active && (
        <Grid container>
          <Button
            endIcon={<MessageIcon />}
            variant="contained"
            size="large"
            fullWidth
            onClick={() => navigate(`/WorkRoom/${chatThreadId}`)}
          >
            Send direct message
          </Button>
        </Grid>
      )}
    </>
  );
};
