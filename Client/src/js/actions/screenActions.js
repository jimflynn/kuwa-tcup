/**
 * Toggles the visibility of the kuwa password in the Client
 * @export
 * @return {void}
 */
export function toggleKuwaPasswordVisibility() {
    return {
        type: 'TOGGLE_KUWA_PASSWORD_VISIBILITY'
    }
}

/**
 * Toggles the visibility of the passcode provided by the Sponsor in the Client
 * @export
 * @return {void}
 */
export function togglePasscodeVisibility() {
    return {
        type: 'TOGGLE_PASSCODE_VISIBILITY'
    }
}

/**
 * Toggles any dropdown in the navigation bar that has the passed linkName
 * @export
 * @param  {String} linkName 
 * @return {void}
 */
export function toggleDropdown(linkName) {
    return {
        type: 'TOOGLE_DROPDOWN',
        payload: {
            linkName
        }
    }
}

/**
 * When the web client is displayed in a small screen (i.e. mobile phone, not the cordova app)
 * this function shows and hides the navigation bar as a drawer
 * @export
 * @return 
 */
export function toggleDrawer() {
    return {
        type: 'TOGGLE_DRAWER'
    }
}

/**
 * Toggles the visibility of the screen that serves to restore the state when the user introduces
 * his Kuwa Password when the application first loads and if there is a Custom Wallet in the
 * phone. This action is also dispatched when a Wallet is loaded from the Client.
 * @export
 * @return {void}
 */
export function toggleRestoreState() {
    return {
        type: 'TOGGLE_RESTORE_STATE'
    }
}