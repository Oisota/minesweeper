function randomPoint(N) {
	return {
		x: Math.floor(Math.random() * N),
		y: Math.floor(Math.random() * N),
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
			}
		},
		flag(x, y) {
			const cell = this.grid[x][y];
			cell.style = 'background-color: #4c4; border: none';
		},
		reset() {
			this.initGrid();
			this.addMines();
			this.calculateCounts;
		},
		initGrid() {
			this.grid = [];
			for (let i=0; i < this.gridSize; i++) {
				this.grid.push([]);
				for (let j=0; j < this.gridSize; j++) {
					this.grid[i].push({
						text: '',
						count: 0,
						isBomb: false,
						style: '',
					});
				}
			}
		},
		addMines() {
			for (let i=0; i < this.numMines; i++) {
				const { x, y } = randomPoint(this.gridSize);
				this.grid[y][x].isBomb = true;
			}
		},
		calculateCounts() {
			for (let y=0; y < this.gridSize; y++) {
				for (let x=0; x < this.gridSize; x++) {
					const cur = this.grid[y][x];
					const tl = this.inGrid(x-1, y-1) && this.grid[y-1][x-1].isBomb ? 1 : 0; // top left
					const tm = this.inGrid(x, y-1) && this.grid[y-1][x].isBomb ? 1 : 0; // top middle
					const tr = this.inGrid(x+1, y-1) && this.grid[y-1][x+1].isBomb ? 1 : 0; // top right
					const l = this.inGrid(x-1, y) && this.grid[y][x-1].isBomb ? 1 : 0; // left
					const r = this.inGrid(x+1, y) && this.grid[y][x+1].isBomb ? 1 : 0; // right
					const bl = this.inGrid(x-1, y+1) && this.grid[y+1][x-1].isBomb ? 1 : 0; // bottom left
					const bm = this.inGrid(x, y+1) && this.grid[y+1][x].isBomb ? 1 : 0; // bottom middle
					const br = this.inGrid(x+1, y+1) && this.grid[y+1][x+1].isBomb ? 1 : 0; // bottom right
					cur.count = [tl, tm, tr, l, r, bl, bm, br]
						.reduce((a, b) => a + b, 0);
				}
			}
		},
		/*
		 * Return true if point is inside the grid
		 */
		inGrid(x, y) {
			return x >= 0 && x < this.gridSize && y >= 0 && y < this.gridSize;
		}
	},
};
