import React, { useState, useEffect } from 'react';
import { socket } from '../socket';
import { MyForm } from './MyForm.jsx';

export default function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [supportedEvents, setSupportedEvents] = useState([]);

  useEffect(() => {

    let onConnect = () => {
      setIsConnected(true); 
      socket.emit('supported');
    };

    let onDisconnect = () => {
      setIsConnected(false);
    };

    let onInitializer = (i) =>{
      setSupportedEvents(i);//Initial response of supported items/commands
    };
    
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('initializer', onInitializer);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('initializer', onInitializer);
    };
  }, []);

  return (
    <div className="App">
      <h3>YOU ARE {isConnected ? '' : 'NOT'} CONNECTED</h3>
      <MyForm supportedEvents={supportedEvents}/>
    </div>
  );
}