export default class PacmanAudio {
    private files: any = [];
    private endEvents: any = [];
    private progressEvents: any = [];
    private playing: any[] = [];
    private readonly isSoundDisabled: boolean;

    constructor(isSoundDisabled: boolean) {
        this.isSoundDisabled = isSoundDisabled;
    }

    load(eventName: string, path: string, callback) {
        const f = this.files[eventName] = document.createElement("audio");

        this.progressEvents[eventName] = event => this.progress(event, eventName, callback);

        f.addEventListener("canplaythrough", this.progressEvents[eventName], true);
        f.setAttribute("preload", "true");
        f.setAttribute("autobuffer", "true");
        f.setAttribute("src", path);
        f.pause();
    }

    progress(event, eventName: string, callback) {
        if (event.loaded === event.total && typeof callback === "function") {
            callback();
            this.files[eventName].removeEventListener("canplaythrough", this.progressEvents[eventName], true);
        }
    }

    disableSound() {
        for (let i = 0; i < this.playing.length; i++) {
            this.files[this.playing[i]].pause();
            this.files[this.playing[i]].currentTime = 0;
        }
        this.playing = [];
    }

    ended(eventName: string) {
        let tmp: any = [];
        let found = false;

        this.files[eventName].removeEventListener("ended", this.endEvents[eventName], true);

        for (let i = 0; i < this.playing.length; i++) {
            if (!found && this.playing[i]) {
                found = true;
            } else {
                tmp.push(this.playing[i]);
            }
        }
        this.playing = tmp;
    }

    play(eventName: string) {
        if (!this.isSoundDisabled) {
            this.endEvents[eventName] = () => this.ended(eventName);
            this.playing.push(eventName);
            this.files[eventName].addEventListener("ended", this.endEvents[eventName], true);
            this.files[eventName].play();
        }
    }

    pause() {
        for (let i = 0; i < this.playing.length; i++) {
            this.files[this.playing[i]].pause();
        }
    }

    resume() {
        for (let i = 0; i < this.playing.length; i++) {
            this.files[this.playing[i]].play();
        }
    }
};
