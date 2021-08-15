import {Injectable} from '@angular/core';
import {WS_URL} from './api.url.config';

@Injectable()
export class WsConfig {
  isWS_connected = false;
  ws_details = false;
  ws_notifs = false;
  ws_app = false;
  socket: WebSocket;

  constructor() {}

  getSocket() {
    if (!this.isWS_connected) {
      this.socket = new WebSocket(WS_URL);
      this.isWS_connected = true;
      this.socket.addEventListener('open', () => {
        console.log('open connection to the websocket');
      });

      this.socket.addEventListener('error', () => {
        console.log('error connection to the websocket');
        this.isWS_connected = false;
      });

      this.socket.addEventListener('close', () => {
        console.log('connection closed to the websocket!');
      });

      return this.socket;
    }
    else return this.socket;
  }

  closeSocket() {
    if (this.isWS_connected) {
      this.socket.close();
      this.isWS_connected = false;
    }
  }
}
