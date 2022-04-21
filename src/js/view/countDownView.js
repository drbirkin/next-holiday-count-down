import {timer} from '../helper.js';

class CountDownView {
    _parentElement = document.querySelector('.counters');
    _positions = [{'one': true}, {'ten': false}, {'hundred': false}];
    _types = {'secs': true, 'mins': false, 'hours': false, 'days': false};
    _digitsArr = [];
    _countDowns = {
        'digits' : {
            'targetDigits' : {
                'targetUpperDigit' : '',
                'targetMiddleDigit' : '',
                'targetBottomDigit' : '',
            },
            'firstDigits' : {
                'firstBottomDigit' : '',
            },
            'nextDigits' : {
                'nextUpperDigit' : '',
                'nextMiddleDigit' : '',
                'nextBottomDigit' : '',
            },
            'lastDigits' : {
                'lastUpperDigit' : '',
                'lastMiddleDigit' : '',
                'lastBottomDigit' : '',
            }
        },

        'positions' : {
            'cols': {
                'firstCol' : '',
                'nextCol' : '',
                'lastCol' : '',
            },
            'pos': {
                'firstPos' : '',
                'curPos' : '',
                'nextPos' : ''
            }
        }
    };

    #createDigit (nr) {
        const digit = document.createElement('p');
        // if(!nr) digit.textContent = '0';
        digit.textContent = nr;
        return digit;
    }

    #insertDigit (targetEl, nr, position) {
        targetEl.insertAdjacentElement(`${position}`, this.#createDigit(nr));
    }

    #deleteDigit (digit) {
        digit.removeChild(digit.firstElementChild);
    }

    #animateDigit (targetPos, digit, firstContent) {

        targetPos.children[1].classList.add('first');
        // targetPos.children[2].classList.add('last');

        if(firstContent) {

            firstContent.style.opacity = '0';
            firstContent.style.fontSize = '2rem';
            firstContent.style.transform = 'translateY(-100%)'
            firstContent.style.height = '0%';
            // timer(0, ()=>{
            //     firstContent.style.transform = 'translateY(-100%)'
            //     firstContent.style.height = '0%';
            // });
        }
        timer(990, this.#deleteDigit.bind(this, targetPos));
        timer(550, this.#insertDigit.bind(this, targetPos, digit, 'beforeend'), this._transformY.bind(this, targetPos.lastElementChild, '-100%', 100));

    }

    #getValues () {

        const {
            digits : {
                targetDigits : {
                    targetUpperDigit,
                    targetMiddleDigit,
                    targetBottomDigit
                },
                firstDigits : {
                    firstBottomDigit
                },
                nextDigits : {
                    nextUpperDigit,
                    nextMiddleDigit,
                    nextBottomDigit
                },
                lastDigits : {
                    lastUpperDigit,
                    lastMiddleDigit,
                    lastBottomDigit
                }
            },
            positions : {
                cols: {
                    firstCol,
                    nextCol,
                    lastCol
                },
                pos: {
                    firstPos,
                    curPos,
                    nextPos
                }
            }

        } = this._countDowns;

        return {
            firstBottomDigit,
            targetUpperDigit, targetMiddleDigit, targetBottomDigit,
            nextUpperDigit, nextMiddleDigit, nextBottomDigit,
            lastUpperDigit, lastMiddleDigit, lastBottomDigit,
            firstCol, nextCol, lastCol,
            firstPos, curPos, nextPos
        }
    }

    /***
     * value ... html element
     * 1 position moving
     * 2 position moving
     * 3 position moving
     */
    #digitUpdate (targetCol, targetTag, targetValue, type) { //Rename targetCol to targetCol, value to targetTag
        const counter = this.#getValues();

        if (!counter.nextPos) return;
        const firstContent = counter.nextCol.firstElementChild;

        if (targetTag.textContent === Object.values(targetCol.firstElementChild.textContent)[0])

        {

            let digits;
            let verify;
            if (counter.lastCol.children.length === 0)
                if(type === 'hours') digits = 23;
                else {
                    digits = 59;
                    verify = this.#resetDigits (firstContent, counter, targetCol, targetTag, digits, type);
                    // console.log(verify);
                }
            else if (counter.lastCol.children.length !== 0) {
                    digits = 364;
                    verify = this.#resetDigits (firstContent, counter, targetCol, targetTag, digits, type);
            }

            if(verify) return;

            /**
             * next type move
             */
            if (counter.targetMiddleDigit === 0 && counter.nextMiddleDigit === 0 && type !== 'days') {
                const typeIndex = Object.keys(this._types).findIndex((elem) => elem === `${type}` );
                if(typeIndex === 3) return 1;

                this._pushDigits(Object.keys(this._types)[typeIndex + 1]);
            }

            /**
             * ten animations
             * upper 0
             * middle 0
             * 2 cases check
             */
            if((counter.targetUpperDigit === 0 || counter.targetMiddleDigit === 0 ) && counter.nextPos === 'ten') {

                this.#animateDigit(counter.nextCol, counter.nextBottomDigit, firstContent);

            }

            /**
             * ten animations:
             * bottom 0
             * 1 case check
             */
            if ((counter.targetBottomDigit === 0 ) && counter.nextPos === 'ten') {
                // console.log('next column:', nextCol, nextPos, counter.nextBottomDigit);
                this.#animateDigit(counter.nextCol, counter.nextBottomDigit - 1 < 0? 9 : counter.nextBottomDigit - 1 , firstContent);

            }

            /**
             * hundred animations:
             * upper 00
             * middle 00
             * 2 cases check
             */
            if(((counter.targetUpperDigit === 0 && counter.nextUpperDigit === 0) || (counter.targetMiddleDigit === 0 && counter.nextMiddleDigit === 0)) && counter.nextPos === 'ten') {
                if(counter.lastCol.children.length !==0) {
                    this.#animateDigit(counter.lastCol, counter.lastBottomDigit, counter.lastCol.firstElementChild);
                }

            }

            /**
             * hundred animations:
             * lower 00
             * 1 case check
             */
            // if(type !== 'secs') console.log(type);
            if((counter.targetBottomDigit === 0 && counter.nextBottomDigit === 0) && counter.nextPos === 'ten') {
                if(counter.lastCol.children.length !==0) {
                    this.#animateDigit(counter.lastCol, counter.lastBottomDigit-1 < 0 ? 0:  counter.lastBottomDigit-1, counter.lastCol.firstElementChild);
                }

            }

            /**
             * one animations
             */

            if (counter.curPos === 'one') {
                // if(type !== 'secs') console.log('target', targetCol);
                this.#animateDigit(targetCol, targetValue !== 0?targetValue-1:9, targetTag);
            }
        }
    }

    #resetDigits (firstContent, counter, targetPos, value, digits, type) {
        /** reset all digits
                 * once 0 restart
                 * bottom 000
                 * 1 case check
                 */
         const digitArr = this._splitDigit(digits).reverse();
        //  console.log(digitArr);
         if (digitArr.length === 2) return this.#resetOneDigit (counter, digitArr, firstContent, targetPos, value)
         else if (digitArr.length === 3) return this.#resetTenDigit (counter, digitArr, firstContent, targetPos, value);
         else return 1;

    }


    #resetOneDigit (counter, digitArr, firstContent, targetPos, value) {
        if ((counter.targetBottomDigit === 0 && counter.nextBottomDigit === 0 ) && counter.curPos === 'one') {
            this.#animateDigit(targetPos, +digitArr[0], value);
            this.#animateDigit(counter.nextCol, +digitArr[1], firstContent);
            return 1;

        }
    }


    #resetTenDigit (counter, digitArr, firstContent, targetPos, value) {
        if ((counter.targetBottomDigit === 0 && counter.nextBottomDigit === 0 && counter.lastBottomDigit === 0 ) && counter.curPos === 'one') {
            this.#animateDigit(targetPos, +digitArr[0], value);
            this.#animateDigit(counter.nextCol, +digitArr[1], firstContent);
            this.#animateDigit(counter.lastCol, +digitArr[2], counter.lastCol.firstElementChild);
            return 1;
        }

    }

    _resetPositions () {
        this._positions.forEach((pos, index) => {

            const keys = Object.keys(this._positions[index]);

            pos[keys] = false;

            if (index === 0) {
                pos[keys] = true;
            }

        });

    }

    _transformY (targetEl, offsetY, time_out) {
        return new Promise ((resolve) => {
            setTimeout(() => {
                targetEl.style.transform = `translateY(${offsetY}%)`;
                resolve();
            }, time_out);
        });
    };

    _pushDigits (type) {
        const curPositions = JSON.parse(JSON.stringify(this._positions));
        // if (type !== 'secs')
        // console.log(type);
        curPositions.forEach((pos, index) => {
            const targetPos = this._parentElement.querySelector(`.${type}`).querySelector(`.${Object.keys(pos)}`); // Select current column
            if (targetPos.children.length === 0) return;
            // Position safe guard ^
            let targetValue = +Object.values(targetPos.children[2].textContent)[0]; // last digit of column
            for ( const [_,value] of Object.entries(targetPos.children)) { //get html elements (p tag)
                // console.log(value);
                if (Object.entries(targetPos.children).length !== 0) {
                    this._initDigits(curPositions, targetPos, index, type);
                    this.#digitUpdate(targetPos, value, targetValue, type);
                }
            }


        });

    };

    _initDigitCol (target,nr, type) {
        const position = Object.keys(target);
        const targetEl = this._parentElement.querySelector(`.${type}`).querySelector(`.${position}`);
        // const positions = JSON.parse(JSON.stringify(this._positions));
        // let posState  = Object.values(this._positions[index])[0];

        if (!nr) nr = 0;
        targetEl.appendChild(this.#createDigit(nr));

    }

    _initDigits (curPos, targetPos, index, type) {
        // index safeguard
        if (!curPos[index + 1]) return;
        this._countDowns.positions.cols.firstCol = this._parentElement.querySelector(`.${type}`).querySelector(`.${Object.keys(this._positions[0])}`);
        this._countDowns.positions.cols.nextCol = this._parentElement.querySelector(`.${type}`).querySelector(`.${Object.keys(this._positions[index+1])}`);
        this._countDowns.positions.cols.lastCol = this._parentElement.querySelector(`.${type}`).querySelector(`.${Object.keys(this._positions[2])}`);
        const {
            positions : {
                cols : {
                    firstCol,
                    nextCol,
                    lastCol
                }
            }
        } = this._countDowns;

        this._countDowns.digits.targetDigits.targetUpperDigit = +targetPos.children[0].textContent;
        this._countDowns.digits.nextDigits.nextUpperDigit = +nextCol.children.length !==0?+nextCol.children[0].textContent:'';
        this._countDowns.digits.lastDigits.lastUpperDigit = +lastCol.children.length !==0?+lastCol.children[0].textContent:'';
        this._countDowns.digits.targetDigits.targetMiddleDigit = +targetPos.children[1].textContent;
        this._countDowns.digits.nextDigits.nextMiddleDigit = +nextCol.children.length !==0?+nextCol.children[1].textContent:'';
        this._countDowns.digits.lastDigits.lastMiddleDigit = +lastCol.children.length !==0?+lastCol.children[1].textContent:'';
        this._countDowns.digits.targetDigits.targetBottomDigit = +targetPos.children[2].textContent;
        this._countDowns.digits.firstDigits.firstBottomDigit = +firstCol.children.length !==0 ? +firstCol.children[2].textContent:'';
        this._countDowns.digits.nextDigits.nextBottomDigit = +nextCol.children.length !==0?+nextCol.children[2].textContent:'';
        this._countDowns.digits.lastDigits.lastBottomDigit = +lastCol.children.length !==0?+lastCol.children[2].textContent:'';

        this._countDowns.positions.pos.curPos= Object.keys(curPos[index])[0]; // get position
        this._countDowns.positions.pos.nextPos= curPos[index + 1] ? Object.keys(curPos[index + 1])[0]: ''; // get position: ;

    }

    _splitDigit (nr) {
        const digitArr = nr.toString().split('');

        return digitArr;
    }

}

export default new CountDownView ();