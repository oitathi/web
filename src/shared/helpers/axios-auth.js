import axios from 'axios'
import {
    COOKIE_USER_ID,
    COOKIE_USER_TOKEN,
    SYSTEM
} from './parameters'
import { getCookie } from './cookie'

const config = require('config');
const axiosAuth = axios.create()
const URL_LOGIN = `${config.endpoint['b2w-login']}#?app=${SYSTEM}`

console.log("URL_LOGIN", URL_LOGIN)

axiosAuth.interceptors.request.use((config) => {
    const userId = getCookie(COOKIE_USER_ID)
    const userToken = getCookie(COOKIE_USER_TOKEN)

    if ((!userId || !userToken) && typeof window !== 'undefined') {
        const href = window.location.href
        window.location.assign(`${URL_LOGIN}&redirect=${encodeURIComponent(href)}`)
    }

    return Promise.resolve(config)
}, (error) => {
    return Promise.reject(error)
})

axiosAuth.interceptors.response.use((response) => {
    return response;
}, (error) => {
    const promise = Promise.reject(error)

    if (error.response && (error.response.status === 403 || error.response.status === 401)) {
        if (typeof window !== 'undefined') {
            const href = window.location.href
            window.location.assign(`${URL_LOGIN}&redirect=${encodeURIComponent(href)}`)
        }
    }
    return promise;
})

export default axiosAuth