
class EventView {
    _parentElement = document.querySelector('.event p');

    _nextEvent (data) {
        this.#clearContent();
        this._parentElement.textContent = data.name;
    }

    #clearContent () {
        this._parentElement.textContent = '';
    }

}

export default new EventView ();