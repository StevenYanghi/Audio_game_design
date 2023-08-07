//迷宮的JS
class Cell {
    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.walls = { "N": true, "S": true, "E": true, "W": true };
        this.visited = false;
    }

    removeWall(other) {
        if (this.row == other.row && this.col < other.col) {
            this.walls["E"] = false;
            other.walls["W"] = false;
        }
        else if (this.row == other.row && this.col > other.col) {
            this.walls["W"] = false;
            other.walls["E"] = false;
        }
        else if (this.col == other.col && this.row < other.row) {
            this.walls["S"] = false;
            other.walls["N"] = false;
        }
        else if (this.col == other.col && this.row > other.row) {
            this.walls["N"] = false;
            other.walls["S"] = false;
        }
    }
}

class Maze {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.grid = [...Array(rows)].map((_, row) => [...Array(cols)].map((_, col) => new Cell(row, col)));
    }

    getNeighbors(cell) {
        let neighbors = [];
        if (cell.row > 0 && !this.grid[cell.row - 1][cell.col].visited) {
            neighbors.push(this.grid[cell.row - 1][cell.col]);
        }
        if (cell.row < this.rows - 1 && !this.grid[cell.row + 1][cell.col].visited) {
            neighbors.push(this.grid[cell.row + 1][cell.col]);
        }
        if (cell.col > 0 && !this.grid[cell.row][cell.col - 1].visited) {
            neighbors.push(this.grid[cell.row][cell.col - 1]);
        }
        if (cell.col < this.cols - 1 && !this.grid[cell.row][cell.col + 1].visited) {
            neighbors.push(this.grid[cell.row][cell.col + 1]);
        }
        return neighbors;
    }

    recursiveDivision(startRow, endRow, startCol, endCol) {
        if (endRow - startRow < 2 || endCol - startCol < 2) {
            return;
        }
        if (Math.random() < 0.5) {
            let wallRow = Math.floor(Math.random() * (endRow - startRow - 1)) + startRow;
            let holeCol = Math.floor(Math.random() * (endCol - startCol)) + startCol;
            for (let col = startCol; col < endCol; col++) {
                if (col != holeCol) {
                    this.grid[wallRow][col].walls["S"] = true;
                }
            }
            this.recursiveDivision(startRow, wallRow, startCol, endCol);
            this.recursiveDivision(wallRow + 1, endRow, startCol, endCol);
        }
        else {
            let wallCol = Math.floor(Math.random() * (endCol - startCol - 1)) + startCol;
            let holeRow = Math.floor(Math.random() * (endRow - startRow)) + startRow;
            for (let row = startRow; row < endRow; row++) {
                if (row != holeRow) {
                    this.grid[row][wallCol].walls["E"] = true;
                }
            }
            this.recursiveDivision(startRow, endRow, startCol, wallCol);
            this.recursiveDivision(startRow, endRow, wallCol + 1, endCol);
        }
    }

    draw() {
        let maze = document.getElementById("maze");
        maze.innerHTML = "";

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                let cell = this.grid[row][col];
                let div = document.createElement("div");
                div.classList.add("cell");

                if (cell.walls["N"]) {
                    div.style.borderTop = "2px solid black";
                }
                if (cell.walls["S"]) {
                    div.style.borderBottom = "2px solid black";
                }
                if (cell.walls["E"]) {
                    div.style.borderRight = "2px solid black";
                }
                if (cell.walls["W"]) {
                    div.style.borderLeft = "2px solid black";
                }

                if (row == 0 && col == 0) {
                    div.classList.add("start");
                }
                else if (row == this.rows - 1 && col == this.cols - 1) {
                    div.classList.add("end");
                }
                else {
                    // Generate random star level
                    const starLevel = Math.floor(Math.random() * 1.07);
                    if(starLevel>0){
                        const star = document.createElement("span");
                        star.innerHTML = "★".repeat(starLevel);
                        div.appendChild(star); 
                        this.grid[row][col].star = true;  
                    }
                }

                maze.appendChild(div);
            }
        }
    }

    generate() {
        this.recursiveDivision(0, this.rows, 0, this.cols);

        let stack = [];
        let current = this.grid[0][0];
        current.visited = true;

        while (true) {
            let neighbors = this.getNeighbors(current);
            if (neighbors.length > 0) {
                stack.push(current);
                let next = neighbors[Math.floor(Math.random() * neighbors.length)];
                current.removeWall(next);
                current = next;
                current.visited = true;
            }
            else if (stack.length > 0) {
                current = stack.pop();
            }
            else {
                break;
            }
        }

        this.draw();
    }


}

var maze = new Maze(20, 20); // 创建20x20大小的迷宫
maze.generate(); // 生成迷宫
maze.draw(); // 绘制迷宫和路径
//maze.recursiveDivision(0, maze.rows, 0, maze.cols);




//角色的JS
var characterElement = document.querySelector(".character");
var mazeElement = document.querySelector("#maze");
var startCell = maze.grid[0][0];
var startTop = startCell.row * 20;
var startLeft = startCell.col * 20;
characterElement.style.top = startTop;
characterElement.style.left = startLeft;
mazeElement.appendChild(characterElement);
characterElement.style.position = "absolute";
characterElement.style.transform = `translate(${startLeft + 10}px, ${startTop + 10}px)`;

var currentRow = 0;
var currentCol = 0;



var newRow = currentRow;
var newCol = currentCol;

function moveCharacter(direction) {
    switch (direction) {
        case "N":
            if (!maze.grid[currentRow][currentCol].walls["N"]) {
                newRow = currentRow - 1;
            }
            break;
        case "S":
            if (!maze.grid[currentRow][currentCol].walls["S"]) {
                newRow = currentRow + 1;
            }
            break;
        case "W":
            if (!maze.grid[currentRow][currentCol].walls["W"]) {
                newCol = currentCol - 1;
            }
            break;
        case "E":
            if (!maze.grid[currentRow][currentCol].walls["E"]) {
                newCol = currentCol + 1;
            }
            break;
    }

    characterElement.style.left = newCol * 24 + "px";
    characterElement.style.top = newRow * 24 + "px";
    currentRow = newRow;
    currentCol = newCol;

    if (currentRow === maze.rows - 1 && currentCol === maze.cols - 1) {
        alert("恭喜您，找到出口！");
    }

    var levels = [
        {
            image: '找不同.png',
            text: '關卡一_找不同'
        },
        {
            image: '找不同羊.png',
            text: '關卡一_找不同'
        },
        {
            image: '快速記憶.png',
            text: '關卡二_快速記憶'
        },
        {
            image: '簡單數獨.png',
            text: '關卡三_簡單數獨'
        },
        {
            image: '重組句子.png',
            text: '關卡四_重組句子'
        }
        // Add more levels as needed
    ];
    
    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }
    
    // Initialize the current level to a random number between 0 and the number of levels
    var currentLevel = getRandomInt(levels.length);
    
    // Get the randomly chosen level
    var chosenLevel = levels[currentLevel];
    
    // Access the image and text properties of the chosen level
    var chosenImage = chosenLevel.image;
    var chosenText = chosenLevel.text;
    
    // Use the chosenImage and chosenText variables as needed
    console.log(chosenImage);
    console.log(chosenText);


    if (maze.grid[newRow][newCol].star) {
        // Remove the star from the cell
        maze.grid[newRow][newCol].star = false;
        //var currentLevel = 0;

        // Display some photos and text
        alert("您遇到了一個關卡！");

        // If you want to show an image, you can create a new image element and append it to the document body
        var img = document.createElement('img');
        img.src =  levels[currentLevel].image; // Get the image from the current level
        document.body.appendChild(img);

        // If you want to show some text, you can create a new paragraph element and append it to the document body
        var p = document.createElement('p');
        p.textContent = levels[currentLevel].text; // Get the text from the current level
        document.body.appendChild(p);

    }
}

document.addEventListener("keydown", function (event) {
    switch (event.key) {
        case "ArrowUp":
            moveCharacter("N")
            break;
        case "ArrowDown":
            moveCharacter("S")
            break;
        case "ArrowLeft":
            moveCharacter("W")
            break;
        case "ArrowRight":
            moveCharacter("E")
            break;
    }
});

const Up = document.getElementById("upButton");
const Down = document.getElementById("downButton");
const Left = document.getElementById("leftButton");
const Right = document.getElementById("rightButton");

Up.addEventListener('click', function () {
    moveCharacter("N");
});

Down.addEventListener('click', function () {
    moveCharacter("S");
});

Left.addEventListener('click', function () {
    moveCharacter("W");
});

Right.addEventListener('click', function () {
    moveCharacter("E");
});