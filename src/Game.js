import React from 'react';

/**
 * Component for displaying
 * squares
 */
function Square(props) {
    return (
        <button 
            onClick={props.onClick}
            className={props.boxStyle}>
            {props.value}
        </button>
    );
}


/**
 * Component for the tic tac toe
 * board.
 *
 * Manages state of the squares as 
 * opposed to state being kept in 
 * each square object.
 */
class Board extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            winner: null,
            lastMove: 'O',
            squares: Array(16).fill(null),
            squareStyle: Array(16).fill('square'),
        }
        this.handleClick = this.handleClick.bind(this);
    }
    /**
     *
     */
    renderSquare(i) {
        return <Square 
            value={this.state.squares[i]} 
            onClick={() => this.handleClick(i)}
            boxStyle={this.state.squareStyle[i]}
        />;
    }

    /**
     * Click handler for square button.
     *
     */
    handleClick(i) {
        if (this.state.squares[i] !== null 
         || this.state.winner !== null) {
            return false;
        }

        let mySymbol = 'X';
        if (this.state.lastMove === 'X') {
            mySymbol = 'O';
        }
        let mySquares = this.state.squares.slice();
        let squareStyle = this.state.squareStyle.slice();
        mySquares[i] = mySymbol;
        let state = {
            lastMove: mySymbol,
            squares: mySquares,
            squareStyle: squareStyle
        }

        let winner = this.checkWinner(state);
        if (winner !== null) {
            state.winner = winner.winner;
            state.coordinates = winner.coordinates;
            winner.coordinates.forEach((value) => {
                state.squareStyle[value] = 'square-winner';
            });
        }

        this.setState(state);


    }

    /**
     * Walk through game grid to
     * find winning line
     *
     * @todo Refactor!!
     */
    checkWinner(state) {
        let total = state.squares.length;
        let winningTotal = Math.sqrt(total);
        let lastKey = total-1;

        let xWinner = '';
        let coordinates = [];
        for (let x = 0; x<lastKey;x+=winningTotal) {
            xWinner = '';
            coordinates = [];
            for (let y=x;y<winningTotal+x;y++) {
                coordinates.push(y);
                if (xWinner === '') {
                    xWinner = state.squares[y];
                }
                else if (xWinner !== state.squares[y]) {
                    xWinner = null;
                    // Optimization step so we don't
                    // need to continue checking if a
                    // mismatch is found.
                    break;
                }
            }
            if (xWinner !== null) {
                break;
            }
        }
        if (xWinner === null || xWinner === '') {
            for (let x = 0; x<winningTotal;x++) {
                xWinner = '';
                coordinates = [];
                for (let y=x;y<total+x;y+=winningTotal) {
                    coordinates.push(y);
                    if (xWinner === '') {
                        xWinner = state.squares[y];
                    }
                    else if (xWinner !== state.squares[y]) {
                        xWinner = null;
                        // Optimization step so we don't
                        // need to continue checking if a
                        // mismatch is found.
                        break;
                    }
                }
                if (xWinner !== null) {
                    break;
                }
            }
        }
        if (xWinner === null || xWinner === '') {
            xWinner = '';
            coordinates = [];
            for (let x = 0; x<total;x+=winningTotal+1) {
                coordinates.push(x);
                if (xWinner === '') {
                    xWinner = state.squares[x];
                }
                else if (xWinner !== state.squares[x]) {
                    xWinner = null;
                    // Optimization step so we don't
                    // need to continue checking if a
                    // mismatch is found.
                    break;
                }
            }
        }
        if (xWinner === null || xWinner === '') {
            xWinner = '';
            coordinates = [];
            for (let x = winningTotal-1; x<((winningTotal-1) * winningTotal)+1 ;x+=winningTotal-1) {
                coordinates.push(x);
                if (xWinner === '') {
                    xWinner = state.squares[x];
                }
                else if (xWinner !== state.squares[x]) {
                    xWinner = null;
                    // Optimization step so we don't
                    // need to continue checking if a
                    // mismatch is found.
                    break;
                }
            }
        }
        if (xWinner === null || xWinner === '') {
            return null;
        }
        return {
            winner: xWinner,
            coordinates: coordinates,
        }
    }


    /**
     *
     */
    render() {
        let status = '';
        if (this.state.winner !== null) {
            status = 'Winner: ' + this.state.winner;

            /*
            let squareStyle = [];
            winner.coordinates.forEach((value) => {
                squareStyle[value] = 'square-selected';
            });
            this.setState({
                squareStyle: squareStyle
            });
            */
        }
        else {
            let player = (this.state.lastMove === 'O') ?'X' : 'O';
            status = 'Next player: ' + player.toString();
        }
        return (
            <div>
                <div className="status">{status}</div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                    {this.renderSquare(3)}
                </div>
                <div className="board-row">
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                </div>
                <div className="board-row">
                    {this.renderSquare(8)}
                    {this.renderSquare(9)}
                    {this.renderSquare(10)}
                    {this.renderSquare(11)}
                </div>
                <div className="board-row">
                    {this.renderSquare(12)}
                    {this.renderSquare(13)}
                    {this.renderSquare(14)}
                    {this.renderSquare(15)}
                </div>
            </div>
        );
    }
}

/**
 * Component for the Game
 * Shows the actual game
 * and game info
 */
class Game extends React.Component {
    /**
     *
     */
    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board />
                </div>
                <div className="game-info">
                    <div>{/**/}</div>
                    <ol>{/**/}</ol>
                </div>
            </div>
        );
    }
}

export default Game;
