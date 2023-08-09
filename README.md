# Hack Reactor MVP Project

![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54) ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)

## Project Intention

Adding a layer of communal control to a twitch stream. A streamer will be able to run the **host.py** script on their streaming computer to allow users that are viewing the stream to have some form of control over the stream. This project allows users to send events relating to Lost Ark. A user is able to send a honing command through the websocket that will perform the act of honing on the host's computer. This allows that user to 'control' the stream in a sense.


## Installation & Setup

1. Initiate EC2 Instance
2. Install git & relevant dependencies
3. Clone project down and install project dependencies
4. Create .env from .env copy template provided within the project. Add in relevant variables
5. Run server.js to host the server after opening the EC2 to the outside world
6. Make sure streaming computer is running stream
7. Run host.py through powershell on streaming computer. Ensure relevant dependencies are installed (socketio, pyautogui, opencv)
8. Make sure Lost Ark character is in front of honing area within game
