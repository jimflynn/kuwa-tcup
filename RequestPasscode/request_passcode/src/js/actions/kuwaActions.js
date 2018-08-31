import axios from 'axios';

/**
 * the function that makes the Post request to the backend API at the sponsor for requesting a passcode.
 * @param  {string} fullName
 * @param  {string} email    
 */
export function requestPasscode(fullName, email) {
    let userData = new FormData();
    userData.append('fullName', fullName);
    userData.append('email', email);
    axios.post('/request_passcode', userData)
         .then(res => {
          console.log(res.data);
        })


}

