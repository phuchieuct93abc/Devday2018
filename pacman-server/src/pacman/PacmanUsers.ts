import PacmanUser from "@/pacman/pacmanUser";

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
        throw new Error("Method not implemented.");
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

    move() {
        return this.users.map(element => element.move());

    }

    draw(ctx) {
        this.users.forEach(element => element.draw(ctx));

    }
}