/*
 * return a random x,y point
 */
function randomPoint(N) {
	return {
		x: Math.floor(Math.random() * N),
		y: Math.floor(Math.random() * N),
	};
}

/*
 * create an empty cell
 */
function createCell() {
	return {
		text: '',
		count: 0,
		isBomb: false,
		style: '',
		neighbors: null,
	};
}

export default {
	name: 'app',
	data() {
		return {
			gridSize: 15,
			numMines: 50,
			grid: []
		};
	},
	mounted() {
		this.reset();
	},
	methods: {
		cellClick(x, y) {
			const cell = this.grid[x][y];
			if (cell.isBomb) {
				cell.text = 'X';
				cell.style = 'background-color: #c44; border: none';
			} else {
				cell.text = cell.count.toString();
				cell.style = 'background-color: #ccc; border: none';
				this.checkZeroCell(cell);
			}
		},
		checkZeroCell(cell) {
			if (cell !== null && cell.count === 0 && !cell.isBomb) {
				cell.text = '';
				cell.style = 'background-color: #ccc; border: none';
				cell.neighbors.forEach(cell => {
					this.checkZeroCell(cell);
				});
			}
		},
		flag(x, y) {
			const cell = this.grid[x][y];
			cell.style = 'background-color: #4c4; border: none';
		},
		reset() {
			this.initGrid();
			this.addMines();
			this.initCells();
		},
		/*
		 * Create the grid of cells
		 */
		initGrid() {
			this.grid = [];
			for (let i=0; i < this.gridSize; i++) {
				this.grid.push([]);
				for (let j=0; j < this.gridSize; j++) {
					this.grid[i].push(createCell());
				}
			}
		},
		addMines() {
			for (let i=0; i < this.numMines; i++) {
				const { x, y } = randomPoint(this.gridSize);
				this.grid[y][x].isBomb = true;
			}
		},
		/*
		 * intialize the cells with data
		 */
		initCells() {
			for (let y=0; y < this.gridSize; y++) {
				for (let x=0; x < this.gridSize; x++) {
					const cur = this.grid[y][x];
					const neighbors = this.getNeighbors(x, y);
					cur.count = neighbors.reduce((sum, cell) => sum + (cell !== null && cell.isBomb ? 1 : 0), 0);
					cur.neighbors = neighbors;
				}
			}
		},
		getNeighbors(x, y) {
			const neighbors = [
				this.inGrid(x-1, y-1) ? this.grid[y-1][x-1] : null, // top left
				this.inGrid(x, y-1) ? this.grid[y-1][x] : null, // top middle
				this.inGrid(x+1, y-1) ? this.grid[y-1][x+1] : null, // top right
				this.inGrid(x-1, y) ? this.grid[y][x-1] : null, // left
				this.inGrid(x+1, y) ? this.grid[y][x+1] : null, // right
				this.inGrid(x-1, y+1) ? this.grid[y+1][x-1] : null, // bottom left
				this.inGrid(x, y+1) ? this.grid[y+1][x] : null, // bottom middle
				this.inGrid(x+1, y+1) ? this.grid[y+1][x+1] : null, // bottom right
			];
			return neighbors;
		},
		/*
		 * Return true if point is inside the grid
		 */
		inGrid(x, y) {
			return x >= 0 && x < this.gridSize && y >= 0 && y < this.gridSize;
		}
	},
};
