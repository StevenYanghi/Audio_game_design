
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

document.addEventListener("keydown", function (event) {
	var newRow = currentRow;
	var newCol = currentCol;

	// 在移動角色時檢查是否需要生成關卡
	switch (event.key) {
		case "ArrowUp":
			if (!maze.grid[currentRow][currentCol].walls["N"]) {
				newRow = currentRow - 1;
			}
			break;
		case "ArrowDown":
			if (!maze.grid[currentRow][currentCol].walls["S"]) {
				newRow = currentRow + 1;
			}
			break;
		case "ArrowLeft":
			if (!maze.grid[currentRow][currentCol].walls["W"]) {
				newCol = currentCol - 1;
			}
			break;
		case "ArrowRight":
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
		alert("You win!");
	}
});

