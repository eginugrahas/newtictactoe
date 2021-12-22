import React, { Component } from 'react'
import Board from './Board';

const DIMENSION_MIN = 3;
const DIMENSION_MAX = 7;

export default class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dimension: DIMENSION_MIN,
            history: [
                {
                    squares: Array(DIMENSION_MIN * DIMENSION_MIN).fill(null),
                    winState: Array(DIMENSION_MIN * 2 + 2).fill(0),
                }
            ],
            turn: "X",
            step: 0
        };
    }

    calculateWinner(dimension, winState) {
		for (var i = 0; i < winState.length; i++) {
			if (winState[i] === dimension) {
				return 'X';
			} else if (winState[i] === -1 * dimension) {
				return 'O';
			}
		}
		return null;
	}

    jumpTo(step) {
        this.setState({
            turn: step % 2 === 0 ? 'X' : 'O',
            step: step 
        });
    }

    updateDimension(e) {
        var dimension = Number(e.target.value);
        this.setState({
            dimension: dimension,
            history: [
                {
                    squares: Array(dimension * dimension).fill(null),
                    winState: Array (dimension * 2 + 2).fill(0)
                }
            ],
            turn: 'X',
            step: 0
        });
    }

    updateWinState(i, dimension, turn, winState) {
		let row = Math.floor(i / dimension);
		let col = i % dimension;
		let diag1 = row === col;
		let diag2 = row + col === dimension - 1;

		let point = 0;
		if (turn === "X") {
			point = 1;
		} else if (turn === 'O') {
			point = -1;
		}
		winState[row] += point;
		winState[dimension + col] += point;
		if (diag1 === true) {
			winState[dimension * 2] += point;
		}
		if (diag2 === true) {
			winState[dimension * 2 + 1] += point;
		}
		return winState;
	}

    handleClick(i, dimension, history, turn, step, squares, winState) {
		history = history.slice(0, step + 1);
		if (this.calculateWinner(dimension, winState) || squares[i]) {
			return;
		}
		squares[i] = turn;
		this.setState({
			history: history.concat([{
				squares: squares,
				winState: this.updateWinState(i, dimension, turn, winState)
			}]),
			turn: turn === "X" ? "O" : "X",
			step: history.length
		});
	}
    
    render() {
        const dimension = this.state.dimension;
		const history = this.state.history.slice();
		const turn = this.state.turn;
		const step = this.state.step;

		// Showing the board state at a specified point in time
		const squares = history[step].squares.slice();
		const winState = history[step].winState.slice();

		// Defining the right game status
		const winner = this.calculateWinner(dimension, winState);
		const status = winner ? "PEMENANGNYA: " + winner : "Giliran: " + turn;

		// Listing out all past moves
		const moves = history.map((board, step) => {
			const label = step ? "Langkah ke #" + step : "Ulang Game";
			return (
				<li key={step}>
					<button onClick={() => this.jumpTo(step)}>
						{label}
					</button>
				</li>
			);
		});

        return (
            <div>
                <div className="nav">
                <div id="dimension-label">Ukuran Game: {dimension}</div>
                <small className='mudah'>Mudah</small>
                <small className='sulit'>Sulit</small>
				<input
                    className="slider"
					value={dimension}
					onChange={(e) => this.updateDimension(e)}
					id="dimension"
					type="range"
					min={DIMENSION_MIN}
					max={DIMENSION_MAX}
				/>
                </div>
                <div className="game">
				    <div className="game-board">
                    <div className="status">{status}</div>
					    <Board
						dimension={dimension}
						squares={squares}
						onClick={(i) => this.handleClick(i, dimension, history, turn, step, squares, winState)}
					    />
				    </div>
				    <div className="game-info">
					    <ul className='moves'>{moves}</ul>
				    </div>
			    </div>
            </div>
            
        );
    }
}
