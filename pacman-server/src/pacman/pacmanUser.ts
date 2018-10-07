import * as CONST from "./pacmanConst"
import Player from "../player";
export default class PacmanUser {
    position = null;
    direction = null;
    eaten = null;
    due = null;
    lives = null;
    score = 5;
    player: Player;
    constructor(public game: any, public map: any) {
        this.player = game.player;
        this.initUser();
    }
    addScore(nScore) {
        this.score += nScore;
        this.player.updateScore(this.score);
    };

    theScore() {
        return this.score;
    };

    loseLife() {
        this.lives -= 1;
    };

    getLives() {
        return this.lives;
    };

    initUser() {
        this.score = 0;
        this.lives = 3;
        this.newLevel();
    }

    newLevel() {
        this.resetPosition();
        this.eaten = 0;
    };

    resetPosition() {
        this.position = {
            "x": 90,
            "y": 120
        };
        this.direction = CONST.LEFT;
        this.due = CONST.LEFT;
    };

    reset() {
        this.initUser();
        this.resetPosition();
    };

    keyDown(direction) {
        this.due = direction;
        return false;

    };

    getNewCoord(dir, current) {
        return {
            "x": current.x + (dir === CONST.LEFT && -2 || dir === CONST.RIGHT && 2 || 0),
            "y": current.y + (dir === CONST.DOWN && 2 || dir === CONST.UP && -2 || 0)
        };
    };

    onWholeSquare(x) {
        return x % 10 === 0;
    };

    pointToCoord(x) {
        return Math.round(x / 10);
    };

    nextSquare(x, dir) {
        var rem = x % 10;
        if (rem === 0) {
            return x;
        } else if (dir === CONST.RIGHT || dir === CONST.DOWN) {
            return x + (10 - rem);
        } else {
            return x - rem;
        }
    };

    next(pos, dir) {
        return {
            "y": this.pointToCoord(this.nextSquare(pos.y, dir)),
            "x": this.pointToCoord(this.nextSquare(pos.x, dir)),
        };
    };

    onGridSquare(pos) {
        return this.onWholeSquare(pos.y) && this.onWholeSquare(pos.x);
    };

    isOnSamePlane(due, dir) {
        return ((due === CONST.LEFT || due === CONST.RIGHT) &&
            (dir === CONST.LEFT || dir === CONST.RIGHT)) ||
            ((due === CONST.UP || due === CONST.DOWN) &&
                (dir === CONST.UP || dir === CONST.DOWN));
    };

    move() {
        var npos = null,
            nextWhole = null,
            oldPosition = this.position,
            block = null;

        if (this.due !== this.direction) {
            npos = this.getNewCoord(this.due, this.position);

            if (this.isOnSamePlane(this.due, this.direction) ||
                (this.onGridSquare(this.position) &&
                    this.map.isFloorSpace(this.next(npos, this.due)))) {
                this.direction = this.due;
            } else {
                npos = null;
            }
        }

        if (npos === null) {
            npos = this.getNewCoord(this.direction, this.position);
        }

        if (this.onGridSquare(this.position) && this.map.isWallSpace(this.next(npos, this.direction))) {
            this.direction = CONST.NONE;
        }

        if (this.direction === CONST.NONE) {
            return {
                "new": this.position,
                "old": this.position
            };
        }

        if (npos.y === 100 && npos.x >= 190 && this.direction === CONST.RIGHT) {
            npos = {
                "y": 100,
                "x": -10
            };
        }

        if (npos.y === 100 && npos.x <= -12 && this.direction === CONST.LEFT) {
            npos = {
                "y": 100,
                "x": 190
            };
        }

        this.position = npos;
        nextWhole = this.next(this.position, this.direction);

        block = this.map.block(nextWhole);

        if ((this.isMidSquare(this.position.y) || this.isMidSquare(this.position.x)) &&
            block === CONST.BISCUIT || block === CONST.PILL) {

            this.map.setBlock(nextWhole, CONST.EMPTY);
            this.addScore((block === CONST.BISCUIT) ? CONST.BISCUIT_SCORE   : CONST.PILL_SCORE);
            this.eaten += 1;

            if (this.eaten === 182) {

                // this.game.completedLevel();
            }

            if (block ===CONST.PILL) {

                //this.game.eatenPill();
            }
        }

        return {
            "new": this.position,
            "old": oldPosition
        };
    };

    isMidSquare(x) {
        var rem = x % 10;
        return rem > 3 || rem < 7;
    };

    calcAngle(dir, pos) {
        if (dir == CONST.RIGHT && (pos.x % 10 < 5)) {
            return {
                "start": 0.25,
                "end": 1.75,
                "direction": false
            };
        } else if (dir === CONST.DOWN && (pos.y % 10 < 5)) {
            return {
                "start": 0.75,
                "end": 2.25,
                "direction": false
            };
        } else if (dir === CONST.UP && (pos.y % 10 < 5)) {
            return {
                "start": 1.25,
                "end": 1.75,
                "direction": true
            };
        } else if (dir === CONST.LEFT && (pos.x % 10 < 5)) {
            return {
                "start": 0.75,
                "end": 1.25,
                "direction": true
            };
        }
        return {
            "start": 0,
            "end": 2,
            "direction": false
        };
    };

    drawDead(ctx, amount) {

        var size = this.map.blockSize,
            half = size / 2;

        if (amount >= 1) {
            return;
        }

        ctx.fillStyle = "#FFFF00";
        ctx.beginPath();
        ctx.moveTo(((this.position.x / 10) * size) + half,
            ((this.position.y / 10) * size) + half);

        ctx.arc(((this.position.x / 10) * size) + half,
            ((this.position.y / 10) * size) + half,
            half, 0, Math.PI * 2 * amount, true);

        ctx.fill();

    };

    draw(ctx:CanvasRenderingContext2D) {
        var blockSize = this.map.blockSize,
            angle = this.calcAngle(this.direction, this.position);

        ctx.fillStyle = this.player.color;
        let positionX = ((this.position.x / 10) * blockSize) + blockSize / 2;
        let positionY = ((this.position.y / 10) * blockSize) + blockSize / 2

        ctx.beginPath();
        ctx.moveTo(positionX, positionY);


        ctx.arc(positionX, positionY,
            blockSize / 2, Math.PI * angle.start,
            Math.PI * angle.end, angle.direction);


        ctx.fill();
        this.player.moveName(positionX, positionY)
    };



};
