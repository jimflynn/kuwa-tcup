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

export function toggleDropdown(dropdownName) {
    return {
        type: 'TOOGLE_DROPDOWN',
        payload: {
            dropdownName
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