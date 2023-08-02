import { Outlet } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthContext, AuthType, UserAuth } from 'contexts/AuthContext';
import Header from './Header';
import { Component } from 'react';
import startSignalRHub from 'services/signalRService';
import { HubConnection } from '@microsoft/signalr';
import { ThemeProvider } from '@mui/material';
import { appTheme } from './themes/theme';
import { reactPlugin } from './AppInsights';
import { AppInsightsErrorBoundary } from '@microsoft/applicationinsights-react-js';
import FooterContainer from 'FooterContainer';
import MainBox from 'MainBox';
import { getUserAuth } from 'services/authService';

// eslint-disable-next-line @typescript-eslint/ban-types
class App extends Component<{}, AuthType> {
  refresh: () => void;
  // eslint-disable-next-line @typescript-eslint/ban-types
  constructor(props: {} | Readonly<{}>) {
    // ️⚡️ does not compile in strict mode
    super(props);

    this.refresh = () => {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const self = this;
      let hub: HubConnection;

      function onSuccess(user: UserAuth): void {
        hub = startSignalRHub();
        self.setState(() => ({
          loading: false,
          loggedIn: true,
          user,
          hubConnection: hub,
        }));
      }

      function onError(): void {
        if (self.state.hubConnection != null) {
          self.state.hubConnection.stop();
        }

        self.setState(() => ({
          loading: false,
          loggedIn: false,
          user: null,
          hubConnection: null,
        }));
      }

      getUserAuth().then(onSuccess).catch(onError);
    };

    this.state = {
      loading: true,
      loggedIn: false,
      user: null,
      refresh: this.refresh,
      hubConnection: null,
    };
  }

  componentDidMount(): void {
    this.refresh();
  }

  render(): JSX.Element {
    return (
      <AuthContext.Provider value={this.state}>
        <ThemeProvider theme={appTheme}>
          <CssBaseline />
          <Header />
          <MainBox>
            <section>
              <AppInsightsErrorBoundary
                onError={() => <h4>Sorry something has went wrong</h4>}
                appInsights={reactPlugin}
              >
                <Outlet />
              </AppInsightsErrorBoundary>
            </section>
          </MainBox>
          <FooterContainer />
        </ThemeProvider>
      </AuthContext.Provider>
    );
  }
}

export default App;
