export const sessionTitle = (session) => {
    if (session.type === 'episode') {
        return `${session.originalTitle} - ${session.title}`;
    }

    return session.originalTitle;
}
