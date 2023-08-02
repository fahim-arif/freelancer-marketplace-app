import { Table, TableHead, TableRow, TableCell, TableBody, TableContainer, TableSortLabel, Grid } from '@mui/material';
import { OrderDirection } from 'global/enums/orderDirection';
import { IUser } from 'global/interfaces/user';
import { useNavigate } from 'react-router-dom';
import { VettingView } from './VettingView';
import { UserAvatar } from 'components/common/UserAvatar';

interface IAdminUserListProps {
  users: IUser[];
  orderDirection: OrderDirection;
  orderBy: string;
  onRequestSort: (property: string) => void;
}

const HeaderData = [
  { id: 'avatar', label: '', minWidth: 40 },
  { id: 'firstName', label: 'Name', minWidth: 180 },
  { id: 'title', label: 'Title', minWidth: 62 },
  { id: 'mainCategory', label: 'Main Category', minWidth: 52 },
  { id: 'hourlyRate', label: 'Hourly Rate', minWidth: 42 },
  { id: 'vetting.submittedOn', label: 'Submitted for approval', minWidth: 62 },
];

export const AdminUserList = ({ users, orderDirection, orderBy, onRequestSort }: IAdminUserListProps): JSX.Element => {
  const navigate = useNavigate();

  const handleRowClick = (id: string): void => {
    navigate(id);
  };

  const formatDate = (dateString?: string | null): string => {
    if (dateString) {
      const date = new Date(dateString);
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
        timeStyle: 'short',
      })}`;
    }
    return '-';
  };

  const createSortHandler = (property: string) => () => onRequestSort(property);

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
                <TableSortLabel
                  active={orderBy === headerCell.id}
                  direction={orderBy === headerCell.id ? orderDirection : 'asc'}
                  onClick={createSortHandler(headerCell.id)}
                >
                  {headerCell.label}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map(user => {
            const { id, firstName, lastName, title, vetting, mainCategory, hourlyRate } = user;
            const formattedVettingSubmittedOn = formatDate(vetting.submittedOn);
            return (
              <TableRow
                hover
                sx={{
                  '&.MuiTableRow-hover': {
                    cursor: 'pointer',
                  },
                }}
                key={id}
                onClick={() => handleRowClick(id)}
              >
                <TableCell width={40}>
                  <UserAvatar displayName={`${firstName} ${lastName}`} userId={id} />
                </TableCell>
                <TableCell>
                  <Grid container alignItems="center">
                    {firstName} {lastName} {vetting.viewedOn && <VettingView viewedOn={vetting.viewedOn} />}
                  </Grid>
                </TableCell>
                <TableCell>{title ?? '-'}</TableCell>
                <TableCell>{mainCategory ?? '-'}</TableCell>
                <TableCell>{hourlyRate ?? '-'}</TableCell>
                <TableCell>{formattedVettingSubmittedOn}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
