import socketio

sio = socketio.Client()

@sio.on('connect')
def on_connect():
    print('Connected to the Socket.IO server')
    sio.emit('message', {'message': 'Hello from Python client'})

@sio.on('message')
def on_message(data):
    print(f'Received message from server: {data}')

@sio.on('disconnect')
def on_disconnect():
    print('Server disconnected.')
sio.connect('http://localhost:3000')

sio.wait()