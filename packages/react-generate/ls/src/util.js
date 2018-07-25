import {fetchAPI, fetchForm} from 'shared/fetch'
import {login} from 'shared/login'

export const getSearch = (search) => {
    search = search.slice(1);
    const query = {};

    search.split('&').forEach((value) => {
        const pair = value.split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
    });

    return query;
}

export function formatNumber (number) {
    if (number < 10000) {
        return number
    } else {
        return Math.floor(number / 1000) / 10 + 'W'
    }
}

let userInfoPromise = null

export function isLogin (force = false) {
    if (!userInfoPromise || force) {
        userInfoPromise = login().then(() => fetchAPI('/user/info.json', {}, 'GET'))
        .then((resp) => {
            if (resp.error) {
                throw resp.error;
            }
            if (resp.user.userId) {
                return resp.user
            } else {
                throw new Error()
            }
        }).catch(err => {
            userInfoPromise = null
            throw err
        })
    }

    return userInfoPromise
}


export function getSupportValue () {
    return fetchAPI('/doubleeggs/relieve/supportvalue', {}, 'GET')
        .then(res => res)
}

export function hasLetter (idol) {
    return fetchAPI('/doubleeggs/relieve/letter', {idol}, 'GET').then(res => {
        if (res.code === 200) {
            return res
        } else {
            throw new Error(res.msg)
        }
    })
}
