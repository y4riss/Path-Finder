// let grid = [];
// let startPos = {x : 0, y : 0}
// let destPos = {x : 0, y : 0}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class Maze {
  constructor() {
    this.grid = [];
    this.rows = 25;
    this.cols = 50;
    this.src = null;
    this.dest = null;
  }
  fill(wall) {
    for (let r = 0; r < this.rows; r++) {
      const row = [];
      for (let c = 0; c < this.cols; c++) {
        row.push(new Cell(c, r, wall));
      }
      this.grid.push(row);
    }
  }

  draw() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const cell = this.grid[r][c];
        if (cell.wall) cell.div.style.backgroundColor = 'white';
        setTimeout(() => {
          cell.div.style.opacity = 1;
          container.appendChild(cell.div);
        }, (r * this.cols + c) * 0.5);
      }
    }
  }

  addWall(cell) {
    const x = parseInt(cell.dataset.index.split(':')[1]);
    const y = parseInt(cell.dataset.index.split(':')[0]);
    if (
      !this.grid[y][x].wall &&
      !this.grid[y][x].src &&
      !this.grid[y][x].dest
    ) {
      cell.classList.add('wall');
      this.grid[y][x].wall = true;
    }
  }

  removeWall(cell) {
    const x = parseInt(cell.dataset.index.split(':')[1]);
    const y = parseInt(cell.dataset.index.split(':')[0]);
    if (this.grid[y][x].wall) {
      this.grid[y][x].wall = false;
      cell.classList.remove('wall');
    }
  }
}

class Cell {
  constructor(x, y, wall) {
    this.div = document.createElement('div');
    this.x = x;
    this.y = y;
    this.visited = false;
    this.wall = wall;
    this.src = false;
    this.dest = false;
    this.div.classList.add('cell');
    this.div.setAttribute('data-index', `${y}:${x}`);
  }
}

class DragAndDrop {
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
        const startDiv = document.querySelector('.start-div');
        const endDiv = document.querySelector('.end-div');
        e.target.classList.add(className);
        const x = parseInt(e.target.dataset.index.split(':')[1]);
        const y = parseInt(e.target.dataset.index.split(':')[0]);
        if (className === 'start') {
          startDiv.style.pointerEvents = 'none';
          maze.grid[y][x].src = true;
          maze.grid[y][x].div.textContent = 'A';
          maze.src = maze.grid[y][x];
        } else {
          endDiv.style.pointerEvents = 'none';
          maze.grid[y][x].dest = true;
          maze.grid[y][x].div.textContent = 'B';
          maze.dest = maze.grid[y][x];
        }
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

const solver = async () => {
  const grid = maze.grid;
  let sourceCell = maze.src;
  sourceCell.visited = true;
  const queue = [{ cell: sourceCell, path: [sourceCell] }];

  while (queue.length) {
    const { cell, path } = queue.shift();
    if (cell.dest) {
      for (const pathCell of path) {
        await sleep(15);
        if (!(pathCell.src || pathCell.dest))
          pathCell.div.style.backgroundColor = 'rgb(255, 203, 32)';
      }
      return 1;
    }

    const neighbors = getNeighbors(cell, grid, true);
    for (const neighbor of neighbors) {
      if (!neighbor.visited) {
        neighbor.visited = true;
        queue.push({ cell: neighbor, path: [...path, neighbor] });
      }
    }
    if (!cell.src) {
      cell.div.style.backgroundColor = 'rgb(132, 132, 241)';
      // await sleep(0);
    }
  }
  return 0;
};

function getNeighbors(cell, grid, wall) {
  const { x, y } = cell;
  const top = y != 0 ? grid[y - 1][x] : null;
  const left = x != 0 ? grid[y][x - 1] : null;
  const bottom = y != grid.length - 1 ? grid[y + 1][x] : null;
  const right = x != grid[0].length - 1 ? grid[y][x + 1] : null;
  const neighbors = [top, bottom, right, left];
  return neighbors.filter(
    (neighbor) => neighbor != null && neighbor.wall != wall
  );
}

const container = document.querySelector('#grid-container');
let maze = new Maze();
maze.fill(false);
maze.draw();

function generateMaze() {
  alert('not working yet...');
}

(function entryPoint() {
  let mouseDown = false;
  let btn = 0;
  const startDiv = document.querySelector('.start-div');
  const endDiv = document.querySelector('.end-div');
  const solveBtn = document.querySelector('.solve');
  const generateBtn = document.querySelector('.generate');

  generateBtn.addEventListener('click', (e) => {
    generateMaze();
  });

  startDiv.addEventListener('dragstart', () => {
    DragAndDrop.dragDrop(container, 'start');
  });

  endDiv.addEventListener('dragstart', () => {
    DragAndDrop.dragDrop(container, 'end');
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
        maze.addWall(e.target);
      } else {
        maze.removeWall(e.target);
      }
    }
  });
  container.addEventListener('mouseup', () => {
    mouseDown = false;
  });

  solveBtn.addEventListener('click', () => {
    solver();
  });
})();
