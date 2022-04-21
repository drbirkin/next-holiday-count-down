export const getfetchData = async function (url) {
    try {
        const res  = await fetch(url);
        const data = await res.json();
        if(!res.ok) throw new Error (`${data.message} (${res.status})`);

        return data;
    }
    catch (err) {
        throw err;
    }
}

export const timer = function (time_out, ...handler) {
    setTimeout (async () => {
        handler.forEach(callback => callback());
    }, time_out);
}

export const randomNumber = function (max) {
    return Math.floor(Math.random() * max);
}