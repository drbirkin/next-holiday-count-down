import { API_URL, UNSPLASH_URL, ACCESS_KEY} from "./config.js";
import { getfetchData, randomNumber } from "./helper.js";
import * as dayjs from 'dayjs';
// dayjs().format();

export const curTime = {
    date : {
        year : 0,
        month : 0,
        day : 0
    },

    time : {
        hour : 0,
        min: 0,
        sec: 0,
    }
}

export const targetEvent = {
    date: {
        month : 0,
        day : 0
    }
}

export const getFestivalDate = async function () {
    const data = await getfetchData(API_URL);
    return data;
}

export const getRandomTargetImage = async function (query) {
    const data = await getfetchData(`${UNSPLASH_URL}/search/photos?page=1&query=${query}&client_id=${ACCESS_KEY}`);
    const newIndex = randomNumber(data.results.length);
    return data.results[newIndex];
}

export const getTargetFestivals = function (curDate, data) {
    return data.find((event) => {
        const date = event.date.split('-');
        const day = +date[2];
        const month = +date[1];
        // targetEvent.date.month = month;
        // targetEvent.date.day = day;
        return day > curDate.date.day && month >= curDate.date.month;
    });
}

export const initTargetDate = function (targetFestival) {
    const targetEvent = targetFestival;
    const dateArr = targetEvent.date.split('-');
    return {
        date : {
            month : +dateArr[1],
            day : +dateArr[2],
            fulldate : targetFestival.date,
        }
    }
}

export const getTimer = function () {
    // if (type === 'days') return 4;
    // if (type === 'hours') return 4.5;
    // if (type === 'mins') return 3.2;
    // if (type === 'secs') return 1;
    return 1;
}

export const getDaynr = function (targetFestival) {
    //  console.log(dayjs(targetFestival.fulldate).daysInMonth(), dayjs('2022-06-15').diff(`${curTime.date.year}-${curTime.date.month}-${curTime.date.day}`, 'day'));
    // const targetDate = dayjs(targetFestival.fulldate);
    // console.log(targetDate.diff(`${curTime.date.year}-${curTime.date.month}-${curTime.date.day}`, 'day'));
    if(targetFestival.month - curTime.date.month > 1) {
        const targetDate = dayjs(targetFestival.fulldate);
        return targetDate.diff(`${curTime.date.year}-${curTime.date.month}-${curTime.date.day}`, 'day');
    }
    else
     return targetFestival.date.day - curTime.date.day;
}

export const initCurDate = function () {
    const today = new Date ();
    // const newTime = JSON.parse(JSON.stringify(curTime));
    curTime.date.year = +today.getFullYear();
    curTime.date.month = +today.getMonth() + 1;
    curTime.date.day = +today.getDate();
    curTime.time.hour = 24 - +today.getHours();
    curTime.time.min = 60 - +today.getMinutes();
    curTime.time.sec = 60 - +today.getSeconds();

    // return newTime;
    return curTime;
}
