'use strict';

const fs = require('fs');
const hash = require('object-hash');
const moment = require('moment');
const util = require('./util');
const Chance = require('chance');
const chance = new Chance();

exports.sys = {
    sims: 10,
    label: moment().toISOString(),
    game: null,
    log: true,
    save: true,
    game_options: {
        x_move_first: true
    }
};

function saveState(game) {
    fs.appendFileSync(game.file, game.game_num+"\t"+game.moves+"\t"+game.winner+"\t"+JSON.stringify(game.state)+"\n");
}

exports.makeMove = (state, player) => {
    let possible_moves = state.reduce((possible, pos, index) => {
        if(pos == " ") {
            possible.push(index);
        }
        return possible;
    }, []);
    possible_moves.length-1
    return possible_moves[chance.integer({ min: 0, max: possible_moves.length-1 })];
}

exports.win_states = [
    // horizontal
    [0,1,2],
    [3,4,5],
    [6,7,8],

    // vertical
    [0,3,6],
    [1,4,7],
    [2,5,8],

    // diagonal
    [0,4,8],
    [2,4,6]
];
exports.checkWinner = (game) => {
    let the_winner = null;
    for(let i = 0, win_state; win_state = exports.win_states[i]; i++) {
        let test = [];
        win_state.forEach(x => {
            test.push(game.state[x]);
        });
        let won = test.every((v,i,a) => v === a[0]);
        if(won && test[0] !== " ") {
            the_winner = ''+test[0];
            break;
        }
    }
    // console.log("WINNER: ", the_winner, game.state);
    if(the_winner !== null) {
        game.winner = the_winner;
    } else {
        let cantPlay = true;
        for(let x = 0; x < game.state.length; x++) {
            if(game.state[x] === " ") {
                cantPlay = false;
                break;
            }
        }
        if(cantPlay && game.winner === null) {
            game.winner = 'Draw';
        }
    }
}

function runGame(game, log, save) {
    while(game.winner === null) {
        // make play
        let move = exports.makeMove(game.state, game.x_to_move ? 'X' : 'O');
        // console.log("MOVE INTERNAL: ",move, game.x_to_move ? 'X' : 'O');
        if(move !== false) {
            // update game progression
            game.state[move] = game.x_to_move ? 'X' : 'O';
            game.x_to_move = !game.x_to_move;
            game.moves++;
            // test for winner
            exports.checkWinner(game);
            // console.log("WINNER: ", game.winner);
        } else {
            // player yields
            game.winner = game.x_to_move ? 'O' : 'X';
        }
        if(save) {
            saveState(game);
        }
        if(log) {
            util.print("Game: "+game.game_num+"\tMoves: "+game.moves+"\tWinner: "+game.winner);
        }
    }
    if(log) {
        util.printLn("");
        util.printLn( "\t" + game.state.slice(0,3).join(' ') );
        util.printLn( "\t" + game.state.slice(3,6).join(' ') );
        util.printLn( "\t" + game.state.slice(6,9).join(' ') );
        util.printLn("");
    }
}

function newGame(label, num, options) {
    return {
        game_num: num,
        file: "./game_log/gameset." + label + ".txt",
        state: [
            " "," "," ",
            " "," "," ",
            " "," "," "
        ],
        moves: 0,
        winner: null,
        x_to_move: options.x_move_first === true ? true : false
    };
}

function usage() {
    let cur = (process.memoryUsage().heapUsed / 1024 / 1024);
    if(cur > exports.sys.use) {
        exports.sys.use = cur;
    }
    return Math.ceil(cur)+"MB";
}

const totals = {
    games: 0,
    moves: 0,
    wins: {
        'X': 0,
        'O': 0,
        'Draw': 0
    }
}

exports.run = (options) => {
    Object.keys(exports.sys).forEach(key => {
        if(typeof options[key] !== 'undefined' && options[key] != null) {
            exports.sys[key] = options[key];
        }
    });
    console.time('sim');
    while(totals.games < exports.sys.sims) {
        exports.sys.game = newGame(exports.sys.label, totals.games, exports.sys.game_options);
        runGame(exports.sys.game, exports.sys.log, exports.sys.save);

        totals.games++;
        totals.moves += exports.sys.game.moves;
        totals.wins[exports.sys.game.winner]++;

        if(!exports.sys.log) {
            util.print(usage()+"\tGames: "+totals.games+"\tMoves: "+totals.moves+"\tWins: < X, O, Draw >\t< "+totals.wins['X']+", "+totals.wins['O']+", "+totals.wins['Draw']+" >");
        }
    }
    if(exports.sys.log) {
        util.printLn(usage()+"\tGames: "+totals.games+"\tMoves: "+totals.moves+"\tWins: < X, O, Draw >\t< "+totals.wins['X']+", "+totals.wins['O']+", "+totals.wins['Draw']+" >");
    }
    util.printLn("");
    console.timeEnd('sim');
}
