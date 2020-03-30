import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

function Square(props) {
  let style = {};
  if (props.highlight()) {
    style = {
      background: 'gray',
    };
  }
  return (
    <button
      className="square"
      style={style}
      onClick={() => {
        props.onClick();
      }}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  handleHighlight(i) {
    if (this.props.idx === i) return true;
    if (this.props.triple) {
      for (let k = 0; k < this.props.triple.length; k++) {
        if (this.props.triple[k] === i) return true;
      }
    }
    return false;
  }

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        highlight={() => this.handleHighlight(i)}
        key={i}
      />
    );
  }

  render() {
    let rows = [];
    for (let i = 0; i < 3; i++) {
      let boxes = [];
      for (let j = 0; j < 3; j++) {
        boxes.push(this.renderSquare(i * 3 + j));
      }
      rows.push(
        <div className="board-row" key={i}>
          {boxes}
        </div>,
      );
    }
    return <div>{rows}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{ squares: Array(9).fill(null), idx: -1 }],
      xIsNext: true,
      stepNumber: 0,
      isReversed: false,
    };
    this.handleToggle = this.handleToggle.bind(this);
  }

  jumpTo(step) {
    this.setState({ stepNumber: step, xIsNext: step % 2 === 0 });
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) return;
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{ squares: squares, idx: i }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
  }

  handleToggle() {
    this.setState({ ...this.state, isReversed: !this.state.isReversed });
  }

  render() {
    let history = this.state.history.slice();
    if (this.state.isReversed)
      history = history.slice(0, 1).concat(history.slice(1).reverse());
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      const desc = move
        ? 'Go to x: ' + (step.idx % 3) + ' y: ' + parseInt(step.idx / 3)
        : 'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    let triple = null;
    if (winner) {
      status = 'Winner: ' + winner[0];
      triple = winner[1];
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
            idx={current.idx}
            triple={triple}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>
            <button onClick={() => this.handleToggle()}>toggle</button>
          </div>
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
  let cnt = 0;
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[b] && squares[c]) cnt++;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], [a, b, c]];
    }
  }
  if (cnt === 8) return ['DRAW', null];
  return null;
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));

/*
이동 기록 목록에서 특정 형식(행, 열)으로 각 이동의 위치를 표시해주세요. v
이동 목록에서 현재 선택된 아이템을 굵게 표시해주세요. v
사각형들을 만들 때 하드코딩 대신에 두 개의 반복문을 사용하도록 Board를 다시 작성해주세요. v
오름차순이나 내림차순으로 이동을 정렬하도록 토글 버튼을 추가해주세요. v
승자가 정해지면 승부의 원인이 된 세 개의 사각형을 강조해주세요. v
승자가 없는 경우 무승부라는 메시지를 표시해주세요. v
*/

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
