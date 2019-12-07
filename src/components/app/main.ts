import Vue from 'vue';

interface Data {
	gridSize: number;
	numMines: number;
	grid: Array<Array<Cell>>;
}

interface Cell {
	text: string;
	count: number;
	isBomb: boolean;
	style: string;
	neighbors: Array<Cell>;
}

interface Point {
	x: number;
	y: number;
}

/*
 * return a random x,y point
 */
function randomPoint(N: number): Point {
	return {
		x: Math.floor(Math.random() * N),
		y: Math.floor(Math.random() * N),
	};
}

/*
 * create an empty cell
 */
function createCell(): Cell {
	return {
		text: '',
		count: 0,
		isBomb: false,
		style: '',
		neighbors: [],
	};
}

export default Vue.extend({
	name: 'app',
	data(): Data {
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
		cellClick(x: number, y: number) {
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
		checkZeroCell(cell: Cell) {
			if (cell !== null && cell.count === 0 && !cell.isBomb) {
				cell.text = '';
				cell.style = 'background-color: #ccc; border: none';
				cell.neighbors.forEach(cell => {
					this.checkZeroCell(cell);
				});
			}
		},
		flag(x: number, y: number) {
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
		getNeighbors(x: number, y: number): Array<Cell> {
			const points = [
				[x-1, y-1], // top left
				[x, y-1], // top middle
				[x+1, y-1], // top right
				[x-1, y], // left
				[x+1, y], // right
				[x-1, y+1], // bottom left
				[x, y+1], // bottom middle
				[x+1, y+1], // bottom right
			];
			return points
				.filter(([x, y]) => this.inGrid(x, y))
				.map(([x, y]) => this.grid[y][x]);
		},
		/*
		 * Return true if point is inside the grid
		 */
		inGrid(x: number, y: number): boolean {
			return x >= 0 && x < this.gridSize && y >= 0 && y < this.gridSize;
		}
	},
});
