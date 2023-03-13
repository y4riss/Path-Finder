// let grid = [];
// let startPos = {x : 0, y : 0}
// let destPos = {x : 0, y : 0}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


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
        row.push(new Cell(c,r));
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
        }, (r * this.cols + c) * 10);
      }
    }
  }

  addWall(cell)
  {
    const x = parseInt(cell.dataset.index.split(":")[1]) 
    const y = parseInt(cell.dataset.index.split(":")[0]) 
    if (!this.grid[y][x].wall && !this.grid[y][x].src && !this.grid[y][x].dest) {
      cell.classList.add('wall');
      this.grid[y][x].wall = true;
    }
  }

  removeWall(cell)
  {
    const x = parseInt(cell.dataset.index.split(":")[1]) 
    const y = parseInt(cell.dataset.index.split(":")[0]) 
    if (this.grid[y][x].wall )
    {
      this.grid[y][x].wall = false;
      cell.classList.remove('wall');
    } 
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
    this.div.setAttribute("data-index",`${y}:${x}`)
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
        const x = parseInt(e.target.dataset.index.split(":")[1]) 
        const y = parseInt(e.target.dataset.index.split(":")[0]) 
        if (className === 'start')
        {
          startDiv.style.pointerEvents = "none";
          maze.grid[y][x].src = true;
        }
        else
        {
          endDiv.style.pointerEvents = "none";
          maze.grid[y][x].dest = true;

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
    

  const solution = [];
  const grid = maze.grid;
  let sourceCell =null;
  let destCell = null;
  for(let r = 0 ; r < grid.length ; r++)
  {
    for(let c = 0 ; c < grid[0].length ; c++)
    {
      if(sourceCell && destCell) break;
      if(grid[r][c].src)
          sourceCell = grid[r][c];

      else if(grid[r][c].dest)
        destCell = grid[r][c];

    }
  }
  console.log(sourceCell,destCell);
    const queue = [sourceCell]

    while (queue.length)
    {
      const elem = queue.shift();
      solution.push(elem);

      if(elem.dest === true) {
        console.log(queue);
        return 1;
      }

      elem.visited = true;
      if (!elem.src)
        elem.div.style.backgroundColor = "lightblue";
      await sleep(50);

      const top = elem.y !=0 ? grid[elem.y - 1][elem.x] : null;
      const left = elem.x != 0 ? grid[elem.y][elem.x - 1] : null;
      const bottom = elem.y != grid.length - 1 ? grid[elem.y + 1][elem.x] : null;
      const right = elem.x != grid[0].length - 1 ? grid[elem.y][elem.x + 1] : null;

      const neighbours = [top,left,bottom,right];
      for(let i = 0 ; i < 4 ; i++)
      {
          if(neighbours[i] != null && neighbours[i].wall == false && !neighbours[i].visited)
          {        
            if(neighbours[i].dest) return;
            queue.push(neighbours[i]);
            neighbours[i].visited = true;
          }
      }
    }
    return 0;
};


const container = document.querySelector("#grid-container")
const rows = 10 //parseInt(prompt("enter number of rows")) 
const cols = 10 //parseInt(prompt("enter number of cols")) 
const maze = new Maze(rows,cols);
container.style.gridTemplate= `repeat(${rows},1fr) / repeat(${cols},1fr)`
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


    solver();
  });

})();
