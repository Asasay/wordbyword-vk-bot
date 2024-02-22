export class BoardNode {
  letter: string;
  index: [number, number];

  constructor(letter: string, index: [number, number]) {
    this.letter = letter;
    this.index = index;
  }
}

export default class Board {
  grid: BoardNode[][];
  dimensions: number;
  selected: BoardNode[] = [];

  constructor(grid: string[][]) {
    this.grid = grid.map((row, x) => row.map((letter, y) => new BoardNode(letter, [x, y])));
    this.dimensions = grid.length;
    this.selected.toString = () => {
      return this.selected.map((node) => node.letter).join("");
    };
  }

  select(nodeOrIndex: [number, number] | BoardNode) {
    if (Array.isArray(nodeOrIndex)) {
      const ind = nodeOrIndex;
      this.selected.push(this.grid[ind[0]][ind[1]]);
    } else this.selected.push(nodeOrIndex);
    return this;
  }

  deselect() {
    this.selected.length = 0;
    return this;
  }

  getPossibleNeighbors(nodeOrIndex: [number, number] | BoardNode) {
    const targetIndex = Array.isArray(nodeOrIndex) ? nodeOrIndex : nodeOrIndex.index;
    const adjacentCoords = this.#findAdjacentCoords(...targetIndex);
    const adjacentNodes = adjacentCoords.map((coords) => this.grid[coords[0]][coords[1]]);
    return adjacentNodes.filter((node) => !this.selected.includes(node));
  }

  #findAdjacentCoords(x: number, y: number) {
    return [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ] // all the possible directions
      .map(([xd, yd]) => [x + xd, y + yd]) // adjust the starting point
      .filter(([x, y]) => x >= 0 && x < this.dimensions && y >= 0 && y < this.dimensions); // filter out those out of bounds
  }

  toString() {
    return this.grid.map((row) => row.map((node) => node.letter)).toString();
  }
}
