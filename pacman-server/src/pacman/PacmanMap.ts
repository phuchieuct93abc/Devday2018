import {BISCUIT, BLOCK, EMPTY, PILL, WALL} from "@/pacman/pacmanConst";
import PacmanMaze from "@/pacman/PacmanMaze";

export default class PacmanMap {
    private height!: number;
    private width!: number;
    private readonly blockSize: number;
    private pillSize: number = 0;
    private map: any = null;

    constructor(blockSize: number) {
        this.blockSize = blockSize;
        this.reset();
    }

    withinBounds(y, x) {
        return y >= 0 && y < this.height && x >= 0 && x < this.width;
    }

    isWallSpace(pos) {
        return this.withinBounds(pos.y, pos.x) && this.map[pos.y][pos.x] === WALL;
    }

    isFloorSpace(pos) {
        if (!this.withinBounds(pos.y, pos.x)) {
            return false;
        }
        const peice = this.map[pos.y][pos.x];
        return peice === EMPTY || peice === BISCUIT || peice === PILL;
    }

    drawWall(ctx) {

        var i, j, p, line;

        ctx.strokeStyle = "#0000FF";
        ctx.lineWidth = 5;
        ctx.lineCap = "round";

        for (let i = 0; i < PacmanMaze.WALLS.length; i += 1) {
            line = PacmanMaze.WALLS[i];
            ctx.beginPath();

            for (j = 0; j < line.length; j += 1) {

                p = line[j];

                if (p.move) {
                    ctx.moveTo(p.move[0] * this.blockSize, p.move[1] * this.blockSize);
                } else if (p.line) {
                    ctx.lineTo(p.line[0] * this.blockSize, p.line[1] * this.blockSize);
                } else if (p.curve) {
                    ctx.quadraticCurveTo(p.curve[0] * this.blockSize,
                        p.curve[1] * this.blockSize,
                        p.curve[2] * this.blockSize,
                        p.curve[3] * this.blockSize);
                }
            }
            ctx.stroke();
        }
    }

    clone(object) {
        var i, newObj = (object instanceof Array) ? [] : {};
        for (let i in object) {
            if (i === 'clone') {
                continue;
            }
            if (object[i] && typeof object[i] === "object") {
                newObj[i] = this.clone(object[i]);
            } else {
                newObj[i] = object[i];
            }
        }
        return newObj;
    }

    reset() {
        this.map = this.clone(PacmanMaze.MAP);
        this.height = this.map.length;
        this.width = this.map[0].length;
    }

    block(pos) {
        return this.map[pos.y][pos.x];
    }

    setBlock(pos, type) {
        this.map[pos.y][pos.x] = type;
    }

    drawPills(ctx) {

        if (++this.pillSize > 30) {
            this.pillSize = 0;
        }

        for (let i = 0; i < this.height; i += 1) {
            for (let j = 0; j < this.width; j += 1) {
                if (this.map[i][j] === PILL) {
                    ctx.beginPath();

                    ctx.fillStyle = "#000";
                    ctx.fillRect((j * this.blockSize), (i * this.blockSize),
                        this.blockSize, this.blockSize);

                    ctx.fillStyle = "#FFF";
                    ctx.arc((j * this.blockSize) + this.blockSize / 2,
                        (i * this.blockSize) + this.blockSize / 2,
                        Math.abs(5 - (this.pillSize / 3)),
                        0,
                        Math.PI * 2, false);
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }

    draw(ctx) {

        var i, j, size = this.blockSize;

        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, this.width * size, this.height * size);

        this.drawWall(ctx);

        for (let i = 0; i < this.height; i += 1) {
            for (j = 0; j < this.width; j += 1) {
                this.drawBlock(i, j, ctx);
            }
        }
    }

    drawBlock(y, x, ctx) {

        var layout = this.map[y][x];

        if (layout === PILL) {
            return;
        }

        ctx.beginPath();

        if (layout === EMPTY || layout === BLOCK ||
            layout === BISCUIT) {

            ctx.fillStyle = "#000";
            ctx.fillRect((x * this.blockSize), (y * this.blockSize),
                this.blockSize, this.blockSize);

            if (layout === BISCUIT) {
                ctx.fillStyle = "#FFF";
                ctx.fillRect((x * this.blockSize) + (this.blockSize / 2.5),
                    (y * this.blockSize) + (this.blockSize / 2.5),
                    this.blockSize / 6, this.blockSize / 6);
            }
        }
        ctx.closePath();
    }
};
