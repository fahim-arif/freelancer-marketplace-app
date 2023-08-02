import {
  styled,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Table,
  Typography,
  Button,
  Grid,
  Skeleton,
  useMediaQuery,
  useTheme,
  Chip,
  CircularProgress,
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageIcon } from 'components/icon/MessageIcon';
import { ContractStatus, IContract, IContractFilters, StatusColourDictionary } from 'global/interfaces/contract';
import { ContractFilters } from './contractFilters';
import { IConnection } from 'global/interfaces/connection';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { getContractStatusText } from 'utils/contractTextHelper';
import IconButton from '@mui/material/IconButton';
import { dateStringFromDate } from 'utils/dateFormat';
import { StyledDesktopAvatar, StyledMobileAvatar } from 'components/common/StyledTable/StyledTableAvatar';
import { SwipeableContractDrawer } from 'components/common/Contract/SwipeableContractDrawer';

const StyledSkeleton = styled(Skeleton)(() => ({
  height: 60,
  marginLeft: 25,
}));

const StyledSearchFilters = styled(Grid)(() => ({
  marginBottom: '36px',
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  paddingLeft: theme.spacing(1),
}));

const StyledStatusGrid = styled(Grid)(() => ({
  marginBottom: '20px',
}));

const StyledStatusIdicator = styled(Chip)(() => ({
  height: '19px',
  padding: '0px, 7px, 0px, 7px',
  borderRadius: '64px',
}));

const StyledContentTitleGrid = styled(Grid)(() => ({
  marginBottom: '16px',
}));

interface IContractHistoryProps {
  contracts: IContract[] | undefined;
  onFilterChange: (filters: IContractFilters) => void;
  onNextPage: () => void;
  loading: boolean;
  connections: IConnection[];
  mobileDrawer: boolean;
  setMobileDrawer: React.Dispatch<boolean>;
}

export const ContractHistory: React.FC<IContractHistoryProps> = props => {
  const [drawer, setDrawer] = useState<boolean>(false);
  const [selectedContract, setSelectedContract] = useState<IContract | undefined>(undefined);
  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>
      <StyledSearchFilters item xs={12}>
        <ContractFilters {...props} onFilterChange={props.onFilterChange} connections={props.connections} />
      </StyledSearchFilters>
      {isMobileScreen ? (
        <>
          <MobileContractHistoryView
            {...props}
            setSelectedContract={setSelectedContract}
            drawer={drawer}
            setDrawer={setDrawer}
          />
        </>
      ) : (
        <DesktopView {...props} setSelectedContract={setSelectedContract} drawer={drawer} setDrawer={setDrawer} />
      )}
      {selectedContract && (
        <SwipeableContractDrawer
          contract={selectedContract}
          drawer={drawer}
          setDrawer={setDrawer}
          showMessageButton={true}
        />
      )}
    </>
  );
};

const DesktopView: React.FC<
  IContractHistoryProps & {
    drawer: boolean;
    setDrawer: React.Dispatch<boolean>;
    setSelectedContract: React.Dispatch<IContract>;
  }
> = ({ contracts, loading, setDrawer, setSelectedContract }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isTabletLandscape = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const HeaderData = [
    { id: 'contract-name', label: 'Contract name', minWidth: 180 },
    { id: 'status', label: 'Status', minWidth: 180 },
    { id: 'profilePicture', label: '', minWidth: 40 },
    { id: 'otherParty', label: 'Other party', minWidth: isTabletLandscape ? 100 : 180 },
    { id: 'createdDate', label: 'Created date', minWidth: isTabletLandscape ? 100 : 180 },
    { id: 'amountSpent', label: 'Amount', minWidth: isTabletLandscape ? 100 : 180 },
    { id: 'options', label: 'Options', minWidth: 100 },
    { id: 'option2', label: '', minWidth: 100 },
  ];

  const navigateToThread = (chatThreadId: string, recipientUserId: string) => {
    navigate(`/WorkRoom/${chatThreadId}/${recipientUserId}`);
  };

  const viewSelectedContract = (contract: IContract) => {
    setSelectedContract(contract);
    setDrawer(true);
  };

  return (
    <>
      {!loading ? (
        <>
          {contracts && contracts.length > 0 ? (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      {HeaderData.map(headerCell => (
                        <TableCell
                          key={headerCell.id}
                          style={{
                            minWidth: headerCell.minWidth,
                          }}
                        >
                          {headerCell.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {contracts.map((contract: IContract, i) => {
                      const isBuyer = Boolean(contract.buyerAdditionalDetails);
                      const recipientUserId = isBuyer
                        ? contract.buyerAdditionalDetails!.sellerId
                        : contract.sellerAdditionalDetails!.buyerId;
                      return (
                        <TableRow key={i}>
                          <TableCell>
                            <Typography variant="subtitle1" color={theme.palette.grey[900]}>
                              {contract.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <StyledStatusIdicator
                              label={getContractStatusText(contract)}
                              color={StatusColourDictionary[contract.status]}
                              sx={contract.status === ContractStatus.Complete ? { color: '#ffff' } : undefined}
                            />
                          </TableCell>
                          <TableCell>
                            {isBuyer ? (
                              <StyledDesktopAvatar
                                userId={contract.buyerAdditionalDetails?.sellerId}
                                displayName={contract.buyerAdditionalDetails?.sellerDisplayName}
                              />
                            ) : (
                              <StyledDesktopAvatar
                                userId={contract.sellerAdditionalDetails?.buyerId}
                                displayName={contract.sellerAdditionalDetails?.buyerDisplayName}
                              />
                            )}
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color={theme.palette.grey[700]}>
                              {isBuyer
                                ? contract.buyerAdditionalDetails?.sellerDisplayName
                                : contract.sellerAdditionalDetails?.buyerDisplayName}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color={theme.palette.grey[600]}>
                              {dateStringFromDate(contract.createdDate)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              color={isBuyer ? theme.palette.common.black : theme.palette.primary.main}
                            >
                              {isBuyer && '-'}${contract.displayAmount}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {!isTabletLandscape ? (
                              <Button
                                variant="outlined"
                                color="info"
                                fullWidth
                                startIcon={<MessageIcon />}
                                onClick={() => navigateToThread(contract.chatThreadId, recipientUserId)}
                              >
                                Message
                              </Button>
                            ) : (
                              <IconButton onClick={() => navigateToThread(contract.chatThreadId, recipientUserId)}>
                                <MessageIcon />
                              </IconButton>
                            )}
                          </TableCell>
                          <TableCell>
                            {!isTabletLandscape ? (
                              <Button
                                variant="outlined"
                                color="info"
                                fullWidth
                                startIcon={<VisibilityIcon />}
                                onClick={() => viewSelectedContract(contract)}
                              >
                                View
                              </Button>
                            ) : (
                              <IconButton onClick={() => viewSelectedContract(contract)}>
                                <VisibilityIcon />
                              </IconButton>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          ) : (
            <Typography variant="h6">No contracts available</Typography>
          )}
        </>
      ) : (
        <Grid item xs={12} container justifyContent="center">
          <Grid item xs={12}>
            {[...Array(4)].map((e, i) => (
              <Grid marginTop={2} key={i}>
                <StyledSkeleton variant="rounded" />
              </Grid>
            ))}
          </Grid>
        </Grid>
      )}
    </>
  );
};

const MobileContractHistoryView: React.FC<
  IContractHistoryProps & {
    setSelectedContract: React.Dispatch<IContract>;
    drawer: boolean;
    setDrawer: React.Dispatch<boolean>;
  }
> = ({ contracts, loading, setDrawer, setSelectedContract }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Grid>
      {!loading ? (
        <Grid container spacing={4.5}>
          {contracts &&
            contracts.length > 0 &&
            contracts?.map((contract: IContract) => {
              const isBuyer = Boolean(contract.buyerAdditionalDetails);
              return (
                <Grid key={contract.contractId} container item justifyContent="space-between">
                  <Grid item xs={11}>
                    <Typography variant="h6" sx={{ color: theme.palette.grey[900] }}>
                      {contract.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={1}>
                    <IconButton
                      color="inherit"
                      aria-label="view contract details"
                      component="label"
                      onClick={() => {
                        setSelectedContract(contract);
                        setDrawer(true);
                      }}
                    >
                      <ArrowForwardIcon />
                    </IconButton>
                  </Grid>

                  <StyledContentTitleGrid item xs={6}>
                    <Typography variant="body2" sx={{ color: theme.palette.grey[700] }}>
                      Status
                    </Typography>
                  </StyledContentTitleGrid>

                  <StyledStatusGrid item xs={6} container justifyContent="flex-end">
                    <StyledStatusIdicator
                      label={getContractStatusText(contract)}
                      color={StatusColourDictionary[contract.status]}
                      sx={contract.status === ContractStatus.Complete ? { color: '#ffff' } : undefined}
                    />
                  </StyledStatusGrid>

                  <StyledContentTitleGrid container item xs={12}>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ color: theme.palette.grey[700] }}>
                        Other party
                      </Typography>
                    </Grid>

                    <Grid container item xs={6} justifyContent="flex-end">
                      <Grid container item xs={9} md={10} sm={10} justifyContent="flex-end" alignItems="center">
                        {isBuyer ? (
                          <StyledMobileAvatar
                            displayName={contract.buyerAdditionalDetails!.sellerDisplayName}
                            userId={contract.buyerAdditionalDetails!.sellerId}
                          />
                        ) : (
                          <StyledMobileAvatar
                            displayName={contract.sellerAdditionalDetails?.buyerDisplayName}
                            userId={contract.sellerAdditionalDetails?.buyerId}
                          />
                        )}
                        <StyledTypography variant="body2" sx={{ color: theme.palette.grey[700] }}>
                          {isBuyer
                            ? contract.buyerAdditionalDetails?.sellerDisplayName
                            : contract.sellerAdditionalDetails?.buyerDisplayName}
                        </StyledTypography>
                      </Grid>
                    </Grid>
                  </StyledContentTitleGrid>

                  <StyledContentTitleGrid item xs={6}>
                    <Typography variant="body2" sx={{ color: theme.palette.grey[700] }}>
                      Created date
                    </Typography>
                  </StyledContentTitleGrid>

                  <Grid container item xs={6} justifyContent="flex-end">
                    <Typography variant="body2" sx={{ color: theme.palette.grey[700] }}>
                      {dateStringFromDate(contract.createdDate)}
                    </Typography>
                  </Grid>

                  <StyledContentTitleGrid item xs={6}>
                    <Typography variant="body2" sx={{ color: theme.palette.grey[700] }}>
                      Total
                    </Typography>
                  </StyledContentTitleGrid>

                  <Grid container item xs={6} justifyContent="flex-end">
                    <Typography
                      variant="body2"
                      sx={{ color: isBuyer ? theme.palette.common.black : theme.palette.primary.main }}
                    >
                      {contract.displayAmount ? `${isBuyer ? '-' : ''}$${contract.displayAmount}` : 'N/A'}
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      variant="outlined"
                      color="info"
                      fullWidth
                      startIcon={<MessageIcon />}
                      onClick={() => navigate(`/ WorkRoom / ${contract.chatThreadId}`)}
                    >
                      Message
                    </Button>
                  </Grid>
                </Grid>
              );
            })}

          {!contracts ||
            (contracts.length == 0 && (
              <Grid item container justifyContent="center">
                <Typography variant="h6">No contracts available</Typography>
              </Grid>
            ))}
        </Grid>
      ) : (
        <Grid container justifyContent="center">
          <CircularProgress color="primary" />
        </Grid>
      )}
    </Grid>
  );
};
