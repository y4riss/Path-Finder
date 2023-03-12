class UI {
  static addWall(cell) {
    if (cell.classList.contains('cell') && !cell.classList.contains('wall')) {
      cell.classList.add('wall');
    }
  }

  static deleteWall(cell) {
    if (cell.classList.contains('wall')) cell.classList.remove('wall');
  }
}


(function entryPoint() {
  let mouseDown = false;
  let btn = 0;
  const container = document.getElementById('grid-container');
  const draggable = document.querySelector('.item');
  const cells = container.childNodes;

  draggable.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', e.target.id);
  });



  const dragEnter = (e) => {
    e.preventDefault();
  };

  const dragOver = (e) => {
    e.preventDefault();
    e.target.classList.add('drag-over');
  };

  const dragLeave = (e) => {
    e.target.classList.remove('drag-over');
  };

  const drop = (e) => {
    console.log(4);
    e.target.classList.remove('drag-over');
    e.target.classList.add("start");
    document.body.removeChild(draggable);
  };


  container.addEventListener('dragenter', dragEnter);
  container.addEventListener('dragover', dragOver);
  container.addEventListener('dragleave', dragLeave);
  container.addEventListener('drop', drop);


  container.addEventListener('keydown', (e) => {
    console.log(e);
  });

  //   container.addEventListener('contextmenu', (e) => {
  //     e.preventDefault();
  //   });

  //   container.addEventListener('mousedown', (e) => {
  //     mouseDown = true;
  //     btn = e.button;
  //   });
  //   container.addEventListener('mousemove', (e) => {
  //     if (mouseDown) {
  //       btn === 0
  //         ? UI.addWall(e.target)
  //         : UI.deleteWall(e.target);
  //     }
  //   });
  //   container.addEventListener('mouseup', () => {
  //     mouseDown = false;
  //   });

  const drawBoard = () => {
    const rows = 10;
    const cols = 10;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        setTimeout(() => {
          cell.style.opacity = 1;
          container.appendChild(cell);
        }, (i * cols + j) * 15);
      }
    }
  };
  drawBoard();
})();
