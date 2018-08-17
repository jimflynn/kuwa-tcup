import axios from 'axios';

export function requestPasscode(fullName, email) {
    let userData = new FormData();
    userData.append('fullName', fullName);
    userData.append('email', email);
    axios.post('/request_passcode', userData)
         .then(res => {
          console.log(res.data);
        })


}

