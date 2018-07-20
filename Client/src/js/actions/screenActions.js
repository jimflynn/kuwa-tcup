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

export function toggleDropdown(componentName, dropdownName) {
    return {
        type: 'TOOGLE_DROPDOWN',
        payload: {
            componentName,
            dropdownName
        }
    }
}