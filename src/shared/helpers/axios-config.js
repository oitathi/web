import { getCookie } from '../helpers/cookie';

import {
    COOKIE_USER_ID,
    COOKIE_USER_TOKEN,
    API_KEY,
    SYSTEM
} from './parameters';

export const getConfig = (params, contentType) => {
    const userId = getCookie(COOKIE_USER_ID);
    const userToken = getCookie(COOKIE_USER_TOKEN);
    if (contentType == null || contentType == '') contentType = 'application/json; charset=utf-8';

    return {
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Basic ' + API_KEY,
            'X-B2W-UserId': userId,
            'X-b2w-token': userToken,
            'X-B2W-System': SYSTEM,
            'Content-Type': contentType
        },
        params: params
    }
}

export const getConfigBlob = (params, contentType) => {
    const userId = getCookie(COOKIE_USER_ID);
    const userToken = getCookie(COOKIE_USER_TOKEN);
    if (contentType == null || contentType == '') contentType = 'application/json';

    return {
        headers: {
            'Authorization': 'Basic ' + API_KEY,
            'X-B2W-UserId': userId,
            'X-b2w-token': userToken,
            'X-B2W-System': SYSTEM,
            'Content-Type': contentType
        },
        responseType: 'arraybuffer',
        params: params, 
        timeout: 180000
    }
}