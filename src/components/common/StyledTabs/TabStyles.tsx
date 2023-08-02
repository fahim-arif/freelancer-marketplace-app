import { styled, Tab, Tabs } from '@mui/material';

interface StyledTabsProps {
  children?: React.ReactNode;
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

export const StyledTabs = styled((props: StyledTabsProps) => (
  <>{props.value !== -1 ? <Tabs {...props} variant="fullWidth" /> : <></>}</>
))({
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  '& .MuiTabs-indicatorSpan': {
    maxWidth: 40,
    width: '100%',
    backgroundColor: 'black',
  },
});

interface StyledTabProps {
  label: string | JSX.Element;
  value: string | number;
}

export const StyledTab = styled((props: StyledTabProps) => <Tab {...props} />)(({ theme }) => ({
  marginRight: theme.spacing(1),
  color: theme.palette.grey[700],
  '&.Mui-selected': {
    borderColor: theme.palette.primary[400],
    backgroundColor: '#EFF1FB',
    color: theme.palette.primary[700],
  },
  '&.Mui-focusVisible': {
    backgroundColor: theme.palette.grey[400],
  },
  backgroundColor: theme.palette.grey[50],
  borderRadius: '4px',
  borderColor: theme.palette.grey[200],
  borderStyle: 'solid',
  borderWidth: '1px',
}));
