let grid = [];
let startPos = {x : 0, y : 0}
let destPos = {x : 0, y : 0}
class UI {
  static addWall(cell) {
    if (cell.classList.contains('cell') && !cell.classList.contains('wall')) {
      cell.classList.add('wall');
    }
  }

  static deleteWall(cell) {
    if (cell.classList.contains('wall')) cell.classList.remove('wall');
  }

  static dragDrop(container, className) {
    const dragEnter = (e) => {
      e.preventDefault();
    };

    const dragOver = (e) => {
      e.preventDefault();
      if (!e.target.classList.contains('wall'))
        e.target.classList.add(className);
    };

    const dragLeave = (e) => {
      if (!e.target.classList.contains('wall'))
        e.target.classList.remove(className);
    };

    const drop = (e) => {
      if (!e.target.classList.contains('wall')) {
        e.target.classList.add(className);
        const cellIndex = e.target.dataset.index;
        if (className === 'start')
        {
            startPos.x = Math.floor(cellIndex / grid.length)
            startPos.y =  cellIndex % grid[0].length
            grid[startPos.x][startPos.y] = 2;
        }

        else
        destPos.x = Math.floor(cellIndex / grid.length)
        destPos.y =  cellIndex % grid[0].length
        grid[destPos.x][destPos.y] = 3;
      }
      container.removeEventListener('dragenter', dragEnter);
      container.removeEventListener('dragover', dragOver);
      container.removeEventListener('dragleave', dragLeave);
      container.removeEventListener('drop', drop);
    };

    container.addEventListener('dragenter', dragEnter);
    container.addEventListener('dragover', dragOver);
    container.addEventListener('dragleave', dragLeave);
    container.addEventListener('drop', drop);
  }
}

const solver = (grid,startPos,destPos) => {
    
    const queue = [startPos]

    // creating visited array and filling it with 0
    const visited = []
    for(let i = 0 ; i < grid.length ; i++)
    {
        const visitedRow = []
        for(let j = 0 ; j < grid[0].length ; j++)
        visitedRow.push(0)
        visited.push(visitedRow)
    }

    while (queue.length)
    {
        const elem = queue.shift(); // dequeue node from the queue
        visited[elem.x][elem.y] = 1; // mark the node as visited

        // visiting all its neighbours
        /*
        [0,0,0,0]
        [0,0,0,0]
        [0,0,0,0]
        [0,0,0,0]
        */
       if (elem.x != 0 && elem.x != grid.length - 1 && elem.y != 0 && elem.y != grid[0].length)
       {
        
       }

    }
};

(function entryPoint() {
  let mouseDown = false;
  let btn = 0;
  let rows;
  let cols;
  const container = document.getElementById('grid-container');
  const startDiv = document.querySelector('.start-div');
  const endDiv = document.querySelector('.end-div');
  const solveBtn = document.querySelector('.solve');
  startDiv.addEventListener('dragstart', () => {
    UI.dragDrop(container, 'start');
  });

  endDiv.addEventListener('dragstart', () => {
    UI.dragDrop(container, 'end');
  });

  container.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });

  container.addEventListener('mousedown', (e) => {
    mouseDown = true;
    btn = e.button;
  });
  container.addEventListener('mousemove', (e) => {
    if (mouseDown) {
      if (btn === 0) {
        UI.addWall(e.target);
        const cellIndex = e.target.dataset.index;
        grid[Math.floor(cellIndex / rows)][cellIndex % cols] = 1;
      } else {
        UI.deleteWall(e.target);
        const cellIndex = e.target.dataset.index;
        grid[Math.floor(cellIndex / rows)][cellIndex % cols] = 0;
      }
    }
  });
  container.addEventListener('mouseup', () => {
    mouseDown = false;
  });

  solveBtn.addEventListener('click', () => {
    solver(grid,startPos,destPos);
  });
  const drawBoard = () => {
    rows = 10;
    cols = 10;

    for (let i = 0; i < rows; i++) {
      const gridRow = [];
      for (let j = 0; j < cols; j++) {
        gridRow.push(0);
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('data-index', i * cols + j);
        setTimeout(() => {
          cell.style.opacity = 1;
          container.appendChild(cell);
        }, (i * cols + j) * 15);
      }
      grid.push(gridRow);
    }
  };
  drawBoard();
})();
