import { getCookie } from '../helpers/cookie';
import { COOKIE_USER_ID } from '../helpers/parameters';

/**
 * Verifica se o usuario é proibido a partir da lista forbiddenUsers
 */
export const isForbidden = () => {
    let loggedUser = getCookie(COOKIE_USER_ID);
    let forbiddenUsers = ["AMANDA.SANTANA"];

    if (forbiddenUsers.filter(user => loggedUser == user) != "") {
        return true;
    } else {
        return false;
    }

}
