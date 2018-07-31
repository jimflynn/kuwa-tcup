export function toggleKuwaPasswordVisibility() {
    return {
        type: 'TOGGLE_KUWA_PASSWORD_VISIBILITY'
    }
}

export function togglePasscodeVisibility() {
    return {
        type: 'TOGGLE_PASSCODE_VISIBILITY'
    }
}

export function toggleDropdown(linkName) {
    return {
        type: 'TOOGLE_DROPDOWN',
        payload: {
            linkName
        }
    }
}

export function toggleCollapse(screenName) {
    return {
        type: 'TOGGLE_COLLAPSE',
        payload: {
            screenName
        }
    }
}

export function toggleDrawer() {
    return {
        type: 'TOGGLE_DRAWER'
    }
}