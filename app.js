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

const solver = () => {};

(function entryPoint() {
  let mouseDown = false;
  let btn = 0;
  let rows;
  let cols;
  const container = document.getElementById('grid-container');
  const startDiv = document.querySelector('.start-div');
  const endDiv = document.querySelector('.end-div');
  const solveBtn = document.querySelector('.solve');
  let grid = [];
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

  solveBtn.addEventListener('click', (e) => {
    console.log(grid);
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
