import cookie from "react-cookies"

export const saveCookie = (key, value) => {
	const hostname  = window.location.hostname
	let part        = hostname.split(".");
	const totalPart = (NODE_ENV === DEVELOPMENT ? 4 : 3);

	part.splice(0, part.length - totalPart);

	const partString  = part.toString();
	const domain      = partString.replace(/,/g, ".");

	cookie.save(key, value, {path: "/"})
}

export const getCookie = (key) => {
	return cookie.load(key);
}

export const removeCookie = (userId, userToken) => {	
	const config = {
		path: "/", 
		domain: ".atlas.b2w"
	}

	cookie.remove(userId, config);
	cookie.remove(userToken, config);

	return null;
}
