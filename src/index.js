import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
    return (
        <button className= {'square ' + (props.winningSquare == true ? 'winningSquare' : '')}
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        var isWinner = false;
        if(this.props.winningSquares.includes(i)){
            isWinner = true;
        }
        return (
            <Square key={i}
                value={this.props.squares[i]}
                winningSquare = {isWinner}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    renderBoard(i, j){
        var rows = [];
        for (let x = 0; x < i; x++){
            let cols = [];
            for (let y = 0; y < j; y++){
                cols.push(this.renderSquare(x*3 + y));
            }
            rows.push(<div className="board-row" key={x}>{cols}</div>)
        }
        return rows;
    }

    render() {
        return (
            <div>
                {
                this.renderBoard(3, 3)
                }
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                location: Array(2).fill(null),
            }],
            xIsNext: true,
            stepNumber: 0,
            isDescending: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (squares[i] || calculateWinner(squares)) {
            return;
        }
        else {
            squares[i] = this.state.xIsNext ? 'X' : 'O';
            this.setState({
                xIsNext: !this.state.xIsNext,
                history: history.concat([{
                    squares: squares,
                    location: mapToRowCol(i),
                }]),
                stepNumber: history.length,
            });
        }
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    reverseMoveOrder(){
        this.setState({
            isDescending: !this.state.isDescending,
        });
    }

    renderMoves(){
        const history = this.state.history;
        var movesList = [];
        history.map((step, move) => {
            const desc = move ?
                `Go to move #${move} at (${history[move].location[0]}, ${history[move].location[1]})` :
                "Go to game start";
            movesList.unshift(
                <li key={move}>
                    <button className={(move == this.state.stepNumber) ? 'latest_move' : ''} onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });
        return movesList;
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        var winningSquareArray = [];
        let movesToGo = current.squares.length;

        for(let i = 0; i < current.squares.length; i++){
            if(current.squares[i] != null){
                movesToGo --;
            }
        }

        var moves = this.renderMoves();

        let status;
        if (winner) {
            status = 'Winner: ' + current.squares[winner[0]];
            winningSquareArray = winner;
        }
        else if(movesToGo == 0){
            status = "It's a draw! Try again.";
        }
        else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        winningSquares={winningSquareArray}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <button onClick = {() => {
                        this.reverseMoveOrder();
                    }
                    }>Sort moves</button>
                    <ol>{(!this.state.isDescending) ? moves : moves.reverse()}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return lines[i];
        }
    }
    return null;
}

function mapToRowCol(i) {
    const gridWidth = 3;
    const gridHeight = 3;

    const col = i % gridWidth;
    const row = Math.floor(i / gridHeight);

    return [row, col];
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
