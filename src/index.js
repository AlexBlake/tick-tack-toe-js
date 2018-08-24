const sim = require('./sim');
const moment = require('moment');
const Chance = require('chance');
const chance = new Chance();

function moveNext(state) {
    for(let i = 0; i <  state.length; i++) {
        if(state[i] == " ") {
            return i;
        }
    }
    return false;
}

function moveRandom(state) {
    let possible_moves = state.reduce((possible, pos, index) => {
        if(pos == " ") {
            possible.push(index);
        }
        return possible;
    }, []);
    return possible_moves[chance.integer({ min: 0, max: possible_moves.length-1 })];
}

function moveChoice(state, player) {
    let possible_moves = state.reduce((possible, pos, index) => {
        if(pos == " ") {
            possible.push(index);
        }
        return possible;
    }, []);

    let move_scores = possible_moves.map(pos => {
        let states = sim.win_states.reduce((x,y) => {
            if(y.indexOf(pos) !== -1) {
                // we have a condition we can meet
                x.push(
                    y.reduce((score, spot) => {
                        if(spot !== pos) {
                            if(state[spot] == player) {
                                score += 2;
                            } else {
                                if(state[spot] != " ") {
                                    score -= 4;
                                } else {
                                    score += 1;
                                }
                            }
                        }
                        return score;
                    }, 0)
                );
            }
            return x;
        }, []);
        return Math.max(...states);
    });
    let max = Math.max(...move_scores);
    let moves = move_scores.reduce((a, x, i) => {
        if(x == max) {
            a.push(possible_moves[i]);
        }
        return a;
    }, []);
    return moves[chance.integer({ min: 0, max: moves.length-1 })];
    // console.log(possible_moves, move_scores, possible_moves[move_scores.indexOf(Math.max(...move_scores))]);
    // return possible_moves[move_scores.indexOf(Math.max(...move_scores))];
}

// override `sim.makeMove(game)`
sim.makeMove = (state, player) => {
    // console.log(player, state);
    switch(player) {
        case "X":
            return moveRandom(state, player);
            // return moveChoice(state, player);
        break;
        case "O":
            // return moveRandom(state, player);
            return moveChoice(state, player);
        break;
    }
}

sim.run({
    sims: 1000, // qty of games
    label: moment().toISOString(), // label for files
    log: false, // log output of each game to console
    save: true, // save game moves to file
    game_options: {
        x_move_first: true // will x move first
    }
})