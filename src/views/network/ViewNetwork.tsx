import { Grid, Typography, styled } from '@mui/material';
import { ViewNetworkTable } from 'components/network/viewNetwork';
import { ShouttTabs } from 'components/common/shouttTabs';
import { NetworkTabValue } from 'global/enums/networkEnums';
import IApiError from 'global/interfaces/api';
import { IConnection, IInvitation } from 'global/interfaces/connection';
import { useEffect, useState } from 'react';
import { getActiveConnections, getInvitations } from 'services/connectionService';
import { showUIError } from 'utils/errorHandler';
import { ViewInvites } from 'components/network/ViewInvites';
import { useCustomEventListener } from 'react-custom-events';
import { MessagePublisherEventType } from 'global/enums/messagePublisherEventType';
import { useNavigate, useParams } from 'react-router-dom';

const TitleGrid = styled(Grid)(() => ({
  marginTop: '36px',
  marginBottom: '8px',
}));

const ContainerTopMargin = styled(Grid)(() => ({
  marginTop: '36px',
  width: '100%',
}));

export const ViewNetwork: React.FC = () => {
  const [tabValue, setTabValue] = useState<NetworkTabValue>(NetworkTabValue.Active);
  const [connections, setConnections] = useState<IConnection[]>();
  const [invitations, setInvitations] = useState<IInvitation[]>();
  const [refresh, setRefresh] = useState<boolean>(false);
  const { status } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (status == NetworkTabValue[NetworkTabValue.Invitations]) {
      setTabValue(NetworkTabValue.Invitations);
    } else {
      setTabValue(NetworkTabValue.Active);
    }
  }, [status]);

  useEffect(() => {
    document.title = 'Shoutt - Network';
    getActiveConnections()
      .then(res => {
        setConnections(res);
        setRefresh(false);
      })
      .catch((err: IApiError) => {
        showUIError(err.message);
      });
    loadInvitations();
  }, [setConnections, setRefresh, refresh]);

  const loadInvitations = () => {
    getInvitations()
      .then(res => {
        if (res.length > 0) {
          setInvitations(res);
        } else {
          setInvitations([]);
        }
      })
      .catch((err: IApiError) => {
        showUIError(err.message);
      });
  };

  useCustomEventListener(
    MessagePublisherEventType[MessagePublisherEventType.ConnectionInvite],
    () => {
      loadInvitations();
    },
    [],
  );

  const handleTabValueChange = (newValue: NetworkTabValue) => {
    navigate(
      newValue == NetworkTabValue.Invitations ? `/Network/${NetworkTabValue[NetworkTabValue.Invitations]}` : '/Network',
      { replace: true },
    );
  };

  return (
    <Grid container margin="auto" maxWidth="lg">
      <Grid container item xs={12}>
        <TitleGrid item xs={12}>
          <Typography variant="h5">Your Network</Typography>
        </TitleGrid>
        <Grid item xs={12}>
          <ShouttTabs enumValues={NetworkTabValue} currentValue={tabValue} setValue={handleTabValueChange} />
        </Grid>
        <ContainerTopMargin>
          <Grid item xs={12} sx={{ mb: 6 }}>
            {tabValue === NetworkTabValue.Active && (
              <>
                {connections && connections.length > 0 ? (
                  <ViewNetworkTable connections={connections} setRefresh={setRefresh} />
                ) : (
                  <Typography variant="h5">No connections</Typography>
                )}
              </>
            )}
            {tabValue === NetworkTabValue.Invitations && <ViewInvites invites={invitations} setRefresh={setRefresh} />}
          </Grid>
        </ContainerTopMargin>
      </Grid>
    </Grid>
  );
};
