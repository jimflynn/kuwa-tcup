import { 
    TOGGLE_COLLAPSE,
    TOGGLE_PASSWORD_VISIBILITY
 } from './types';

export function toggleCollapse(screenName) {
    return {
        type: TOGGLE_COLLAPSE,
        payload: screenName
    }
}

export function togglePasswordVisibility(screenName) {
    return {
        type: TOGGLE_PASSWORD_VISIBILITY,
        payload: screenName
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