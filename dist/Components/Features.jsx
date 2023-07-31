import React, { useState } from 'react';
import { IconButton, Typography } from '@mui/material';
import { socket } from '../socket';

const buttonStyle = {
  borderRadius: '50%',
  backgroundColor: '#FFCDD2',
  margin: '8px',
  transition: 'transform 1s ease-in-out',
};

const buttonTextStyles = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  fontSize: '12px',
  color: 'black',
  fontWeight: 'bold', 
  textShadow: '1px 0 0 #FFF, 0 -1px 0 #FFF, 0 1px 0 #FFF, -1px 0 0 #FFF',
};

let Features = ({supportedEvents}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isHoveredButtonId, setIsHoveredButtonId] = useState(null);

  const handleMouseEnter = (buttonId) => {
    setIsHoveredButtonId(buttonId);
  };

  const handleMouseLeave = () => {
    setIsHoveredButtonId(null);
  };

  const isHovered = (buttonId) => isHoveredButtonId === buttonId;

  function submitEvent(target) {
    setIsLoading(true);

    socket.timeout(5000).emit('message', {...target, ['twitchSession']: window.Twitch.ext.viewer.sessionToken}, () => {
      setIsLoading(false);
    });
}
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
      {supportedEvents.length > 0 &&
        supportedEvents.map((e) => (
          <IconButton
            key={e.id}
            disabled={isLoading}
            aria-label="upload picture"
            component="span"
            style={{
              ...buttonStyle,
              transform: isHovered(e.id) ? 'scale(1.2)' : 'scale(1)',
            }}
            onMouseEnter={() => handleMouseEnter(e.id)}
            onMouseLeave={handleMouseLeave}
            onClick={() => submitEvent(e)}
          >
            <img src={e.image} alt={e.name} width="50" height="50" />
            {isHovered(e.id) && (
              <Typography variant="body2" style={buttonTextStyles}>
                {e.name}
              </Typography>
            )}
          </IconButton>
        ))}
    </div>
  );
};
export default Features;