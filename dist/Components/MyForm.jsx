import React, { useState } from 'react';
import { socket } from '../socket';

export function MyForm({supportedEvents}) {
  const [isLoading, setIsLoading] = useState(false);

  function submitEvent(target) {
    setIsLoading(true);

    socket.timeout(5000).emit('message', {...target, ['twitchSession']: window.Twitch.ext.viewer.sessionToken}, () => {
      setIsLoading(false);
    });
}

  return (
    <div>
      <hr/>
        {
          supportedEvents.length > 0 &&
          supportedEvents.map((e) => {
              return <button key={e.id} type="submit" disabled={ isLoading } onClick={() => submitEvent(e)}>{e.name}</button>
          })
        }
    </div>
  );
}