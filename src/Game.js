import React from 'react';

function Square(props) {
    return (
        <button 
            onClick={props.onClick}
            className="square">
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            winner: null,
            lastMove: 'O',
            squares: Array(9).fill(null)
        }
        this.handleClick = this.handleClick.bind(this);
    }
    renderSquare(i) {
        return <Square 
            value={this.state.squares[i]} 
            onClick={() => this.handleClick(i)}
        />;
    }
    handleClick(i) {
        this.setState((state) => {
            if (state.squares[i] !== null 
             || this.checkWinner(this.state)) {
                return false;
            }
            let mySymbol = 'X';
            if (state.lastMove === 'X') {
                mySymbol = 'O';
            }
            let mySquares = state.squares.slice();
            mySquares[i] = mySymbol;
            return {
                lastMove: mySymbol,
                squares: mySquares
            }
        });
    }

    checkWinner(state) {
        let total = state.squares.length;
        let winningTotal = Math.sqrt(total);
        let lastKey = total-1;

        let xWinner = '';
        for (let x = 0; x<lastKey;x+=winningTotal) {
            xWinner = '';
            for (let y=x;y<winningTotal+x;y++) {
                if (xWinner === '') {
                    xWinner = state.squares[y];
                }
                else if (xWinner !== state.squares[y]) {
                    xWinner = null;
                }
            }
            if (xWinner !== null) {
                break;
            }
        }
        if (xWinner === null || xWinner === '') {
            for (let x = 0; x<winningTotal;x++) {
                xWinner = '';
                for (let y=x;y<total+x;y+=winningTotal) {
                    if (xWinner === '') {
                        xWinner = state.squares[y];
                    }
                    else if (xWinner !== state.squares[y]) {
                        xWinner = null;
                    }
                }
                if (xWinner !== null) {
                    break;
                }
            }
        }
        if (xWinner === null || xWinner === '') {
            xWinner = '';
            for (let x = 0; x<total;x+=winningTotal+1) {
                if (xWinner === '') {
                    xWinner = state.squares[x];
                }
                else if (xWinner !== state.squares[x]) {
                    xWinner = null;
                }
            }
        }
        if (xWinner === null || xWinner === '') {
            xWinner = '';
            for (let x = winningTotal-1; x<((winningTotal-1) * winningTotal)+1 ;x+=winningTotal-1) {
                if (xWinner === '') {
                    xWinner = state.squares[x];
                }
                else if (xWinner !== state.squares[x]) {
                    xWinner = null;
                }
            }
        }
        if (xWinner === null || xWinner === '') {
            return null;
        }
        return xWinner;
    }
    render() {
        let winner = this.checkWinner(this.state);
        let status = '';
        if (winner !== null) {
            status = 'Winner: ' + winner;
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
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
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
