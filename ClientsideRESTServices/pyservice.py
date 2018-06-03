from flask import Flask
from flask import request
import json
import os, errno
app = Flask(__name__)
import pathlib
import config as cfg


@app.route('/')
def hello_world():
    return 'Hello World!'

@app.route('/StoreRegistrationRequestService', methods = ['GET','POST'])
def storeRegistrationRequest():
        addr = request.json
        wallet_address = addr['wallet_address']
        pathlib.Path(cfg.dir_path + wallet_address).mkdir(parents=True, exist_ok=True)

        return json.dumps('Registration successful')


@app.route('/ValidateSecretKeyService', methods = ['GET','POST'])
def validateSecretKey():

    res = request.json
    secretKeyInputByUser = res['secret_key']
    print(secretKeyInputByUser)
    if(secretKeyInputByUser == cfg.shared_secret):
        print('correct')
        return 'correct'
    else:
        print('wrong')
        return 'wrong'



if __name__ == '__main__':
    app.run()
