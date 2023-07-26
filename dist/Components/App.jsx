import React, { useState, useEffect } from 'react';
import { socket } from '../socket';
import { ConnectionState } from './ConnectionState.jsx';
import { ConnectionManager } from './ConnectionManager.jsx';
import { Events } from './Events.jsx'; 
import { MyForm } from './MyForm.jsx';

export default function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [supportedEvents, setSupportedEvents] = useState([]);
  const [fooEvents, setFooEvents] = useState([]);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      console.log('Connection was made!');
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onFooEvent(value) {
      setFooEvents(previous => [...previous, value]);
    }

    function onInitializer(i) {
      setSupportedEvents(i);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('foo', onFooEvent);
    socket.on('initializer', onInitializer);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('foo', onFooEvent);
    };
  }, []);

  return (
    <div className="App">
      <ConnectionState isConnected={ isConnected } />
      <Events events={ fooEvents } />
      <ConnectionManager />
      <MyForm supportedEvents={supportedEvents}/>
    </div>
  );
}