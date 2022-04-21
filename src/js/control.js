import * as model from './model.js';
import CountDownView from './view/countDownView.js';
import CountUpView from './view/countUpView.js';
import EventView from './view/eventView.js';
import BackgroundView from './view/backgroundView.js';

const getFestivalDataControl = async function () {
    const newTime = model.initCurDate();
    const date = await model.getFestivalDate();
    const nextFestivals = model.getTargetFestivals(newTime,date);
    console.log(nextFestivals);
    return nextFestivals;
}

const getRandomImage = async function (targetFestival) {
    const targetFestivalImage = model.getRandomTargetImage(targetFestival);
    return targetFestivalImage;
}

const CountDownViewTypes = function (dateDigit, type) {
    const digitsArr = [...CountDownView._digitsArr];
    const digit = dateDigit;
    digitsArr.push(digit + 1);
    digitsArr.push(digit);
    if (type !== 'hours' && type !== 'days')
    digitsArr.push(digit - 1 < 0 ? 59: digit - 1);
    else if (type === 'hours')
    digitsArr.push(digit - 1 < 0 ? 23: digit - 1);
    else if (type === 'days')
    digitsArr.push(digit - 1 < 0 ? 364: digit - 1);

    let length = 0;
    digitsArr.forEach ((digit) => {
        const digitArr = CountDownView._splitDigit(digit).reverse();
        if(type === 'days') length = 3;
        else if (length < digitArr.length) length = digitArr.length;

        if(length < 2 ) length = 2;
        // Position safe guard ^
        for (let i = 0 ; i < length; i++) {
            const digitPos = CountDownView._positions[i];
            CountDownView._initDigitCol(digitPos, +digitArr[i], type);
        }
    })


    CountDownView._resetPositions();
    // console.log(CountDownView._positions);
    // Counter animations
    const timer = model.getTimer() * 1010;

    if (type === 'secs') {
        setInterval(
            () => {
                CountDownView._pushDigits(type);
            }, timer
        );
    }
    else return;

}

const CountDownViewControl = function (targetFestival) {
    const targetDate = model.initTargetDate (targetFestival);
    // CountDownViewTypes(5, 'secs');
    // CountDownViewTypes(0, 'mins');
    // CountDownViewTypes(0, 'hours');
    // CountDownViewTypes(100, 'days');
    CountDownViewTypes(+model.curTime.time.sec, 'secs');
    CountDownViewTypes(+model.curTime.time.min - 1, 'mins');
    CountDownViewTypes(model.curTime.time.hour - 1, 'hours');
    CountDownViewTypes(model.getDaynr(targetDate) - 1, 'days');

}

const EventViewControl = function (targetFestival) {
    EventView._nextEvent(targetFestival);
}

const BackgroundViewControl = function (festivalImage) {
    BackgroundView._newImage(festivalImage);
}

const init = async function () {
    const targetFestival = await getFestivalDataControl();
    const festivalImage = await getRandomImage (targetFestival.name);
    BackgroundViewControl(festivalImage);
    CountDownViewControl(targetFestival);
    EventViewControl(targetFestival);
}

init ();
