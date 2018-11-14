import {BLUE, DEEP_ORANGE, GRAY, GREEN, PURPLE} from "@/defined-color";
import {PlayerData} from "@/types";

const PLAYER_ONE: PlayerData = {
    id: "0",
    token: "5Irv9uE",
    name: "Team",
    color: DEEP_ORANGE,
    score: 0,
};


const PLAYER_TWO: PlayerData = {
    id: "0",
    token: "bUobZN0",
    name: "Team",
    color: GREEN,
    score: 0,
};

const PLAYER_THREE: PlayerData = {
    id: "0",
    token: "Xfk09js",
    name: "Team",
    color: PURPLE,
    score: 0,
};

const PLAYER_FOUR: PlayerData = {
    id: "0",
    token: "uAj4Uo0",
    name: "Team",
    color: BLUE,
    score: 0,
};

const DEFAULT_LAYER: PlayerData = {
    id: "0",
    token: "5Irv9uE",
    name: "Team",
    color: GRAY,
    score: 0
}


class PredefinedPlayer {
    static players: PlayerData[] = [PLAYER_ONE, PLAYER_TWO, PLAYER_THREE, PLAYER_FOUR];

    private readonly token: string | null;
    private isFound!: boolean;
    private user: PlayerData = DEFAULT_LAYER;

    constructor(token: string | null) {
        this.token = token;
        this.find(this.token);
    }

    private find(token: string | null): void {
        if (this.isValidToken()) {
            this.user = PredefinedPlayer.players.filter(player => player.token === token)[0];
            if (this.user) {
                this.isFound = true;
            } else {
                this.isFound = false;
            }
        }
    }

    isValidToken(): boolean {
        return this.token !== "";
    }

    isFoundUser(): boolean {
        return this.isFound;
    }

    getUser() {
        return this.user;
    }
}

export {DEFAULT_LAYER, PredefinedPlayer}