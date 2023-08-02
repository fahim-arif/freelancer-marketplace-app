import { Button, Container, Grid, Typography, styled, useMediaQuery, useTheme } from '@mui/material';
import { ShouttTabs } from 'components/common/shouttTabs';
import { ContractHistory } from 'components/viewContracts/contractHistory';
import { AuthContext } from 'contexts/AuthContext';
import { ViewContractTabValue } from 'global/enums/contractEnums';
import IApiError from 'global/interfaces/api';
import { IConnection } from 'global/interfaces/connection';
import { IContract, IContractFilters } from 'global/interfaces/contract';
import { useContext, useEffect, useState } from 'react';
import { getActiveConnections } from 'services/connectionService';
import { getContracts } from 'services/contractService';
import { showUIError } from 'utils/errorHandler';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useCustomEventListener } from 'react-custom-events';
import { MessagePublisherEventType } from 'global/enums/messagePublisherEventType';

const pageSize = 15;

const StyledMainContainer = styled(Container)(() => ({
  marginBottom: '20vh',
}));

const StyledHeadingGrid = styled(Grid)(() => ({
  marginTop: '32px',
}));

export const ViewContracts: React.FC = () => {
  const authContext = useContext(AuthContext);
  const [tabValue, setTabValue] = useState<ViewContractTabValue>(ViewContractTabValue.History);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [contracts, setContracts] = useState<IContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<IContractFilters | null>(null);
  const [connections, setConnections] = useState<IConnection[]>([]);
  const isMobileScreen = useMediaQuery(useTheme().breakpoints.down('sm'));
  const [mobileDrawer, setMobileDrawer] = useState(false);

  useEffect(() => {
    document.title = 'Shoutt - Contract history';
    loadData();
  }, [refresh, authContext]);

  const loadContracts = () => {
    setLoading(true);
    getContracts({ ...filters, pageSize })
      .then((res: IContract[]) => {
        if (filters?.pageNumber && filters?.pageNumber > 1) {
          setContracts(currentContracts => [...currentContracts, ...res]);
        } else {
          setContracts([...res]);
        }
        setLoading(false);
      })
      .catch((err: IApiError) => {
        showUIError(err.message);
      });
  };

  useEffect(() => {
    loadContracts();
  }, [filters]);

  const loadData = () => {
    getActiveConnections()
      .then(res => {
        setConnections(res);
        setRefresh(false);
      })
      .catch((err: IApiError) => {
        showUIError(err.message);
      });
  };

  useCustomEventListener(
    MessagePublisherEventType[MessagePublisherEventType.ContractChange],
    () => {
      loadContracts();
    },
    [authContext],
  );

  const handleFilterChange = (filters: IContractFilters) => {
    setFilters({ ...filters, pageNumber: 1 });
  };

  const handleNextPage = () => {
    const pageNumber = filters?.pageNumber ?? 1;
    if (contracts.length === pageSize * pageNumber) {
      setFilters(currentFilters => ({ ...currentFilters, pageNumber: pageNumber + 1 }));
    }
  };

  return (
    <StyledMainContainer>
      <Grid container spacing={3}>
        <StyledHeadingGrid item xs={12}>
          <Typography variant="h4">Contracts</Typography>
        </StyledHeadingGrid>
        <Grid item xs={12}>
          <ShouttTabs enumValues={ViewContractTabValue} currentValue={tabValue} setValue={setTabValue} />
        </Grid>
        <Grid item xs={12}>
          {isMobileScreen && tabValue === ViewContractTabValue.History && (
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              startIcon={<FilterListIcon />}
              onClick={() => setMobileDrawer(true)}
            >
              Filter
            </Button>
          )}
          {tabValue === ViewContractTabValue.History && (
            <ContractHistory
              contracts={contracts}
              onNextPage={handleNextPage}
              onFilterChange={handleFilterChange}
              loading={loading}
              connections={connections}
              mobileDrawer={mobileDrawer}
              setMobileDrawer={setMobileDrawer}
            />
          )}
        </Grid>
      </Grid>
    </StyledMainContainer>
  );
};
