import {GREEN, PURPLE, RED} from "@/defined-color";
import {PlayerData} from "@/types";

const PLAYER_ONE: PlayerData = {
    id: "1",
    token: "1",
    name: "Team A",
    color: RED,
    score: 0,
};


const PLAYER_TWO: PlayerData = {
    id: "2",
    token: "2",
    name: "Team B",
    color: GREEN,
    score: 0,
};

const TEST_PLAYER: PlayerData = {
    id: "3",
    token: "test",
    name: "Test",
    color: PURPLE,
    score: 0,
};

export {PLAYER_ONE, PLAYER_TWO, TEST_PLAYER}