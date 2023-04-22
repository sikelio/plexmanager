export const sessionTitle = (session) => {
    if (session.type === 'episode') {
        return `${session.originalTitle} - ${session.title}`;
    }

    return session.originalTitle;
}

export const historyTitle = (session) => {
    if (session.type === 'episode') {
        return `${session.grandparentTitle} - ${session.title}`;
    }

    return session.title;
}

export const getDeviceIcon = (device) => {
    let icon;

    switch (device) {
        case 'Firefox':
            icon = require('../assets/icons/firefox.png');
            break;
        case 'windows':
        case 'Windows':
            icon = require('../assets/icons/windows.png');
            break;
        case 'Microsoft Edge':
            icon = require('../assets/icons/edge.png');
            break;
        case 'Linux':
            icon = require('../assets/icons/linux.png');
            break;
        case 'iOS':
            icon = require('../assets/icons/apple.png');
            break;
        case 'Chrome':
            icon = require('../assets/icons/chrome.png');
            break;
        case 'Android':
            icon = require('../assets/icons/android.png');
            break;
        case 'Safari':
            icon = require('../assets/icons/safari.png');
            break;
        case 'Opera':
            icon = require('../assets/icons/opera.png');
            break;
        case 'Chromecast':
            icon = require('../assets/icons/chromecast.png')
            break;
        case 'Xbox':
            icon = require('../assets/icons/xbox.png')
            break;
        default:
            icon = require('../assets/icons/unknown.png');
            break;
    }

    return icon;
}

export const getHistoryUser = (session, users) => {
    let sessionUser = users.filter((user) => {
        return session.accountID === user.id;
    });

    return sessionUser[0].name;
}

export const getPreferenceLabel = (preference) => {
    if (!preference.label) {
        return preference.id;
    }

    return preference.label;
}

export const getPreferenceGroupName = (preference) => {
    if (!preference.group) {
        return 'none';
    }

    return preference.group;
}

export const getPreferenceValue = (preference) => {
    if (!preference.value) {
        return 'none';
    }

    return preference.value.toString();
}

export const getPreferenceSummary = (preference) => {
    if (!preference.summary) {
        return 'none';
    }

    return preference.summary;
}
