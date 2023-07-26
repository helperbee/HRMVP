import React, { useState } from 'react';
import { socket } from '../socket';

export function MyForm({supportedEvents}) {
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function submitEvent(target) {
    setIsLoading(true);

    socket.timeout(5000).emit('message', target, () => {
      setIsLoading(false);
    });
}

console.log(supportedEvents);

  return (
    <div>
      <input onChange={ e => setValue(e.target.value) } />
        {
            supportedEvents.length > 0 &&
            supportedEvents.map((e) => {
                return <button key={e.id} type="submit" disabled={ isLoading } onClick={() => submitEvent(e)}>{e.name}</button>
            })
        }
    </div>
  );
}