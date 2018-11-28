# Introduction
This is Tick Tack Toe Simulator writting in NodeJS (browserjs compiled copy pending)
It was the brainchild of some boredom one evening, so feel free to play around with it.

# Installation
`npm install` and you are done.

# Usage

## Step 1: Setup the simulation to your preferences
Within `/src/index.js` you can configure the simulation(s) you wish to run.

Below is an example of a Simple Simulation:
```js
    sim.run({
        sims: 1000, // qty of games to run
        label: moment().toISOString(), // label for the log files (cronological is nice)
        log: false, // log output of each game to console
        save: false, // save game moves to file
        game_options: {
            x_move_first: true, // will x move first - default
            movers: {
                'X': require('./modules/moveRandom'), // This module chooses a move from the open positions on the board randomly
                'O': require('./modules/movePriorityChoice'), // This module chooses the move from predetermined logic to best suit its situation  on the board
            }

        }
    });
```

## Step 2: Run the simulation
To run the simulations defined in `/src/index.js`, call `npm start` this will start the simulation.

## Step 4: Add your own custom module to determine the next move
Create a file in the `/src/modules` folder that exports a function to call when the sim wishes to make a move.
This function will be provided with 2 arguments, STATE & PLAYER, these are representations of the board and the player making the move.

### STATE
This will be an array representation of the board:
```js
let STATE = [
    " "," "," ",
    " "," "," ",
    " "," "," "
];
```

### PLAYER
This is either 'X' or 'O' defining which player is making the move.
