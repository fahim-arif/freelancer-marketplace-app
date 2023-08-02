import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { IConnection } from 'global/interfaces/connection';
import { Dispatch } from 'react';
import { NetworkOptionButtons } from './networkOptionButtons';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import { dateStringFromDate } from 'utils/dateFormat';
import { UserAvatar } from 'components/common/UserAvatar';

interface NetworkProps {
  connections: IConnection[] | undefined;
  setRefresh: Dispatch<boolean>;
}

export const ViewNetworkTable: React.FC<NetworkProps> = props => {
  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.down('md'));

  return <>{isMobileScreen ? <MobileNetworkView {...props} /> : <DesktopView {...props} />}</>;
};

const DesktopView: React.FC<NetworkProps> = ({ connections, setRefresh }) => {
  const HeaderData = [
    { id: 'avatar', label: '', minWidth: 40 },
    {
      id: 'user',
      label: 'Connection',
      minWidth: 180,
    },
    { id: 'last-contract', label: 'Last contract', minWidth: 180 },
    { id: 'total-spent', label: 'Total amount', minWidth: 180 },
    { id: 'options', label: 'Options', minWidth: 180 },
  ];

  return (
    <TableContainer sx={{ overflowX: 'auto' }}>
      <Table sx={{ minWidth: 750 }}>
        <TableHead
          sx={{
            '& .MuiTableCell-head': {
              backgroundColor: '#E5E5E5',
              fontWeight: 600,
            },
          }}
        >
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
          {connections?.map((con, i) => (
            <TableRow key={`connection-${i}`}>
              <TableCell width={40}>
                <UserAvatar displayName={con.otherUser?.displayName} userId={con.otherUser?.userId} />
              </TableCell>
              <TableCell>{con.otherUser?.displayName}</TableCell>
              <TableCell>
                {con.contract?.lastContractCreatedOn ? dateStringFromDate(con.contract?.lastContractCreatedOn) : 'N/A'}
              </TableCell>
              <TableCell>{con.contract?.totalAmount ? `${con.contract?.totalAmount} $` : 'N/A'}</TableCell>
              <TableCell>
                <Grid container spacing={1}>
                  <NetworkOptionButtons connection={con} setRefresh={setRefresh} />
                </Grid>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const MobileNetworkView: React.FC<NetworkProps> = ({ connections, setRefresh }) => {
  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>
      <Grid container spacing={4.5}>
        {connections?.map(con => (
          <Grid key={con.connectionId} container item>
            <Grid container item xs={12} md={4}>
              <Grid container item xs={1.8} sm={1} md={2} alignItems="center">
                <UserAvatar displayName={con.otherUser?.displayName} userId={con.otherUser?.userId} variant="rounded" />
              </Grid>

              <Grid item xs={9.2} md={10} sm={10}>
                <Typography variant="subtitle1" sx={{ color: theme.palette.grey[900] }}>
                  {con.otherUser?.displayName}
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.grey[700] }}>
                  {con.otherUser?.mainCategory}
                </Typography>
              </Grid>
              {isMobileScreen && (
                <Grid xs={1} container justifyContent="flex-end">
                  <StarOutlineIcon />
                </Grid>
              )}
            </Grid>

            <Grid container xs={12} md={8}>
              <Grid xs={12} md={3} item container justifyContent="space-between">
                <Grid item xs={6} md={12}>
                  <Typography variant="body1" sx={{ color: theme.palette.grey[700] }}>
                    Last contract
                  </Typography>
                </Grid>

                <Typography variant="body1" sx={{ color: theme.palette.grey[600] }}>
                  {con.contract?.lastContractCreatedOn
                    ? `${dateStringFromDate(con.contract?.lastContractCreatedOn)}`
                    : 'N/A'}
                </Typography>
              </Grid>

              <Grid xs={12} md={3} item container justifyContent="space-between">
                <Grid item xs={6} md={12}>
                  <Typography variant="body1" sx={{ color: theme.palette.grey[700] }}>
                    Total amount
                  </Typography>
                </Grid>
                <Typography variant="body1" sx={{ color: theme.palette.grey[600] }}>
                  {con.contract?.totalAmount ? `${con.contract?.totalAmount} $` : 'N/A'}
                </Typography>
              </Grid>

              <Grid item container spacing={1} md={5} alignItems="center">
                <NetworkOptionButtons connection={con} setRefresh={setRefresh} />
              </Grid>

              {!isMobileScreen && (
                <Grid xs={1.2} md={1} container alignItems="center" justifyContent="center">
                  <StarOutlineIcon />
                </Grid>
              )}
            </Grid>
          </Grid>
        ))}
      </Grid>
    </>
  );
};
