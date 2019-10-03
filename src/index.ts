/**
 * @class BitBoard
 * @author Cj D'Agostino
 * 
 * @param input : object = { [optional]: boardType, board }
 * 
 * @augments boardType : [optional] string equal to one of the following:
 *      "black", "white", "piece", "pawn", "knight", "bishop", "rook", "queen", "king"
 * 
 * @arguments board : [optional] Array<number> with length = 2 and each number n: 0 <= n < 2 ^ 32
 * 
 * NOTE:
 *    if boardType is present, board is ignored
 *    if neither boardType or board are present, BitBoard.board = [0, 0]
 */

interface BitBoardInputDictionary {
  boardType?: string,
  board?: Array<number>
}

class BitBoard {

  public board: Array<number>;
  public length: number;
  private readonly BITS_PER_BUCKET: number;
  private readonly MAX_BITS: number;

  constructor(input: BitBoardInputDictionary) {
    let boardType;
    let board;

    if (input) {
      boardType = input.boardType;
      board = input.board;
    }

    this.MAX_BITS = 4294967296; // (2 ^ 32)
    this.BITS_PER_BUCKET = 32;
    this.length = 64;
    this.board;

    if (boardType) {
        switch (boardType) {
          case 'piece':
            this.board = [4294901760,65535];
            break;
          case 'black':
            this.board = [0,65535];
            break;
          case 'white':
            this.board = [4294901760,0];
            break;
          case 'pawn':
            this.board = [16711680, 65280];
            break;
          case 'knight':
            this.board = [1107296256, 66];
            break;
          case 'bishop':
            this.board = [603979776, 36];
            break;
          case 'rook':
            this.board = [2164260864,129];
            break;
          case 'queen':
            this.board = [268435456, 16];
            break;
          case 'king':
            this.board = [134217728, 8];
            break;
          default:
            throw new SyntaxError(`Input: ${boardType} is not a valid value for boardType. Must be one of the following:
              "black", "white", "piece", "pawn", "knight", "bishop", "rook", "queen", "king"`);
            break;
        }
    } else if (board) {
      if (board.length !== 2 && !board.every(x => Math.floor(x) === x && x >= 0 && x < this.MAX_BITS)) {
        throw new RangeError('inputs to board array must be two integers x where  0 <= x < 2 ^ 32 (or 4294967296)');
      }
      this.board = board;
    } else  {
      this.board = [0, 0];
    }
  }

  /**
   * @param bit: Object
   * @returns boolean
   */
  determineIfBitBoard(bitBoard: BitBoard): boolean {
    const names = Object.getOwnPropertyNames(bitBoard);

    const doPrototypesMatch: boolean = Object.getPrototypeOf(bitBoard) === BitBoard.prototype;
    const arePropertyNamesCorrect = names.every(name => ['board', 'length', 'BITS_PER_BUCKET', 'MAX_BITS'].indexOf(name) !== -1);
    const isBoardLengthCorrect: boolean = bitBoard.board && bitBoard.board.length === 2 && bitBoard.length === this.length;
    const isBoardArrayCorrect: boolean = Array.isArray(bitBoard.board) &&
      bitBoard.board.every(b => typeof b === 'number' && b >= 0 && b < this.MAX_BITS && Math.floor(b) === b);

    return arePropertyNamesCorrect && isBoardLengthCorrect && isBoardArrayCorrect && doPrototypesMatch;
  }
  
  /**
   * @returns string
   */
  boardToString(): string {
    let str = '';

    for (let i = 0; i < this.board.length; i++) {
      str += padString((this.board[i] >>> 0).toString(2), this.BITS_PER_BUCKET, '0', true);
    }
    return str;
  }

  /**
   * @param index : number
   * @returns 1 or 0
   */
  getIndex(index: number): number {
    if (Math.floor(index) === index && index >= 0 && index < this.length) {

      const powOfTwo: number = 2 ** (index % this.BITS_PER_BUCKET);
      const bucketOffset: number = index > this.BITS_PER_BUCKET ? 1 : 0

      return ((this.board[1 - bucketOffset] & powOfTwo) >>> 0) > 0 ? 1 : 0;
    }
    throw new RangeError('index must be integer greater than or equal to 0 and less than 64');
  }

  /**
   * @returns BitBoard
   */
  copy = (): BitBoard => new BitBoard({ board: this.board.slice() });

  /**
   * @param bitBoardOrIndex: BitBoard | number
   * @returns BitBoard
   */
  and(bitBoardOrIndex: BitBoard | number): BitBoard {
    let newBoard: BitBoard = this.copy();

    if (typeof bitBoardOrIndex === 'number') {
      
      if (bitBoardOrIndex >= 0 && bitBoardOrIndex < this.length) {
        return newBoard;
      }
      throw new RangeError('index must be integer greater than or equal to 0 and less than 64')

    } else if (this.determineIfBitBoard(bitBoardOrIndex)) {

      for (let i = 0; i < this.board.length; i++) {
        newBoard.board[i] = (newBoard.board[i] & bitBoardOrIndex.board[i]) >>> 0;
      }
      return newBoard;
    }
    throw new TypeError('Invalid input. Must be of type "BitBoard" or "number"');
  }

  /**
   * @param bitBoardOrIndex: BitBoard | number
   * @returns BitBoard
   */
  or(bitBoardOrIndex: BitBoard | number): BitBoard {
    let newBoard: BitBoard = this.copy();

    if (typeof bitBoardOrIndex === 'number') {
      
      if (bitBoardOrIndex >= 0 && bitBoardOrIndex < this.length) {

        const powOfTwo: number = 2 ** (bitBoardOrIndex % this.BITS_PER_BUCKET);
        const index: number = bitBoardOrIndex >= this.BITS_PER_BUCKET ? 0 : 1

        newBoard.board[index] = (newBoard.board[index] | powOfTwo) >>> 0;

        return newBoard;
      }
      throw new RangeError('index must be integer greater than or equal to 0 and less than 64')

    } else if (this.determineIfBitBoard(bitBoardOrIndex)) {

      for (let i = 0; i < this.board.length; i++) {
        newBoard.board[i] = (newBoard.board[i] | bitBoardOrIndex.board[i]) >>> 0;
      }
      return newBoard;
    }
    throw new TypeError('Invalid input. Must be of type "BitBoard" or "number"');
  }

  /**
   * @param bitBoardOrIndex: BitBoard | number
   * @returns BitBoard
   */
  xOr(bitBoardOrIndex: BitBoard | number): BitBoard {
    let newBoard: BitBoard = this.copy();

    if (typeof bitBoardOrIndex === 'number') {
      
      if (bitBoardOrIndex >= 0 && bitBoardOrIndex < this.length) {

        const powOfTwo: number = 2 ** (bitBoardOrIndex % this.BITS_PER_BUCKET);
        const index: number = bitBoardOrIndex >= this.BITS_PER_BUCKET ? 0 : 1;

        newBoard.board[index] = (newBoard.board[index] ^ powOfTwo) >>> 0;

        return newBoard;
      }
      throw new RangeError('index must be integer greater than or equal to 0 and less than 64')

    } else if (this.determineIfBitBoard(bitBoardOrIndex)) {

      for (let i = 0; i < this.board.length; i++) {
        newBoard.board[i] = (newBoard.board[i] ^ bitBoardOrIndex.board[i]) >>> 0;
      }
      return newBoard;
    }
    throw new TypeError('Invalid input. Must be of type "BitBoard" or "number"');
  }

  /**
   * @returns BitBoard
   */
  not(): BitBoard {
    const newBoard = this.copy();
    
    for (let i: number = 0; i < newBoard.board.length; i++) {
      newBoard.board[i] = (~newBoard.board[i]) >>> 0;
    }
    return newBoard;
  }

  /**
   * @param shiftAmount: number
   * @returns BitBoard
   */
  shiftLeft(shiftAmount: number): BitBoard {
    if (typeof shiftAmount === 'number') {
      if (shiftAmount >= 0 && shiftAmount <= this.BITS_PER_BUCKET) {

        let newBoard = this.copy();
        
        const bitMask = ((2 ** shiftAmount - 1) << (this.BITS_PER_BUCKET - shiftAmount)) >>> 0;
        const carryDigits = ((newBoard.board[1] & bitMask) >>> 0) >>> (this.BITS_PER_BUCKET - shiftAmount);

        if (shiftAmount === this.BITS_PER_BUCKET) {
          newBoard.board[1] = 0;
          newBoard.board[0] = carryDigits;
        } else {
          newBoard.board[1] = (newBoard.board[1] << shiftAmount) >>> 0;
          newBoard.board[0] = (((newBoard.board[0] << shiftAmount) >>> 0) | carryDigits) >>> 0;
        }

        return newBoard;
      }
      throw new RangeError('Invalid input. index n must satisfy 0 <= n <= 64');
    }
    throw new TypeError('Invalid input. Must be "number"');
  }

  /**
   * @param shiftAmount: number
   * @returns BitBoard
   */
  shiftRight(shiftAmount: number): BitBoard {
    if (typeof shiftAmount === 'number') {
      if (shiftAmount >= 0 && shiftAmount <= this.BITS_PER_BUCKET) {
        let newBoard = this.copy();
        
        const bitMask = ((2 ** shiftAmount - 1) << (this.BITS_PER_BUCKET - shiftAmount)) >>> 0;
        const carryDigits = ((newBoard.board[0] << (this.BITS_PER_BUCKET - shiftAmount) >>> 0) & bitMask) >>> 0;

        if (shiftAmount === this.BITS_PER_BUCKET) {
          newBoard.board[0] = 0;
          newBoard.board[1] = carryDigits;
        } else {
          newBoard.board[0] = (newBoard.board[0] >>> shiftAmount) >>> 0;
          newBoard.board[1] = ((newBoard.board[1] >>> shiftAmount) | carryDigits) >>> 0;
        }

        return newBoard;
      }
      throw new RangeError('Invalid input. index n must satisfy 0 <= n <= 64');
    }
    throw new TypeError('Invalid input. Must be "number"');
  }
}

/**
 * @param str: string
 * @param length: number
 * @param padValue: string
 * @param start: boolean
 * @returns string
 */
function padString(str: string, length: number, padValue: string, start: boolean): string {
  if (start) {
    for (let i: number = str.length; i < length; i++) {
      str = padValue + str;
    }
  } else {
    for (let i: number = str.length; i < length; i++) {
      str += padValue;
    }
  }

  return str;
}

export = BitBoard;
