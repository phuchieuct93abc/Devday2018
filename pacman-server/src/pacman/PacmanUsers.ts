import PacmanUser from "@/pacman/pacmanUser";
import {PacmanPosition} from "@/types";
import Store from "@/store";
import {CombatStatus} from "@/constants";

export default class PacmanUsers {
    constructor(private users: PacmanUser[]) {
    }

    addScore(nScore: any): any {
        throw new Error("Method not implemented.");
    }

    drawDead(ctx: any, arg1: number): any {
        throw new Error("Method not implemented.");
    }

    loseLife(): any {
        Store.commit("updateCombatStatus", CombatStatus.STOPPED);
    }

    keyDown(userIndex, direction) {
        this.users[userIndex].keyDown(direction)
    }

    reset() {
        this.users.forEach(element => element.reset());
    }

    getLives() {
        return 3;
    }

    theScore() {
        return 3;
    }

    resetPosition() {
        this.users.forEach(element => element.resetPosition());
    }

    move(): PacmanPosition[] {
        return this.users.map(element => element.move());
    }

    draw(ctx) {
        this.users.forEach(element => element.draw(ctx));
    }
}