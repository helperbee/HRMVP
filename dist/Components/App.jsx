import React, { useState, useEffect } from 'react';
import { socket } from '../socket';
import Features from './Features.jsx';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import TwitchStream from './TwitchStream.jsx';
const theme = createTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#558b2f',
      light: '#4caf50',
      dark: '#43a047',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#29b6f6',
      light: '#26c6da',
    },
    background: {
      default: '#bdbdbd',
      paper: '#000',
    },
    divider: '#303030',
    text: {
      primary: '#000000',
      secondary: '#fafafa',
    },
  },
});
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
    <ThemeProvider theme={theme}>
      <h2 style={{textAlign:'center'}}>CONNECTION : {isConnected ? <span style={{color:'green'}}>ACTIVE</span> : <span style={{color:'red'}}>DEAD</span>}</h2>
      <CssBaseline />      
      <TwitchStream />
      <Features supportedEvents={supportedEvents}/>
    </ThemeProvider>
  );
}