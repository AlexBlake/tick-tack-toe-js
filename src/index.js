const sim = require('./sim');
const moment = require('moment');


sim.run({
    sims: 1000, // qty of games
    label: moment().toISOString(), // label for files
    log: false, // log output of each game to console
    save: false, // save game moves to file
    game_options: {
        x_move_first: true, // will x move first
        movers: {
            'X': require('./modules/moveRandom'),
            'O': require('./modules/movePriorityChoice'),
        }

    }
})