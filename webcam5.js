class Webcam5 {
    constructor(options) {
        this.el = options.el;
        this.width = options.width || 320;
        this.height = options.height || 240;
        this.takeBtn = options.takeBtn;
        this.onSubmit = options.onSubmit;
        this.btnsToggled = false;
        this.classes = options.classes || {};
    }

    createElements() {
        this.video = document.createElement('video');
        this.video.setAttribute('id', 'webcam5-video');

        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute('id', 'webcam5-canvas');
        this.canvas.style.display = 'none';

        this.photo = document.createElement('img');
        this.photo.setAttribute('id', 'webcam5-photo');

        this.retakeBtn = document.createElement('button');
        this.retakeBtn.style.display = 'none';
        this.retakeBtn.setAttribute('id', 'webcam5-retake');
        this.retakeBtn.innerText = 'Retake Photo';

        // Add classes from options
        this.classes.retakeBtn.split(' ').map(_class => this.retakeBtn.classList.add(_class));

        this.submitBtn = document.createElement('button');
        this.submitBtn.style.display = 'none';
        this.submitBtn.setAttribute('id', 'webcam5-submit');
        this.submitBtn.innerText = 'Submit Photo';

        // Add classes from options
        this.classes.submitBtn.split(' ').map(_class => this.submitBtn.classList.add(_class));

        this.takeBtn.parentNode.insertBefore(this.retakeBtn, this.takeBtn);
        this.takeBtn.parentNode.insertBefore(this.submitBtn, this.takeBtn);

        // Add classes from options
        this.classes.takeBtn.split(' ').map(_class => this.takeBtn.classList.add(_class));

        this.el.appendChild(this.video);
        this.el.appendChild(this.canvas);
        this.el.appendChild(this.photo);
    }

    init() {
        this.createElements();
        this.startStreaming();

        this.video.addEventListener('canplay', (event) => {
            this.setStreaming();
        }, false);

        this.takeBtn.addEventListener('click', (event) => {
            this.takePicture();
            event.preventDefault();
        }, false);

        this.retakeBtn.addEventListener('click', (event) => {
            this.retakePhoto();
        }, false);

        this.submitBtn.addEventListener('click', (event) => {
            this.onSubmit();
        }, false);
    }

    getDataURL() {
        return this.photo.getAttribute('src');
    }

    startStreaming() {
        navigator.getMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia);

        navigator.getMedia({ video: true, audio: false }, (stream) => {
            if (navigator.mozGetUserMedia) {
                this.video.mozSrcObject = stream;
            } else {
                const vendorURL = window.URL || window.webkitURL;
                this.video.src = vendorURL.createObjectURL(stream);
            }

            this.video.play();
        }, (error) => {
            console.error(error);
        });
    }

    setStreaming() {
        if (!this.streaming) {
            this.height = this.video.videoHeight / (this.video.videoWidth / this.width);

            if (isNaN(this.height)) {
                this.height = this.weight / (4 / 3);
            }

            this.video.setAttribute('width', this.width);
            this.video.setAttribute('height', this.height);
            this.canvas.setAttribute('width', this.width);
            this.canvas.setAttribute('height', this.height);
            this.streaming = true;
        }
    }

    toggleButtons() {
        if (this.btnsToggled) {
            this.takeBtn.style.display = 'block';

            this.photo.style.display = 'none';
            this.video.style.display = 'block';

            this.retakeBtn.style.display = 'none';
            this.submitBtn.style.display = 'none';
        } else {
            this.takeBtn.style.display = 'none';

            this.photo.style.display = 'block';
            this.video.style.display = 'none';

            this.retakeBtn.style.display = 'block';
            this.submitBtn.style.display = 'block';
        }

        this.btnsToggled = !this.btnsToggled;
    }

    retakePhoto() {
        this.toggleButtons();
    }

    takePicture() {
        this.toggleButtons();

        let context = this.canvas.getContext('2d');

        if (this.width && this.height) {
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            context.drawImage(this.video, 0, 0, this.width, this.height);

            const data = this.canvas.toDataURL('image/png');
            this.photo.setAttribute('src', data);
        } else {
            this.clearPhoto();
        }
    }

    clearPhoto() {
        const context = canvas.getContext('2d');

        context.fillStyle = '#aaa';
        context.fillRect(0, 0, canvas.width, canvas.height);

        const data = canvas.toDataURL('image/png');
        this.photo.setAttribute('src', data);
    }
};