const Chance = require('chance');
const chance = new Chance();

module.exports = function(state, player) {
    let possible_moves = state.reduce((possible, pos, index) => {
        if(pos == " ") {
            possible.push(index);
        }
        return possible;
    }, []);
    return possible_moves[chance.integer({ min: 0, max: possible_moves.length-1 })];
}
