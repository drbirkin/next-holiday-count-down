import {timer} from '../helper.js';

class CountDownView {
    _parentElement = document.querySelector('.counters');
    _positions = [{'one': true}, {'ten': false}, {'hundred': false}];
    // _checker = false;

    #createDigit (nr) {
        const digit = document.createElement('p');
        digit.textContent = nr;
        return digit;
    }

    #insertDigit (targetEl, nr, position) {
        targetEl.insertAdjacentElement(`${position}`, this.#createDigit(nr));
    }

    #deleteDigit (digit) {
        digit.removeChild(digit.lastElementChild);
    }

    #animateDigit (targetPos, digit, lastContent) {

        targetPos.children[1].classList.add('last');
        if(lastContent) {
            lastContent.style.height = '0%';
        }
        timer(990, this.#deleteDigit.bind(this, targetPos));
        timer(550, this.#insertDigit.bind(this, targetPos, digit, 'afterbegin'), this._transformY.bind(this, targetPos.firstElementChild, '-100%', 100));
    }


    /***
     * TODO:
     * 1 position moving
     * 2 position moving
     * 3 position moving
     */
    #digitUpdate (targetPos, value, targetValue, curPos, index) {
        const position = Object.keys(curPos[index])[0]; // get position
        if (!curPos[index + 1]) return;
        const nextPos = Object.keys(curPos[index+1])[0]; // get position
        // console.log(position, nextPos, value);
        if (value.textContent === Object.values(targetPos.lastElementChild.textContent)[0] )
        {
            const nextCol = this._parentElement.querySelector(`.${Object.keys(this._positions[index+1])}`);
            if (Object.entries(nextCol.children).length ===0) {
                console.log('Error', nextCol);
                timer(550, this.#insertDigit.bind(this, nextCol, 0, 'afterbegin'), this._transformY.bind(this, nextCol.firstElementChild, '-100%', 100));
                timer(550, this.#insertDigit.bind(this, nextCol, 0, 'afterbegin'), this._transformY.bind(this, nextCol.firstElementChild, '-100%', 100));
                timer(550, this.#insertDigit.bind(this, nextCol, 0, 'afterbegin'), this._transformY.bind(this, nextCol.firstElementChild, '-100%', 100));
            }
            const nextDigit = +nextCol.children[1].textContent;
            const lastContent = nextCol.lastElementChild;

            if ((+targetPos.children[1].textContent === 8 || +targetPos.children[1].textContent === 9) && nextPos === 'ten') {
                // console.log('next column:', nextCol, nextPos);
                this.#animateDigit(nextCol, nextDigit + 1 === 10?0:nextDigit+1, lastContent);
                // Update hundred digit position
                if (nextDigit + 1 === 10) {
                    if (!this._positions[index+2]) return;
                    const lastCol = this._parentElement.querySelector(`.${Object.keys(this._positions[index+2])}`);
                    if(lastCol)
                    this.#animateDigit(lastCol, +lastCol.children[1].textContent+1 === 10 ? 0 : +lastCol.children[1].textContent+1, lastCol.lastElementChild);
                }
            }

            if(+targetPos.children[2].textContent === 9 && nextPos === 'ten') {

                this.#animateDigit(nextCol, nextDigit, lastContent);

            }


            if (+targetPos.children[0].textContent === 0 && +targetPos.children[1].textContent === 0 && +targetPos.children[2].textContent !== 0 && nextPos === 'hundred') {
                this.#animateDigit(nextCol, nextDigit, lastContent);
            }

            if (position === 'one')
            // console.log('check');
            this.#animateDigit(targetPos, targetValue !==9?targetValue+1:0, value);

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

    async _pushDigits () {
        const curPositions = JSON.parse(JSON.stringify(this._positions));
        curPositions.forEach((pos, index) => {
            const targetPos = this._parentElement.querySelector(`.${Object.keys(pos)}`); // Select current column
            let targetValue = +Object.values(targetPos.children[0].textContent)[0]; // first digit of column
            // Loop the contents of current column
            console.log( 'Check', Object.entries(targetPos.children).length);
            for ( const [_,value] of Object.entries(targetPos.children)) {
                if (Object.entries(targetPos.children).length !== 0) {
                    this.#digitUpdate(targetPos, value, targetValue, curPositions, index);
                }
            }

        });
    };

    _initDigit (target,nr, index) {
        const position = Object.keys(target);
        const targetEl = this._parentElement.querySelector(`.${position}`);
        // const positions = JSON.parse(JSON.stringify(this._positions));
        let posState  = Object.values(this._positions[index])[0];
        // Upper digit
        if (nr !== 9 && posState === true) {
            targetEl.appendChild(this.#createDigit(nr+1));
            if (Object.keys(this._positions[index])[0] !== 'one') posState = false;
        }
        else if (posState === true) {
            targetEl.appendChild(this.#createDigit(0));
            this._positions[index+1][Object.keys(this._positions[index+1])] = true;
            if (Object.keys(this._positions[index])[0] !== 'one') posState = false;
        }
        else targetEl.appendChild(this.#createDigit(nr));

        // Middle digit
        targetEl.appendChild(this.#createDigit(nr));

        // Bottom digit
        if (nr !== 0 && posState === true) targetEl.appendChild(this.#createDigit(nr-1));
        else if (posState === true) targetEl.appendChild(this.#createDigit(9))
        else targetEl.appendChild(this.#createDigit(nr));

    }

    _splitDigit (nr) {
        const digitArr = nr.toString().split('');

        return digitArr;
    }
}

export default new CountDownView ();