import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Grid,
  IconButton,
  LinearProgress,
  LinearProgressProps,
  Stack,
  Typography,
  linearProgressClasses,
  styled,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  ContractDeliverableStatus,
  ContractStatus,
  ContractType,
  IContractDisplay,
  IDeliverable,
} from 'global/interfaces/contract';
import { IActiveContractsProps } from './rightMenu';
import React from 'react';
import { AuthContext, AuthType } from 'contexts/AuthContext';
import { ChatType } from 'global/interfaces/chatThread';
import { dateStringFromDate } from 'utils/dateFormat';
import { updateContract } from 'services/contractService';
import { useCustomEventListener } from 'react-custom-events';
import { MessagePublisherEventType } from 'global/enums/messagePublisherEventType';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import CheckBoxOutlineBlankOutlinedIcon from '@mui/icons-material/CheckBoxOutlineBlankOutlined';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import { AccessTime, BadgeOutlined, Tune } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { ArrowBackIcon } from 'components/icon/ArrowBackIcon';
import CreateContract from 'components/common/Contract/CreateContract';
import { UserAvatar } from 'components/common/UserAvatar';
import AddIcon from '@mui/icons-material/Add';
import { VettingStatus } from 'global/enums/vettingStatus';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import { SwipeableContractDrawer } from 'components/common/Contract/SwipeableContractDrawer';

interface MobileProps {
  isMobile: boolean;
}

const FlexBox = styled(Box)`
  display: flex;
  align-items: center;
`;

const StyledGrid = styled(Grid)(() => ({
  marginBottom: '16px',
}));

const StyledContentGrid = styled(Grid)(() => ({
  marginLeft: '24px',
  marginRight: '24px',
}));

const FlexBoxTopMargin = styled(FlexBox)(({ theme }) => ({
  marginTop: theme.spacing(1.5),
}));

const TitleTypography = styled(Typography, {
  // Configure which props should be forwarded on DOM
  shouldForwardProp: prop => prop !== 'isMobile',
})<MobileProps>(({ isMobile }) => ({
  paddingLeft: isMobile ? '0px' : '16px',
  display: 'inline-flex',
}));

const JustifiedBox = styled(Box)(() => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const IconTypography = styled(Typography)(({ theme }) => ({
  marginLeft: theme.spacing(1.0),
}));

const IndentSmallTypography = styled(Typography)(({ theme }) => ({
  marginLeft: theme.spacing(2.5),
  color: theme.palette.grey[700],
}));

const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[200],
  },
  [`& .${linearProgressClasses.bar}`]: {
    backgroundColor: theme.palette.primary[600],
  },
}));

const StyledAccordion = styled(Accordion)(() => ({
  marginBottom: '16px',
}));

function LinearProgressWithLabel(
  props: LinearProgressProps & { numdeliverables: number | undefined; completednumdeliverables: number | undefined },
) {
  const value: number =
    props.numdeliverables !== undefined && props.completednumdeliverables !== undefined
      ? (props.completednumdeliverables / props.numdeliverables) * 100
      : 0;

  const theme = useTheme();
  return (
    <FlexBox>
      <Box sx={{ width: '100%', mr: 1 }}>
        <StyledLinearProgress variant="determinate" value={value} />
      </Box>
      <Box>
        <Typography
          variant="body2"
          color={theme.palette.grey[700]}
        >{`${props.completednumdeliverables}/${props.numdeliverables}`}</Typography>
      </Box>
    </FlexBox>
  );
}

const StyledAccordionSummary = styled(AccordionSummary)(() => ({
  'svg[data-testid="ExpandMoreIcon"]': {
    display: 'inline-block',
    position: 'relative',
  },
  '.Mui-expanded svg[data-testid="ExpandMoreIcon"]': {
    display: 'none',
  },
  'svg[data-testid="ExpandLessIcon"]': {
    display: 'none',
    position: 'relative',
  },
  '.Mui-expanded svg[data-testid="ExpandLessIcon"]': {
    display: 'inline-block',
  },
}));

export const ActiveContracts: React.FC<IActiveContractsProps> = (props: IActiveContractsProps) => {
  const [contracts, setContracts] = React.useState<IContractDisplay[]>([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const authContext = React.useContext(AuthContext) as AuthType;
  const [openCreateContractDrawer, setOpenCreateContractDrawer] = React.useState(false);
  const [viewContractDrawer, setViewContractDrawer] = React.useState<boolean>(false);
  const [selectedViewContract, setSelectedViewContract] = React.useState<IContractDisplay>();

  React.useEffect(() => {
    setContracts(props.contracts);
  }, [props.contracts]);

  React.useEffect(() => {
    setOpenCreateContractDrawer(false);
  }, [props.selectedThread]);

  useCustomEventListener(
    MessagePublisherEventType[MessagePublisherEventType.ContractChange],
    (res: IContractDisplay) => {
      if (res.chatThreadId === props.selectedThread?.chatThreadId) {
        setContracts(current => {
          updateContract(res);
          const contractIndex = current.findIndex(p => p.contractId === res.contractId);
          // If it's a new contract add it to the end of the list
          if (contractIndex === -1) {
            return [...current, res];
          } else {
            // If it's a contract in the list then replace it
            return current.map(item => (item.contractId === res.contractId ? res : item));
          }
        });
      }
    },
    [props.selectedThread],
  );

  const multiRecipients =
    props.selectedThread?.type == ChatType.Group
      ? props.selectedThread?.recipients.filter(r => r.userId != authContext.user?.id)
      : undefined;

  const otherUserId = props.selectedThread?.type == ChatType.OneToOne ? props.selectedThread.otherUserId : null;

  return (
    <>
      <StyledGrid container direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
        {!openCreateContractDrawer && (
          <Grid item>
            <FlexBox>
              {isMobile && (
                <IconButton onClick={props.handleMiddleClick} sx={{ marginLeft: '-8px' }}>
                  <ArrowBackIcon />
                </IconButton>
              )}
              {props.selectedThread?.type === ChatType.OneToOne && (
                <TitleTypography variant="h6" isMobile={isMobile} color={theme.palette.grey[900]}>
                  Active Contracts
                </TitleTypography>
              )}
            </FlexBox>
          </Grid>
        )}
        <Grid
          item
          xs={isMobile || props.selectedThread?.type === ChatType.Group || openCreateContractDrawer ? 12 : 'auto'}
        >
          {authContext.user?.vettingStatus === VettingStatus.Approved && props.selectedThread?.active && (
            <Grid container>
              <Grid>
                {!openCreateContractDrawer && (
                  <Button
                    variant="contained"
                    onClick={() => setOpenCreateContractDrawer(true)}
                    fullWidth={isMobile != undefined && isMobile}
                    startIcon={<AddIcon />}
                  >
                    Create Contract
                  </Button>
                )}
              </Grid>
              {openCreateContractDrawer && (
                <CreateContract
                  setOpenConnectDrawer={setOpenCreateContractDrawer}
                  chatThreadId={props.selectedThread?.chatThreadId}
                  multiRecipients={multiRecipients}
                  otherUserId={otherUserId}
                  fullWidth={isMobile}
                />
              )}
            </Grid>
          )}
        </Grid>
      </StyledGrid>

      {!openCreateContractDrawer && (
        <Box sx={{ pl: isMobile ? 0 : '16px', pr: isMobile ? 0 : '16px' }}>
          {contracts.map((item: IContractDisplay, i: number) => {
            const isBuyer = Boolean(item.buyerAdditionalDetails);
            return (
              <StyledAccordion key={i} disableGutters>
                <StyledAccordionSummary>
                  <Stack direction="column" spacing={0} sx={{ width: '100%' }}>
                    <JustifiedBox>
                      <Typography component="div" variant="subtitle1" color={theme.palette.grey[900]}>
                        {item.name}
                      </Typography>
                      <ExpandMoreIcon />
                      <ExpandLessIcon />
                    </JustifiedBox>
                    {item.status !== ContractStatus.Cancelled && (
                      <Box sx={{ width: '100%', mt: 1 }} component="div">
                        <LinearProgressWithLabel
                          numdeliverables={item.numDeliverables}
                          completednumdeliverables={item.numCompletedDeliverables}
                        />
                      </Box>
                    )}
                    <JustifiedBox sx={{ mt: 1 }}>
                      <FlexBox>
                        <AccountBalanceWalletOutlinedIcon />
                        <IconTypography variant="subtitle1" color={theme.palette.grey[900]}>
                          Payment:
                        </IconTypography>
                        <IconTypography
                          variant="subtitle1"
                          color={isBuyer ? theme.palette.common.black : theme.palette.primary.main}
                        >
                          {isBuyer && '-'}${item.displayAmount}
                        </IconTypography>
                      </FlexBox>
                      <Typography component="span" variant="body2" color={theme.palette.grey[900]}>
                        {item.paymentStatusText}
                      </Typography>
                    </JustifiedBox>
                    <JustifiedBox sx={{ mt: 1 }}>
                      {item.sellerAdditionalDetails && (
                        <FlexBox>
                          <ArrowCircleDownIcon />
                          <IconTypography variant="subtitle1">Sell</IconTypography>
                        </FlexBox>
                      )}
                      {item.buyerAdditionalDetails && (
                        <FlexBox>
                          <ArrowCircleUpIcon />
                          <IconTypography variant="subtitle1">Purchase</IconTypography>
                        </FlexBox>
                      )}
                      {props.selectedThread?.type === ChatType.Group && (
                        <FlexBox>
                          <UserAvatar
                            sx={{ width: 24, height: 24 }}
                            userId={
                              item.buyerAdditionalDetails
                                ? item.buyerAdditionalDetails?.sellerId
                                : item.sellerAdditionalDetails?.buyerId
                            }
                            displayName={
                              item.buyerAdditionalDetails
                                ? item.buyerAdditionalDetails?.sellerDisplayName
                                : item.sellerAdditionalDetails?.buyerDisplayName
                            }
                          />
                          <IconTypography variant="body2">
                            {item.buyerAdditionalDetails
                              ? item.buyerAdditionalDetails?.sellerDisplayName
                              : item.sellerAdditionalDetails?.buyerDisplayName}
                          </IconTypography>
                        </FlexBox>
                      )}
                    </JustifiedBox>
                  </Stack>
                </StyledAccordionSummary>
                <AccordionDetails>
                  <Stack direction="column" spacing={0} sx={{ width: '100%' }}>
                    <JustifiedBox>
                      <FlexBox>
                        <AssignmentTurnedInOutlinedIcon />
                        <IconTypography variant="subtitle1">Status</IconTypography>
                      </FlexBox>
                      {item.status === ContractStatus.Created && (
                        <Typography component="span" variant="caption" color={theme.palette.grey[900]}>
                          Not Started
                        </Typography>
                      )}
                      {item.status === ContractStatus.Cancelled && (
                        <Typography component="span" variant="caption" color={theme.palette.grey[900]}>
                          Cancelled
                        </Typography>
                      )}
                      {item.status === ContractStatus.InProgress && (
                        <Chip
                          label={
                            <Typography variant="caption" color={theme.palette.common.white}>
                              In Progress
                            </Typography>
                          }
                          color="warning"
                          size="small"
                        />
                      )}
                      {item.status === ContractStatus.Disputed && (
                        <Chip
                          label={
                            <Typography variant="caption" color={theme.palette.common.white}>
                              Disputed
                            </Typography>
                          }
                          color="error"
                          size="small"
                        />
                      )}
                      {item.status === ContractStatus.Complete && (
                        <Chip
                          label={
                            <Typography variant="caption" color={theme.palette.common.white}>
                              Complete
                            </Typography>
                          }
                          color="success"
                          size="small"
                        />
                      )}
                    </JustifiedBox>
                    <FlexBoxTopMargin>
                      <CheckBoxOutlinedIcon />
                      <IconTypography variant="subtitle1">Deliverables</IconTypography>
                    </FlexBoxTopMargin>
                    {item.deliverables.map((deliverable: IDeliverable, p: number) => (
                      <React.Fragment key={p}>
                        <JustifiedBox
                          sx={{
                            mt: 1.5,
                          }}
                          component="div"
                        >
                          <FlexBox>
                            {deliverable.status === ContractDeliverableStatus.Approved && (
                              <CheckCircleOutlinedIcon color="success" />
                            )}
                            {deliverable.status === ContractDeliverableStatus.WaitingApproval && (
                              <AccessTime color="warning" titleAccess="Awaiting Approval" />
                            )}
                            {deliverable.status !== ContractDeliverableStatus.Approved &&
                              deliverable.status !== ContractDeliverableStatus.WaitingApproval && (
                                <CheckBoxOutlineBlankOutlinedIcon color="disabled" />
                              )}
                            <IndentSmallTypography variant="subtitle2">{deliverable.name}</IndentSmallTypography>
                          </FlexBox>
                          {deliverable.status !== ContractDeliverableStatus.Approved &&
                            deliverable.revisionsRequested > 0 && (
                              <FlexBox>
                                <IndentSmallTypography variant="caption" color={theme.palette.grey[400]}>
                                  {deliverable.revisionsRequested}/{item.revisions}
                                </IndentSmallTypography>
                              </FlexBox>
                            )}
                        </JustifiedBox>
                      </React.Fragment>
                    ))}

                    <FlexBoxTopMargin component="div">
                      <Typography component="div" variant="subtitle1" color={theme.palette.grey[900]}>
                        Terms
                      </Typography>
                    </FlexBoxTopMargin>
                    <FlexBoxTopMargin component="div">
                      <AccessTime />
                      <IndentSmallTypography variant="subtitle2" color={theme.palette.grey[600]}>
                        {item.delivery} days delivery
                      </IndentSmallTypography>
                    </FlexBoxTopMargin>
                    <FlexBoxTopMargin component="div">
                      <Tune />
                      <IndentSmallTypography variant="subtitle2" color={theme.palette.grey[600]}>
                        {item.revisions} Revisions
                      </IndentSmallTypography>
                    </FlexBoxTopMargin>
                    <FlexBoxTopMargin component="div">
                      <BadgeOutlined />
                      <IndentSmallTypography variant="subtitle2" color={theme.palette.grey[600]}>
                        Licence:{' '}
                        {item.licenseText !== null && item.licenseText !== '' ? item.licenseText : item.license}
                      </IndentSmallTypography>
                    </FlexBoxTopMargin>
                    <JustifiedBox sx={{ mt: 2 }} component="div">
                      <FlexBox>
                        <CalendarTodayOutlinedIcon />
                        <IconTypography variant="subtitle1">Deadline</IconTypography>
                      </FlexBox>
                      <IconTypography variant="body2">{dateStringFromDate(item.deadlineDate)}</IconTypography>
                    </JustifiedBox>
                    <StyledGrid>
                      <JustifiedBox sx={{ mt: 1 }} component="div">
                        <FlexBox>
                          <ReceiptOutlinedIcon />
                          <IconTypography variant="subtitle1">Contract type</IconTypography>
                        </FlexBox>
                        <IconTypography variant="body2">
                          {item.contractType === ContractType.FixedPackage ? 'Package' : item.contractType}
                        </IconTypography>
                      </JustifiedBox>
                    </StyledGrid>
                    <Grid container>
                      <Button
                        variant="outlined"
                        type="submit"
                        aria-label="view contract button"
                        size="medium"
                        fullWidth
                        onClick={() => {
                          setSelectedViewContract(item);
                          setViewContractDrawer(true);
                        }}
                      >
                        View contract
                      </Button>
                    </Grid>
                  </Stack>
                </AccordionDetails>
              </StyledAccordion>
            );
          })}
          {selectedViewContract && (
            <SwipeableContractDrawer
              contract={selectedViewContract}
              drawer={viewContractDrawer}
              setDrawer={setViewContractDrawer}
              showMessageButton={false}
            />
          )}
        </Box>
      )}
      {contracts.length === 0 && !openCreateContractDrawer && (
        <StyledContentGrid>
          <Typography variant="body1" component="div" align="left" sx={{ mb: 1, display: 'inline-flex' }}>
            No Active Contracts
          </Typography>
        </StyledContentGrid>
      )}
    </>
  );
};
