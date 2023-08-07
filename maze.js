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
