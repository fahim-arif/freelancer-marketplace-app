import { ReactPlugin } from '@microsoft/applicationinsights-react-js';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';

export const reactPlugin = new ReactPlugin();

const APP_INSIGHTS_CONN_STRING = process.env.REACT_APP_INSIGHTS_CONN_STRING ?? '';

const appInsights = new ApplicationInsights({
  config: {
    connectionString: APP_INSIGHTS_CONN_STRING,
    enableAutoRouteTracking: true,
    enableCorsCorrelation: true,
    enableRequestHeaderTracking: false,
    enableResponseHeaderTracking: false,
    correlationHeaderExcludedDomains: ['*.queue.core.windows.net'],
    extensions: [reactPlugin],
  },
});
appInsights.loadAppInsights();
