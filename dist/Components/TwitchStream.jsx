import React from 'react';

const TwitchStream = () => {
  const twitchIframeSrc = 'https://player.twitch.tv/?channel=mmpesto';

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh',
        marginTop:'50px'
      }}
    >
      <iframe
        title="Twitch Stream"
        src={twitchIframeSrc}
        height="500"
        width="800"
        style={{ border: 'none' }}
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default TwitchStream;