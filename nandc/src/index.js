import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// NOTES
// [DONE] - Display the location for each move in the format (col, row) in the move history list.
// [DONE] - Bold the currently selected item in the move list.
// [DONE] - Rewrite Board to use two loops to make the squares instead of hardcoding them.
// [ ] - Add a toggle button that lets you sort the moves in either ascending or descending order.
// [DONE] - When someone wins, highlight the three squares that caused the win.
// [DONE] - When no one wins, display a message about the result being a draw.

function Square(props) {
  return (
    <button className={"square "+props.squareClass} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i, squareClass) {
    return (
      <Square
        key={"square"+i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        squareClass={squareClass}
      />
    );
  }

  render() {
    return (
      <div>
        {[...Array(3)].map((e, i) => {
          return (
            <div key={"row"+i} className="board-row w-100 d-flex justify-content-center">
              {[...Array(3)].map((j, x) => {
                const position = (3*i)+(x)
                let squareClass = this.props.winner.includes(position) ? "bg-success" : "";
                return (this.renderSquare(position, squareClass))
              })}
            </div>
          )
        })}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true
    };
  }

  handleClick(i) {
    const location = calculatePosition(i);
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    // The square has not been set yet so this is just to protect from being 
    // able to continue the game past the point of winning
    // squares[i] checks to see if the square is not null i.e. it has already been set
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      orderAsc: false,
      history: history.concat([{
        squares: squares,
        locationLatest: location
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

  reverseOrder() {
    this.setState({
      orderAsc: !this.state.orderAsc,
    })
  }

  render() {
    const history = this.state.history;
    const stepNumber = this.state.stepNumber;
    const current = history[stepNumber];
    const winner = calculateWinner(current.squares);
    const order = this.state.orderAsc;

    const moves = history.map((step, move, obj) => {
      let loc = obj[move].locationLatest

      const desc = move ?
        'Go to move #' + move + ", ("+loc[0]+", "+loc[1]+")" :
        'Go to game start (col, row)';

      let styleSelectedMove = move === stepNumber ? "btn-dark" : "btn-light";
      return (
        <li key={move}>
          <button className={"btn " + styleSelectedMove + " border shadow-sm m-2 "} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let movesOrdered;
    if (order){
      movesOrdered = moves.reverse()
    } else {
      movesOrdered = moves
    }

    let status;
    if (winner) {
      status = 'Winner: ' + winner[0];
    } else if (stepNumber === current.squares.length) {
      status = 'Draw: 🤼‍♀️';
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game flex-column w-100">
        <h1 className="display-1 m-auto p-5">Noughts and Crosses</h1>
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winner={winner ? winner[1] : ""}
          />
        </div>
        <div className="game-info mt-5">
          <div className="display-6 mb-4">{status}</div>
          <div className=""><button className="btn btn-light border" onClick={() => this.reverseOrder()}>Change order: {order ? "Descending" : "Ascending"}</button></div>
          <ol reversed={order}>{movesOrdered}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

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
      return [squares[a], lines[i]];
    }
  }
  return null;
}

function calculatePosition(i) {
  let row = Math.floor(i / 3)+1;
  let col = (i % 3)+1;

  return [ col, row ];
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
