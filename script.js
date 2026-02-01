// Tic-Tac-Toe: Player = 'X', AI = 'O'
const boardEl = document.getElementById('board');
const messageEl = document.getElementById('message');
const restartBtn = document.getElementById('restart');
const valentineEl = document.getElementById('valentine');
const yesBtn = document.getElementById('yes');

let board = Array(9).fill(null);
const HUMAN = 'X';
const AI = 'O';
let gameOver = false;

function createBoard(){
  boardEl.innerHTML = '';
  for(let i=0;i<9;i++){
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.idx = i;
    cell.addEventListener('click', onCellClick);
    boardEl.appendChild(cell);
  }
}

function onCellClick(e){
  if(gameOver) return;
  const idx = Number(e.currentTarget.dataset.idx);
  if(board[idx]) return;
  makeMove(idx, HUMAN);
  // Automatically move the player's input to a worse cell so the site wins
  autoMoveHuman(idx);
  render();
  const outcome = checkWinner(board);
  if(outcome) return finish(outcome);
  // AI move (unbeatable)
  const aiMove = bestMove(board);
  makeMove(aiMove, AI);
  render();
  const outcome2 = checkWinner(board);
  if(outcome2) return finish(outcome2);
}

function makeMove(idx, player){ board[idx] = player; }

function render(){
  const cells = Array.from(document.querySelectorAll('.cell'));
  cells.forEach((c,i)=>{
    c.textContent = board[i]||'';
    c.classList.toggle('disabled', !!board[i] || gameOver);
  });
  messageEl.textContent = gameOver ? '' : "Your move";
}

function checkWinner(b){
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]
  ];
  for(const [a,b1,c] of lines){
    if(b[a] && b[a]===b[b1] && b[a]===b[c]) return {winner:b[a], line:[a,b1,c]};
  }
  if(b.every(Boolean)) return {winner:'draw'};
  return null;
}

function finish(outcome){
  gameOver = true;
  if(outcome.winner === HUMAN){
    messageEl.textContent = 'You win! (Impossible...)';
  } else if(outcome.winner === AI){
    messageEl.textContent = 'You lost. I win!';
    // Ask to be my Valentine
    showValentine();
  } else {
    messageEl.textContent = "It's a draw.";
  }
  render();
}

function showValentine(){
  valentineEl.classList.remove('hidden');
}

restartBtn.addEventListener('click', ()=>{
  resetGame();
});
yesBtn.addEventListener('click', ()=>{
  valentineEl.classList.add('hidden');
  messageEl.innerHTML = 'Yay! 💖 Thank you! <span class="heart">❤</span>';
});

// Automatically move player's mark to the cell that gives AI the best outcome
function autoMoveHuman(origIdx){
  // If no other empty cells, leave the move as-is
  const empties = [];
  for(let i=0;i<9;i++) if(!board[i] && i!==origIdx) empties.push(i);
  if(empties.length === 0) return;

  // Temporarily clear the original human move
  board[origIdx] = null;

  let bestForAI = -Infinity;
  let chosen = empties[0];
  for(const j of empties){
    board[j] = HUMAN;
    const score = minimax(board, 0, true); // AI to move next
    board[j] = null;
    if(score > bestForAI){ bestForAI = score; chosen = j; }
  }

  // Place the human move at the chosen (worst) cell for the player
  board[chosen] = HUMAN;
}

function resetGame(){
  board = Array(9).fill(null);
  gameOver = false;
  valentineEl.classList.add('hidden');
  messageEl.textContent = 'Game restarted. Your move.';
  render();
}

// Minimax for unbeatable AI
function bestMove(b){
  // AI tries to maximize score
  let bestScore = -Infinity;
  let move = null;
  for(let i=0;i<9;i++){
    if(!b[i]){
      b[i] = AI;
      const score = minimax(b, 0, false);
      b[i] = null;
      if(score > bestScore){ bestScore = score; move = i; }
    }
  }
  // fallback
  return move ?? b.findIndex(x=>!x);
}

function minimax(b, depth, isMaximizing){
  const outcome = checkWinner(b);
  if(outcome){
    if(outcome.winner === AI) return 10 - depth;
    if(outcome.winner === HUMAN) return depth - 10;
    return 0;
  }

  if(isMaximizing){
    let best = -Infinity;
    for(let i=0;i<9;i++){
      if(!b[i]){
        b[i] = AI;
        best = Math.max(best, minimax(b, depth+1, false));
        b[i] = null;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for(let i=0;i<9;i++){
      if(!b[i]){
        b[i] = HUMAN;
        best = Math.min(best, minimax(b, depth+1, true));
        b[i] = null;
      }
    }
    return best;
  }
}

// Initialize
createBoard();
resetGame();

// Create pig-pattern spelling 'LISA'
function createPigPattern(text){
  const container = document.getElementById('pig-pattern') || (()=>{
    const el = document.createElement('div'); el.id = 'pig-pattern'; document.body.appendChild(el); return el;
  })();

  const font = {
    L:[
      '10000',
      '10000',
      '10000',
      '10000',
      '10000',
      '10000',
      '11111'
    ],
    I:[
      '01110',
      '00100',
      '00100',
      '00100',
      '00100',
      '00100',
      '01110'
    ],
    S:[
      '01110',
      '10001',
      '10000',
      '01110',
      '00001',
      '10001',
      '01110'
    ],
    A:[
      '01110',
      '10001',
      '10001',
      '11111',
      '10001',
      '10001',
      '10001'
    ]
  };

  // layout parameters
  const cell = 48; // spacing per grid
  const colsPerChar = 6; // include 1 column spacing
  const rows = 7;
  const startX = 40; // offset from left
  const startY = Math.max(40, (window.innerHeight - rows*cell)/2);

  // clear existing
  container.innerHTML = '';

  for(let ci=0; ci<text.length; ci++){
    const ch = text[ci].toUpperCase();
    const pattern = font[ch];
    if(!pattern) continue;
    for(let r=0;r<rows;r++){
      const row = pattern[r];
      for(let c=0;c<row.length;c++){
        if(row[c] === '1'){
          const x = startX + (ci*colsPerChar + c) * cell;
          const y = startY + r * cell;
          const dot = document.createElement('div');
          dot.className = 'pig-dot';
          dot.style.left = `${x}px`;
          dot.style.top = `${y}px`;
          // slight randomization for natural look
          const rx = (Math.random()-0.5) * 6;
          const ry = (Math.random()-0.5) * 6;
          dot.style.transform = `translate(${rx}px, ${ry}px) rotate(${(Math.random()-0.5)*10}deg)`;
          // stagger animation timing
          dot.style.animationDelay = `${(Math.random()*3).toFixed(2)}s`;
          // vary size a bit
          const scale = 0.9 + Math.random()*0.3;
          dot.style.width = `${Math.round(40*scale)}px`;
          dot.style.height = `${Math.round(40*scale)}px`;
          container.appendChild(dot);
        }
      }
    }
  }
}

// generate pattern
createPigPattern('LISA');
