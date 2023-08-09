import socketio
import pyautogui
import time
import threading
import queue
import sys
import time



sys.path.append('../')
from obswebsocket import obsws, requests
from dotenv import load_dotenv
import os
load_dotenv(dotenv_path=".env")


import inspect


def switch_scene(sceneName):
    host = "192.168.1.165"
    port = 4455
    password = ""

    ws = obsws(host, port, password)
    ws.connect()
    ws.call(requests.SetCurrentProgramScene(sceneName=sceneName))
    ws.disconnect()

sio = socketio.Client()

class Action:
    def __init__(self, image, type):
        self.image = image
        self.type = type # gem or honing

linked = {}

#lazy handling of actions for proof of concept
linked['State'] = Action(r'\\wsl$\Ubuntu-22.04\home\mvpee\progress\HRMVP\worker\semi_state.PNG', 'state')

linked['Inventory'] = Action(r'\\wsl$\Ubuntu-22.04\home\mvpee\progress\HRMVP\worker\Inventory.PNG', 'Inventory')
linked['Diamond'] = Action(r'\\wsl$\Ubuntu-22.04\home\mvpee\progress\HRMVP\worker\diamond.PNG', 'Inventory')
linked['cdrgem'] = Action(r'\\wsl$\Ubuntu-22.04\home\mvpee\progress\HRMVP\worker\cdrgem.PNG', 'Inventory')
linked['atkgem'] = Action(r'\\wsl$\Ubuntu-22.04\home\mvpee\progress\HRMVP\worker\atkgem.PNG', 'Inventory')
linked['fusebutton'] = Action(r'\\wsl$\Ubuntu-22.04\home\mvpee\progress\HRMVP\worker\fusebutton.PNG', 'Inventory')
linked['fusefinish'] = Action(r'\\wsl$\Ubuntu-22.04\home\mvpee\progress\HRMVP\worker\fusefinish.PNG', 'Inventory')

linked['Honing_start'] = Action(r'\\wsl$\Ubuntu-22.04\home\mvpee\progress\HRMVP\worker\honing_start.PNG', 'honing')
linked['Honing_100'] = Action(r'\\wsl$\Ubuntu-22.04\home\mvpee\progress\HRMVP\worker\honing_100.PNG', 'honing')
linked['Honing_upgrade'] = Action(r'\\wsl$\Ubuntu-22.04\home\mvpee\progress\HRMVP\worker\honing_upgrade.PNG', 'honing')
linked['Honing_max'] = Action(r'\\wsl$\Ubuntu-22.04\home\mvpee\progress\HRMVP\worker\honing_max.PNG', 'honing')
linked['Honing_max_upgrade'] = Action(r'\\wsl$\Ubuntu-22.04\home\mvpee\progress\HRMVP\worker\honing_max_upgrade.PNG', 'honing')
linked['Honing_results'] = Action(r'\\wsl$\Ubuntu-22.04\home\mvpee\progress\HRMVP\worker\honing_results.PNG', 'results')
linked['Honing_done'] = Action(r'\\wsl$\Ubuntu-22.04\home\mvpee\progress\HRMVP\worker\honing_done.PNG', 'results')

linked['Helmet'] = Action(r'\\wsl$\Ubuntu-22.04\home\mvpee\progress\HRMVP\worker\helmet.PNG', 'honing')
linked['Pauldron'] = Action(r'\\wsl$\Ubuntu-22.04\home\mvpee\progress\HRMVP\worker\pauldron.PNG', 'honing')
linked['Armor'] = Action(r'\\wsl$\Ubuntu-22.04\home\mvpee\progress\HRMVP\worker\armor.PNG', 'honing')
linked['Gem'] = Action(None, 'gem')

message_queue = queue.Queue()

def handle_action(data):
    ##optimize the checking for cv, right now there's no real error handling/state

    action = linked[data['name']].type   
    
    if 'twitch' in data:
        user = data['twitch']['display_name']        
        print(f'User : {user} is attempting an action of : {action}')
    if action == 'honing':        
        time.sleep(1)
        state_check = pyautogui.locateOnScreen(linked['State'].image, confidence=.7)
        if state_check:
            pyautogui.press('G')
            time.sleep(1)
        locate = pyautogui.locateCenterOnScreen(linked[data['name']].image, confidence=.8)
        if locate:
            pyautogui.moveTo(locate, duration=.5)
            pyautogui.click()
            pyautogui.moveTo(10, 10, duration=.5)
            #initiate check on if you can hone this item, if you cant, add shards.
            honing_ready = pyautogui.locateCenterOnScreen(linked['Honing_100'].image, confidence=.75)#high confidence to account for lit/dim
            if not honing_ready:
                print('Initiate filling of aura.')
                images = [linked['Honing_upgrade'].image, linked['Honing_max'].image, linked['Honing_max_upgrade'].image]
                for i in images:
                    finder = pyautogui.locateOnScreen(i, confidence=.8)
                    if finder:
                        pyautogui.moveTo(finder, duration=.5)
                        pyautogui.click()
                        time.sleep(.5)
                    else:
                        pyautogui.press('ESC') #something happened. cancel all.
                        time.sleep(.25)                        
                        pyautogui.press('ESC')
                        break
            next_sequence = [linked['Honing_start'], linked['Honing_start'], linked['Honing_results']]
            for n in next_sequence:
                check = pyautogui.locateOnScreen(n.image, confidence=.75)
                if check:
                    pyautogui.moveTo(check, duration=.5)
                    pyautogui.click()
                    time.sleep(.5)
                    if n.type == 'results':
                        done = pyautogui.locateOnScreen(linked['Honing_done'].image, confidence=.65)
                        while not done:
                            time.sleep(2)
                            done = pyautogui.locateOnScreen(linked['Honing_done'].image, confidence=.65)
                        if done:
                            pyautogui.moveTo(done, duration=.5)
                            pyautogui.click()
                            sio.emit('actions', {'message': 'Honing completed.'})
                else:
                    pyautogui.press('ESC') #something happened. cancel all.
                    time.sleep(.25)                        
                    pyautogui.press('ESC')
                    break
    elif action == 'gem':
        print('This user tried to do gem fusion.')
        time.sleep(1)
        state_check = pyautogui.locateOnScreen(linked['State'].image, confidence=.7)
        if not state_check:
            pyautogui.press('esc')
            time.sleep(1)
        #check if inv is open
        inv_check = pyautogui.locateOnScreen(linked['Inventory'].image, confidence=.7)
        if not inv_check:
            pyautogui.press('I')
            time.sleep(1)
        diamond = pyautogui.locateOnScreen(linked['Diamond'].image, confidence=.7)
        if diamond:
            pyautogui.moveTo(diamond, duration=1)
            pyautogui.click()
            time.sleep(1)
        gems = [linked['atkgem'].image, linked['cdrgem'].image, linked['cdrgem'].image]
        for i in range(3):
            gem = pyautogui.locateCenterOnScreen(gems[i], confidence=.8)
            if gem:
                pyautogui.moveTo(gem, duration=.25)
                pyautogui.click(button='right')
                time.sleep(.25)
        fusion = pyautogui.locateCenterOnScreen(linked['fusebutton'].image, confidence=.7)
        if fusion:
            pyautogui.moveTo(fusion, duration=.25)
            pyautogui.click()
            time.sleep(.5)
        finish = pyautogui.locateCenterOnScreen(linked['fusefinish'].image, confidence=.7)
        if finish:
            pyautogui.moveTo(finish, duration=.25)
            pyautogui.click()
            time.sleep(.5)

                





@sio.on('connect')
def on_connect():
    print('Connected to the Server.')
    sio.emit('whoami', {'name':'workerboi'})
    

def message_consumer():
    while True:
        message = message_queue.get()
        handle_action(message)
        message_queue.task_done()
@sio.on('message')
def on_message_from_server(data):    
    switch_scene('HR')
    print('Message to process : ', data)
    message_queue.put(data)

@sio.on('initializer')
def on_initializer(data):
    print('Intilization data : ', data)

@sio.on('disconnect')
def on_disconnect():
    print('disconnected')

sio.connect(os.getenv('AWS_SERVER'))

try:
    consumer_thread = threading.Thread(target=message_consumer)
    consumer_thread.daemon = True
    consumer_thread.start()
    while True:
        time.sleep(1)
        pass

except KeyboardInterrupt as error:
    print('Exiting gracefully...')
    sio.disconnect() 
    sys.exit(0)
