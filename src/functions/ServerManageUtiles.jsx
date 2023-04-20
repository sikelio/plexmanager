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
            icon = 'firefox';
            break;
        case 'windows':
        case 'Windows':
            icon = 'windows';
            break;
        case 'Microsoft Edge':
            icon = 'edge';
            break;
        case 'Linux':
            icon = 'linux';
            break;
        case 'iOS':
            icon = 'apple';
            break;
        case 'Chrome':
            icon = 'chrome';
            break;
        case 'Android':
            icon = 'android';
            break;
        case 'Safari':
            icon = 'safari';
            break;
        case 'Opera':
            icon = 'opera';
            break;
        default:
            icon = 'question';
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
