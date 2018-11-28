const Chance = require('chance');
const chance = new Chance();
const sim = require('../sim');

module.exports = function(state, player) {
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
                                score += 4;
                            } else {
                                if(state[spot] != " ") {
                                    score += 2;
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