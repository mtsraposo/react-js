import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (<Square value={this.props.squares[i]}
                        onClick={() => this.props.onClick(i)}
            />
        );
    }

    /*
    The three dots in JavaScript are the spread / rest operator.
    The spread syntax allows an expression to be expanded in places where multiple arguments are expected.
        myFunction(...iterableObj);
        [...iterableObj, 4, 5, 6]
        [...Array(10)]
     */
    render() {
        const rowCount = 3, colCount = 3;
        return (
            <div>
                {[...new Array(rowCount)].map((x, rowIndex) => {
                        return (
                            <div className="board-row">
                                {[...new Array(colCount)].map((y, colIndex) =>
                                    this.renderSquare(rowIndex*colCount + colIndex) )}
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                coordinate: 0,
            }],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                coordinate: i,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const row = Math.floor(step.coordinate / 3) % 3 + 1;
            const col = step.coordinate % 3 + 1;
            const desc = move ?
                `Go to move # ${move} (${row}, ${col})` :
                'Go to game start';
            let btnStyle = {fontWeight: "normal"};
            if (move === this.state.stepNumber) {
                btnStyle = {fontWeight: "bold"};
            }
            return (
                <li key={move}>
                    <button
                        onClick={() => this.jumpTo(move)}
                        style={btnStyle}
                    >
                        {desc}
                    </button>
                </li>
            );
        });


        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
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
            return squares[a];
        }
    }
    return null;
}

// ========================================

ReactDOM.render(
    <Game/>,
    document.getElementById('root')
);


