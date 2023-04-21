export const getCountryFlag = (countryCode) => {
    let url;

    switch (countryCode) {
        case 'ko':
            url = `https://flagcdn.com/16x12/kr.png`;
            break;
        default:
            url = `https://flagcdn.com/16x12/${countryCode}.png`;
            break;
    }

    return url;
};
