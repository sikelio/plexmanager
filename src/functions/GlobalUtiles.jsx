export const timestampParser = (timestamp) => {
    const date = new Date(timestamp * 1000);

    return `${("0" + date.getDate()).slice(-2)}/${("0" + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
}
