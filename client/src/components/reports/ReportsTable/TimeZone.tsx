export const getTimezoneFromOffset = (offset: number) => {
    const timezones = {
        '-720': 'Etc/GMT+12',
        '-660': 'Pacific/Pago_Pago',
        '-600': 'Pacific/Honolulu',
        '-570': 'Pacific/Marquesas',
        '-540': 'Pacific/Gambier',
        '-480': 'America/Anchorage',
        '-420': 'America/Los_Angeles',
        '-360': 'America/Denver',
        '-300': 'America/Chicago',
        '-240': 'America/New_York',
        '-210': 'America/Caracas',
        '-180': 'America/Argentina/Buenos_Aires',
        '-120': 'America/Noronha',
        '-60': 'Atlantic/Azores',
        '0': 'Etc/UTC',
        '60': 'Europe/London',
        '120': 'Europe/Paris',
        '180': 'Europe/Moscow',
        '210': 'Asia/Tehran',
        '240': 'Asia/Dubai',
        '270': 'Asia/Kabul',
        '300': 'Asia/Karachi',
        '330': 'Asia/Kolkata',
        '345': 'Asia/Kathmandu',
        '360': 'Asia/Dhaka',
        '390': 'Asia/Yangon',
        '420': 'Asia/Bangkok',
        '480': 'Asia/Shanghai',
        '525': 'Australia/Eucla',
        '540': 'Asia/Tokyo',
        '570': 'Australia/Darwin',
        '600': 'Australia/Brisbane',
        '630': 'Australia/Adelaide',
        '660': 'Australia/Sydney',
        '690': 'Pacific/Norfolk',
        '720': 'Pacific/Auckland',
        '765': 'Pacific/Chatham',
        '780': 'Pacific/Apia',
    };
    const offsetString = offset.toString();

    return timezones[offsetString as keyof typeof timezones];
    // return timezones[offsetString] || '';
}
