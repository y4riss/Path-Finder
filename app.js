// let grid = [];
// let startPos = {x : 0, y : 0}
// let destPos = {x : 0, y : 0}




class Maze{

  constructor(rows,cols)
  {
      this.grid = [];
      this.rows = rows;
      this.cols = cols;
  }


  fill()
  {
    for(let r = 0 ; r < this.rows ; r++)
    {
      const row = [];
      for(let c = 0 ; c < this.cols ; c++)
      {
        row.push(new Cell(r,c));
      }
      this.grid.push(row);
    }
  }

  draw()
  {
    this.fill();
    for(let r = 0 ; r < this.rows ; r++)
    {
      for(let c = 0 ; c < this.cols ; c++)
      {
        const cell = this.grid[r][c].div;
        setTimeout(() => {
          cell.style.opacity = 1;
          container.appendChild(cell);
        }, (r * this.cols + c) * 15);
      }
    }
  }

  addWall(cell)
  {
    const x = parseInt(cell.dataset.index.split(":")[0]) 
    const y = parseInt(cell.dataset.index.split(":")[1]) 
    this.grid[x][y].wall = true;
    if (cell.classList.contains('cell') && !cell.classList.contains('wall')) {
      cell.classList.add('wall');
    }
  }

  removeWall(cell)
  {
    const x = parseInt(cell.dataset.index.split(":")[0]) 
    const y = parseInt(cell.dataset.index.split(":")[1]) 
    this.grid[x][y].wall = false;
    if (cell.classList.contains('wall')) cell.classList.remove('wall');
  }

}

class Cell{

  constructor(x,y)
  {
    this.x = x;
    this.y = y;
    this.visited = false;
    this.wall = false;
    this.src = false;
    this.dest = false;
    this.div = document.createElement("div");
    this.div.classList.add("cell");
    this.div.setAttribute("data-index",`${x}:${y}`)
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
        e.target.classList.add(className);
        const x = parseInt(e.target.dataset.index.split(":")[0]) 
        const y = parseInt(e.target.dataset.index.split(":")[1]) 
        if (className === 'start')
           maze.grid[x][y].src = true;
        else
          maze.grid[x][y].dest = true;

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


const container = document.querySelector("#grid-container")
const maze = new Maze(10,10);
maze.draw();


(function entryPoint() {
  let mouseDown = false;
  let btn = 0;
  const startDiv = document.querySelector('.start-div');
  const endDiv = document.querySelector('.end-div');
  const solveBtn = document.querySelector('.solve');



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
    solver(grid,startPos,destPos);
  });

})();
