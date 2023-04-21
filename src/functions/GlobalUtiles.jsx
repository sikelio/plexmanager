export const getDateFromTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000);

    return `${("0" + date.getDate()).slice(-2)}/${("0" + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
}

export const getTimeFromTimestamp = (timestamp) => {
    const date = new Date(timestamp);

    return `${("0" + date.getHours()).slice(-2)}:${("0" + date.getMinutes()).slice(-2)}:${("0" + date.getSeconds()).slice(-2)}`;
}
