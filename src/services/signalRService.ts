import { HubConnection, HubConnectionBuilder, IHttpConnectionOptions } from '@microsoft/signalr';
import { emitCustomEvent } from 'react-custom-events';
import { MessagePublisherEventType } from 'global/enums/messagePublisherEventType';
import { handleSignalRError } from 'utils/errorHandler';

export default function startSignalRHub(): HubConnection {
  const signalRUrl = `${process.env.REACT_APP_API_URL ?? ''}/SignalR`;

  const accessToken = localStorage.getItem('accessToken') ?? '';

  const options: IHttpConnectionOptions = {
    headers: {
      shouttBearerToken: accessToken,
    },
  };

  const connection = new HubConnectionBuilder().withUrl(signalRUrl, options).withAutomaticReconnect().build();

  connection
    .start()
    .then(() => {
      const events = Object.keys(MessagePublisherEventType).filter(v => isNaN(Number(v)));

      events.forEach(event => {
        connection.on(event, data => {
          emitCustomEvent(event, data);
        });
      });
    })
    .catch(e => handleSignalRError(e));

  return connection;
}
