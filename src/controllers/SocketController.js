import io from 'socket.io-client';
import { writable } from 'svelte/store';

class SocketController {
  constructor(url) {
    this.socket = io.connect(url);

    const socket = this.socket;

    socket.on('movement', ({ from, to }) => {
      
    });
  }


};

export default SocketController;
