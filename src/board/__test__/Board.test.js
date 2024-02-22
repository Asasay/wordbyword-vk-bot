import Board from "../Board.js";

describe("Board", () => {
  const board = new Board([
    ["п", "а", "c"],
    ["н", "и", "ф"],
    ["ц", "и", "к"],
  ]);

  board.select([0, 0]);

  it("should create board", () => {
    expect(board).toBeDefined();
    expect(board.grid).toEqual([
      [
        { index: [0, 0], letter: "п" },
        { index: [0, 1], letter: "а" },
        { index: [0, 2], letter: "c" },
      ],
      [
        { index: [1, 0], letter: "н" },
        { index: [1, 1], letter: "и" },
        { index: [1, 2], letter: "ф" },
      ],
      [
        { index: [2, 0], letter: "ц" },
        { index: [2, 1], letter: "и" },
        { index: [2, 2], letter: "к" },
      ],
    ]);
  });

  it("should get neighbors for [0, 0]", () => {
    const neighbors = board.getPossibleNeighbors([0, 0]);
    expect(neighbors.map((node) => node.index)).toEqual([
      [0, 1],
      [1, 0],
      [1, 1],
    ]);
    expect(neighbors.map((node) => node.letter)).toEqual(["а", "н", "и"]);
  });

  it("should get neighbors for [1, 1]", () => {
    const neighbors = board.getPossibleNeighbors([1, 1]);
    expect(neighbors.map((node) => node.index)).toEqual([
      [0, 1],
      [0, 2],
      [1, 0],
      [1, 2],
      [2, 0],
      [2, 1],
      [2, 2],
    ]);
    expect(neighbors.map((node) => node.letter)).toEqual(["а", "c", "н", "ф", "ц", "и", "к"]);
  });

  it("should select [0,1] and [1,1]", () => {
    board.select([0, 1]);
    expect(board.selected.map((node) => node.letter)).toEqual(["п", "а"]);
    board.select([1, 1]);
    expect(board.selected.map((node) => node.letter)).toEqual(["п", "а", "и"]);
    expect(board.selected.toString()).toEqual("паи");
  });
});
