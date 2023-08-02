import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface PaletteColor {
    50?: string;
    100?: string;
    200?: string;
    300?: string;
    400?: string;
    500?: string;
    600?: string;
    700?: string;
    800?: string;
    900?: string;
  }
}

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1400,
      xl: 1536,
    },
  },
  palette: {
    primary: {
      '100': '#E6E9F9',
      '200': '#BCC3F0',
      '300': '#929EE7',
      '400': '#7989E2', //light
      '500': '#4E63D9', //main
      '600': '#2B43CA', //dark
      '700': '#2235A0',
      '800': '#192776',
      '900': '#10194C',
      light: '#7989E2',
      main: '#4E63D9',
      dark: '#2B43CA',
    },
    secondary: {
      '100': '#FDF1E2',
      '200': '#FBDEBC',
      '300': '#F8CB96',
      '400': '#F5B870', //light
      '500': '#F2A549', //main
      '600': '#E08110', //dark
      '700': '#98580B',
      '800': '#512F06',
      '900': '#090601',
      light: '#F5B870', //400
      main: '#F2A549', //500
      dark: '#E08110', //600
    },
    info: {
      light: '#E0EAFF', //100
      main: '#6172F3', //500
      dark: '#444CE7', //600
    },
    warning: {
      light: '#FDB022', //400
      main: '#F79009', //500
      dark: '#DC6803', //600
    },
    error: {
      light: '#FEE4E2', //100
      main: '#F04438', //500
      dark: '#D92D20', //600
    },
    success: {
      light: '#D1FADF', //100
      main: '#12B76A', //500
      dark: '#039855', //600
    },
    grey: {
      '50': '#F9FAFB',
      '100': '#F3F4F6',
      '200': '#E5E7EB',
      '300': '#D1D5DB',
      '400': '#9CA3AF',
      '500': '#6B7280',
      '600': '#4B5563',
      '700': '#374151',
      '800': '#1F2937',
      '900': '#111827',
    },
  },
});

const greyBorder = `1px solid ${theme.palette.grey[200]}`;
const whiteBorder = `2px solid ${theme.palette.common.white}`;

export const appTheme = createTheme(theme, {
  typography: {
    fontFamily: 'Inter',
    allVariants: {
      fontStyle: 'normal',
      color: theme.palette.grey[900],
    },
    h1: {
      fontWeight: 600,
      fontSize: '96px',
      lineHeight: '106px',
      letterSpacing: '-0.5px',
    },
    h2: {
      fontWeight: 600,
      fontSize: '60px',
      lineHeight: '73px',
      letterSpacing: '-0.5px',
    },
    h3: {
      fontWeight: 600,
      fontSize: '48px',
      lineHeight: '58px',
      letterSpacing: '-0.5px',
    },
    h4: {
      fontWeight: 600,
      fontSize: '36px',
      lineHeight: '40px',
      letterSpacing: '-0.5px',
    },
    h5: {
      fontWeight: 600,
      fontSize: '24px',
      lineHeight: '32px',
      letterSpacing: '-0.5px',
    },
    h6: {
      fontWeight: 600,
      fontSize: '20px',
      lineHeight: '28px',
      letterSpacing: '-0.5px',
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '16px',
      lineHeight: '24px',
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: '14px',
      lineHeight: '20px',
    },
    body1: {
      fontWeight: 400,
      fontSize: '16px',
      lineHeight: '28px',
    },
    body2: {
      fontWeight: 400,
      fontSize: '14px',
      lineHeight: '24px',
    },
    caption: {
      fontWeight: 500,
      fontSize: '12px',
      lineHeight: '16px',
    },
    overline: {
      fontWeight: 400,
      fontSize: '12px',
      lineHeight: '16px',
      textTransform: 'uppercase',
    },
  },
  components: {
    MuiTypography: {
      defaultProps: {
        fontFamily: 'Inter',
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontFamily: 'Inter',
          fontWeight: 500,
          fontSize: '14px',
          lineHeight: '20px',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          backgroundColor: theme.palette.common.white,
          borderBottom: greyBorder,
          padding: `${theme.spacing(3)} 0`,
          height: `${theme.spacing(9)}`,
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          justifyContent: 'space-between',
          padding: `${theme.spacing(2)} 0`,
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          [theme.breakpoints.up('lg')]: {
            padding: 0,
          },
          [theme.breakpoints.down('lg')]: {
            padding: `0 ${theme.spacing(3)}`,
          },
        },
        disableGutters: {
          [theme.breakpoints.down('lg')]: {
            padding: 0,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          lineHeight: '16px',
          fontFamily: 'Inter',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        sizeSmall: {
          fontSize: '12px',
          padding: `${theme.spacing(0.5)} ${theme.spacing(1.25)}`,
          height: '24px',
        },
        sizeMedium: {
          fontSize: '14px',
          padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
          height: '32px',
        },
        sizeLarge: {
          fontSize: '14px',
          padding: `${theme.spacing(1.25)} ${theme.spacing(2.75)}`,
          height: '36px',
        },
      },
      variants: [
        {
          props: {
            variant: 'text',
          },
          style: {
            color: theme.palette.grey[900],
          },
        },
      ],
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          fontSize: 20,
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          border: greyBorder,
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          height: 22,
          width: 22,
          borderRadius: 50,
          border: whiteBorder,
          lineHeight: 'unset',
        },
        dot: {
          height: 14,
          width: 14,
          borderRadius: 50,
          border: whiteBorder,
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          position: 'fixed',
          width: '100%',
          bottom: 0,
          borderTop: greyBorder,
          zIndex: 1000,
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          color: theme.palette.grey[900],
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontFamily: 'Inter',
          background: theme.palette.common.white,
          '&:hover fieldset': {
            borderColor: `${theme.palette.grey[500]} !important`,
          },
        },
        notchedOutline: {
          transition: 'all .25s ease',
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          minWidth: 750,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: theme.palette.grey[200],
            padding: '8px',
            gap: '24px',
            height: '40px',

            /* Grayscale/50 */
            background: theme.palette.grey[50],
            // borderRadius: '8px',

            /* Body 2 */
            fontFamily: 'Inter',
            fontStyle: 'normal',
            fontWeight: 400,
            fontSize: '14px',
            lineHeight: '24px',

            /* Grayscale/600 */
            color: theme.palette.grey[600],
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          paddingLeft: 0,
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontFamily: 'Inter',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          fontFamily: 'Inter',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: 'Inter',
        },
      },
    },
  },
});
