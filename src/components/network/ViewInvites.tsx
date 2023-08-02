import {
  Chip,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  styled,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { IInvitation } from 'global/interfaces/connection';
import React from 'react';
import { getLimitedWords } from 'utils/text';
import { QuoteOptionButtons } from '../viewContracts/QuoteOptionButtons';
import { PackageType } from 'global/enums/packageType';
import { StyledDesktopAvatar, StyledMobileAvatar } from 'components/common/StyledTable/StyledTableAvatar';
import { ConnectionDirection } from 'global/enums/connectionDirection';
import { ConnectionFirstContact } from 'global/enums/connectionFirstContact';

const StyledStatusIdicator = styled(Chip)(() => ({
  height: '19px',
  padding: '0px, 7px, 0px, 7px',
  borderRadius: '64px',
  color: '#ffff',
}));

const StyledContentTitleGrid = styled(Grid)(() => ({
  marginBottom: '16px',
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  paddingLeft: theme.spacing(1),
}));

const StyledStatusGrid = styled(Grid)(() => ({
  marginBottom: '18.5px',
}));

const StyledQuoteContentGrid = styled(Grid)(() => ({
  marginBottom: '24px',
}));

interface ViewContractQuoteProps {
  invites: IInvitation[] | undefined;
  setRefresh: React.Dispatch<boolean>;
}

export const ViewInvites = ({ invites, setRefresh }: ViewContractQuoteProps) => {
  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>
      {isMobileScreen ? (
        <MobileQuotesistoryView invites={invites} setRefresh={setRefresh} />
      ) : (
        <DesktopView invites={invites} setRefresh={setRefresh} />
      )}
    </>
  );
};

const DesktopView = ({ invites, setRefresh }: ViewContractQuoteProps) => {
  const theme = useTheme();
  const isTabletLandscape = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  const HeaderData = [
    { id: 'status', label: 'Status', minWidth: isTabletLandscape ? 140 : 180 },
    { id: 'profilePicture', label: '', minWidth: 40 },
    { id: 'freelancer', label: 'Connection', minWidth: isTabletLandscape ? 140 : 180 },
    { id: 'description', label: 'Description', minWidth: isTabletLandscape ? 140 : 180 },
    { id: 'package', label: 'Enquiry', minWidth: isTabletLandscape ? 140 : 180 },
    { id: 'options', label: 'Options', minWidth: isTabletLandscape ? 140 : 180 },
  ];

  return (
    <>
      {invites && invites.length > 0 ? (
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
              {invites?.map((conn, i) => (
                <TableRow key={`invite-${i}`}>
                  <TableCell>
                    <StyledStatusIdicator
                      label={conn.direction == ConnectionDirection.Send ? 'Requested' : 'Received'}
                      color={conn.direction == ConnectionDirection.Send ? 'warning' : 'info'}
                    />
                  </TableCell>
                  <TableCell>
                    <StyledDesktopAvatar userId={conn.otherUser?.userId} displayName={conn.otherUser?.displayName} />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color={theme.palette.grey[700]}>
                      {conn.otherUser?.displayName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color={theme.palette.grey[600]}>
                      {getLimitedWords(conn.description ?? '')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color={theme.palette.grey[600]}>
                      {conn.firstContact == ConnectionFirstContact.Package &&
                        conn.package != null &&
                        `Package: ${PackageType[conn.package]}`}
                      {conn.firstContact == ConnectionFirstContact.Quote && 'Hourly'}
                      {conn.firstContact == ConnectionFirstContact.Message && '-'}
                    </Typography>
                  </TableCell>
                  {conn.direction == ConnectionDirection.Receive && (
                    <QuoteOptionButtons connectionId={conn.connectionId} setRefresh={setRefresh} />
                  )}
                  {conn.direction == ConnectionDirection.Send && <TableCell></TableCell>}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="h5">No invites</Typography>
      )}
    </>
  );
};

const MobileQuotesistoryView: React.FC<ViewContractQuoteProps> = ({ invites, setRefresh }) => {
  const theme = useTheme();

  return (
    <Grid>
      {invites && invites.length > 0 ? (
        <>
          {invites?.map((conn, i) => (
            <StyledQuoteContentGrid key={`invite-${i}`} container item justifyContent="space-between">
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ color: theme.palette.grey[900] }}>
                  {conn.package !== undefined && conn.package !== null ? PackageType[conn.package] : 'Hourly'}
                </Typography>
              </Grid>

              <StyledContentTitleGrid item xs={12}>
                <Typography variant="body2" color={theme.palette.grey[700]}>
                  {getLimitedWords(conn.description ?? '')}
                </Typography>
              </StyledContentTitleGrid>

              <StyledContentTitleGrid item xs={6}>
                <Typography variant="body2" sx={{ color: theme.palette.grey[700] }}>
                  Status
                </Typography>
              </StyledContentTitleGrid>

              <StyledStatusGrid item xs={6} container justifyContent="flex-end">
                <StyledStatusIdicator label="Requested" color="warning" />
              </StyledStatusGrid>

              <StyledContentTitleGrid container xs={12} item>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ color: theme.palette.grey[700] }}>
                    Freelancer
                  </Typography>
                </Grid>

                <Grid container item xs={6} justifyContent="flex-end">
                  <Grid container item xs={9} md={10} sm={10} justifyContent="flex-end" alignItems="center">
                    <StyledMobileAvatar userId={conn.otherUser?.userId} displayName={conn.otherUser?.displayName} />
                    <StyledTypography variant="body2" sx={{ color: theme.palette.grey[700] }}>
                      {conn.otherUser?.displayName}
                    </StyledTypography>
                  </Grid>
                </Grid>
              </StyledContentTitleGrid>

              <QuoteOptionButtons connectionId={conn.connectionId} setRefresh={() => setRefresh} />
            </StyledQuoteContentGrid>
          ))}
        </>
      ) : (
        <Typography variant="h5">No invites</Typography>
      )}
    </Grid>
  );
};
