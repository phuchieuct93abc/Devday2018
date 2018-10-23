class PacmanAudio {

    files: any = [];
    endEvents: any = [];
    progressEvents: any = [];
    playing: any[] = [];
    game: any;

    constructor(game) {
        this.game = game;
    }

    load(name, path, cb) {

        var f = this.files[name] = document.createElement("audio");

        this.progressEvents[name] = (event) => {
            this.progress(event, name, cb);
        };

        f.addEventListener("canplaythrough", this.progressEvents[name], true);
        f.setAttribute("preload", "true");
        f.setAttribute("autobuffer", "true");
        f.setAttribute("src", path);
        f.pause();
    }

    progress(event, name, callback) {
        if (event.loaded === event.total && typeof callback === "function") {
            callback();
            this.files[name].removeEventListener("canplaythrough",
                this.progressEvents[name], true);
        }
    }

    disableSound() {
        for (var i = 0; i < this.playing.length; i++) {
            this.files[this.playing[i]].pause();
            this.files[this.playing[i]].currentTime = 0;
        }
        this.playing = [];
    }

    ended(name) {

        var i, tmp: any = [],
            found = false;

        this.files[name].removeEventListener("ended", this.endEvents[name], true);

        for (let i = 0; i < this.playing.length; i++) {
            if (!found && this.playing[i]) {
                found = true;
            } else {
                tmp.push(this.playing[i]);
            }
        }
        this.playing = tmp;
    }

    play(name) {
        if (!this.game.soundDisabled()) {
            this.endEvents[name] = () => {
                this.ended(name);
            };
            this.playing.push(name);
            this.files[name].addEventListener("ended", this.endEvents[name], true);
            this.files[name].play();
        }
    }

    pause() {
        for (var i = 0; i < this.playing.length; i++) {
            this.files[this.playing[i]].pause();
        }
    }

    resume() {
        for (var i = 0; i < this.playing.length; i++) {
            this.files[this.playing[i]].play();
        }
    }
};


export default PacmanAudio;


// return {
//     "disableSound": disableSound,
//     "load": load,
//     "play": play,
//     "pause": pause,
//     "resume": resume
// };