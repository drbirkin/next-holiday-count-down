class BackgroundView {
    _parentElement = document.querySelector('.cover-image');

    _newImage (data) {
        this._parentElement.setAttribute('src', `${data.urls.full}`);
    }

}

export default new BackgroundView ();