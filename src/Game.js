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

    /**
     * Return a Square component.
     * Props defined in Board component
     * are passed down to the Square
     * component.
     *
     * A special prop 'onClick' holds a
     * closure that will be assigned as 
     * the onClick for the square that will
     * trigger the handleClick() method
     * from the Board component.
     */
    renderSquare(i) {
        return <Square 
            value={this.props.squares[i]} 
            onClick={() => this.props.SquareButtonClickHandler(i)}
            boxStyle={this.props.squareStyle[i]}
        />;
    }

    /**
     * Render the game board
     */
    render() {
        return (
            <div>
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
    constructor(props) {
        super(props);
        this.state = {
            winner: null,
            lastMove: 'O',
            history: [],
            squares: Array(16).fill(null),
            squareStyle: Array(16).fill('square'),
        };
        this.handleBoardAction = this.handleBoardAction.bind(this);
        this.handleTimeTravel = this.handleTimeTravel.bind(this);
        this.handleSquareClick = this.handleSquareClick.bind(this);
    }

    /**
     * Click handler for square button.
     *
     */
    handleSquareClick(i) {
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
        let boardUpdate  = {
            value: mySymbol,
            position: i,
        };
        if (winner !== null) {
            state.winner = winner.winner;
            state.coordinates = winner.coordinates;
            winner.coordinates.forEach((value) => {
                state.squareStyle[value] = 'square-winner';
            });
            boardUpdate.winningCoordinates = winner.coordinates.slice();
        }
        this.handleBoardAction(boardUpdate);
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

    renderHistoryItems(item) {
        return <HistoryItem
            key={item.moveId.toString()}
            entry={item}
            timeTravelHandler={() => this.handleTimeTravel(item)}
        />
    }

    handleTimeTravel(replayUpTo) {
        this.setState((state) => {
            let x = 0;
            let newSquares = Array(16).fill(null);
            let newSquareStyle = Array(16).fill('square');
            while (x <= replayUpTo.moveId) {
                newSquares[state.history[x].add.position] = state.history[x].add.symbol
                if (state.history[x].winningCoordinates) {
                    state.history[x].winningCoordinates.forEach((position) => {
                        newSquareStyle[position] = 'square-winner';
                    });
                }
                x++;
            }
            return {
                squares: newSquares,
                squareStyle: newSquareStyle
            }
        });
    }

    handleBoardAction(action) {
        this.setState((state) => {
            return {
                history: state.history.concat({
                    value: action.value + ' on position ' + action.position,
                    add: {
                        symbol: action.value,
                        position: action.position
                    },
                    moveId: state.history.length,
                    winningCoordinates: action.winningCoordinates
                })
            }
        })
    }

    /**
     * Render the game and any game-info
     */
    render() {
        let items = this.state.history.map((item) => {
            return this.renderHistoryItems(item);
        });
        let status = '';
        if (this.state.winner !== null) {
            status = 'Winner: ' + this.state.winner;
        }
        else {
            let player = (this.state.lastMove === 'O') ?'X' : 'O';
            status = 'Next player: ' + player.toString();
        }
        return (
            <div className="game">
                <div className="game-board">
                <div className="status">{status}</div>
                    <Board 
                        BoardActionHandler={this.handleBoardAction}
                        SquareButtonClickHandler={this.handleSquareClick}
                        squares={this.state.squares}
                        squareStyle={this.state.squareStyle}
                    />
                </div>
                <div className="game-info">
                    <div>Moves</div>
                    <ol>{items}</ol>
                </div>
            </div>
        );
    }
}

/**
 * Function component to render
 * history items for game activity
 */
function HistoryItem(props) {
    return (
        <li>
            <button
                onClick={props.timeTravelHandler}
            >{props.entry.value}</button>
        </li>
    );
}
export default Game;
