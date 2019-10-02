* @author cj dagostino
/**
 * 
 * @class BitBoard
 * @param bitRows: [optional] Array<number>
 * Each number must be an INTEGER in the range of 0-255; i.e. each number is a byte
 * DEFAULT: bitRows = [0,0,0,0,0,0,0,0].length = 8; i.e. 8 bytes)
 * Each value: n is converted to an integer and then set to 0 if n > 255
 */

class BitBoard {

  public board: Array<number>;
  public length: number;
  private readonly bitsPerByte: number;
  private readonly BITS_PER_BUCKET: number;
  private readonly MAX_BITS: number;

  /**
   * @param bitRows: Array<number>
   */
  constructor(bitRows: number[] = [0, 0]) {
    if (!Array.isArray(bitRows) || bitRows.some(x => typeof x !== 'number')) {
      throw new TypeError('Invalid Input. Must be "Array" of "numbers"')
    }

    this.MAX_BITS = 4294967296;
    this.board = bitRows;
    this.length = 64;
    this.BITS_PER_BUCKET = 32;

  if (bitRows.length !== 2 && !bitRows.every(x => Math.floor(x) === x && x >= 0 && x < this.MAX_BITS)) {
      throw new RangeError('inputs to bitRows array must be two integers x where  0 <= x < 2 ^ 32 (or 4294967296)');
    }
  }

  /**
   * @param bit: Object
   * @returns boolean
   */
  determineIfBitBoard(bitBoard: BitBoard): boolean {
    const names = Object.getOwnPropertyNames(bitBoard);
    if (typeof bitBoard === 'object') {
      const arePropertyNamesCorrect = names.every(name => ['board', 'length', 'BITS_PER_BUCKET', 'MAX_BITS'].indexOf(name) !== -1);
      const isBoardCorrectArray: boolean = Array.isArray(bitBoard.board) && bitBoard.board.length === 2;
      const isBoardValidNumber: boolean = bitBoard.board.every(b => typeof b === 'number' && b >= 0 && b < this.MAX_BITS && Math.floor(b) === b);
      const isBoardLengthCorrect: boolean = bitBoard.length === this.length;
      const doPrototypesMatch: boolean = Object.getPrototypeOf(bitBoard) === BitBoard.prototype;

      return arePropertyNamesCorrect && isBoardCorrectArray && isBoardValidNumber && isBoardLengthCorrect && doPrototypesMatch;
    }
    return false;
  }
  
  /**
   * @returns string
   */
  boardToString() {
    let str = '';

    for (let i = 0; i < this.board.length; i++) {

      str += padString(this.board[i].toString(2), this.BITS_PER_BUCKET, '0', true);
    }
    return str;
  }

  /**
   * 
   * @param index : number
   * @returns 1 or 0
   */
  getIndex(index: number): number {
    if (Math.floor(index) === index && index > -1 && index < this.length) {

      const powOfTwo: number = 2 ** (index % this.BITS_PER_BUCKET);
      const bucketOffset: number = (index % this.length) > this.BITS_PER_BUCKET ? 1 : 0

      return (this.board[1 - bucketOffset] & powOfTwo) > 0 ? 1 : 0;
    }
    throw new RangeError('index must be integer greater than or equal to 0 and less than BitBoard.length');
  }

  /**
   * @returns BitBoard
   */
  copy = (): BitBoard => new BitBoard(this.board.slice());

  /**
   * 
   * @param bitBoardOrIndex: BitBoard | number
   * @returns BitBoard
   */
  and(bitBoardOrIndex: BitBoard | number): BitBoard {
    let newBoard: BitBoard = this.copy();

    if (typeof bitBoardOrIndex === 'number') {
      if (bitBoardOrIndex >= 0 && bitBoardOrIndex < this.length) {
        return newBoard;
      }
      throw new RangeError('index must be integer greater than or equal to 0 and less than BitBoard.length')

    } else if (this.determineIfBitBoard(bitBoardOrIndex)) {
      if (this.length === bitBoardOrIndex.length) {

        for (let i = 0; i < this.board.length; i++) {
          newBoard.board[i] &= bitBoardOrIndex.board[i];
        }
        return newBoard;
      }
      throw new RangeError('BitBoard lengths do not match');
    }
    throw new TypeError('Invalid input. Must be of type "BitBoard" or "number"');
  }

  /**
   * 
   * @param bitBoardOrIndex: BitBoard | number
   * @returns BitBoard
   */
  or(bitBoardOrIndex: BitBoard | number): BitBoard {
    let newBoard: BitBoard = this.copy();

    if (typeof bitBoardOrIndex === 'number') {
      if (bitBoardOrIndex >= 0 && bitBoardOrIndex < this.length) {

        const powOfTwo: number = 2 ** (bitBoardOrIndex % this.BITS_PER_BUCKET);
        const bucketOffset: number = (bitBoardOrIndex % this.length) > this.BITS_PER_BUCKET ? 1 : 0

        newBoard.board[1 - bucketOffset] |= powOfTwo;

        return newBoard;
      }
      throw new RangeError('index must be integer greater than or equal to 0 and less than BitBoard.length')

    } else if (this.determineIfBitBoard(bitBoardOrIndex)) {
      if (this.length === bitBoardOrIndex.length) {

        for (let i = 0; i < this.board.length; i++) {
          newBoard.board[i] |= bitBoardOrIndex.board[i];
        }
        return newBoard;
      }
      throw new RangeError('BitBoard lengths do not match');
    }
    throw new TypeError('Invalid input. Must be of type "BitBoard" or "number"');
  }

  /**
   * 
   * @param bitBoardOrIndex: BitBoard | number
   * @returns BitBoard
   */
  xOr(bitBoardOrIndex: BitBoard | number): BitBoard {
    let newBoard: BitBoard = this.copy();

    if (typeof bitBoardOrIndex === 'number') {
      if (bitBoardOrIndex >= 0 && bitBoardOrIndex < this.length) {

        const powOfTwo: number = 2 ** (bitBoardOrIndex % this.BITS_PER_BUCKET);
        const bucketOffset: number = (bitBoardOrIndex % this.length) > this.BITS_PER_BUCKET ? 1 : 0

        newBoard.board[1 - bucketOffset] ^= powOfTwo;

        return newBoard;
      }
      throw new RangeError('index must be integer greater than or equal to 0 and less than BitBoard.length')

    } else if (this.determineIfBitBoard(bitBoardOrIndex)) {
      if (this.length === bitBoardOrIndex.length) {

        for (let i = 0; i < this.board.length; i++) {
          newBoard.board[i] ^= bitBoardOrIndex.board[i];
        }
        return newBoard;
      }
      throw new RangeError('BitBoard lengths do not match');
    }
    throw new TypeError('Invalid input. Must be of type "BitBoard" or "number"');
  }

  /**
   * @returns BitBoard
   */
  not(): BitBoard {
    let strBoard: string = this.boardToString();
    let newStr: string;
    let notBoard: Array<number> = [];
    let i: number = 0

    while (i < this.length) {
      newStr = '';

      while(i % this.bitsPerByte !== 0) {
        newStr += strBoard[i] === '1' ? '0' : '1';
        i++;
      }
      notBoard.push(parseInt(newStr, 2))
    }
    const newBoard = this.copy();
    newBoard.board = notBoard;
    
    return newBoard;
  }

  /**
   * 
   * @param shiftAmount: number
   * @returns BitBoard
   */
  shiftLeft(shiftAmount: number): BitBoard {
    if (typeof shiftAmount === 'number') {
      if (shiftAmount >= 0 && shiftAmount <= this.length) {
        let str: string = this.boardToString();
        str += '0'.repeat(shiftAmount);
        str = str.slice(shiftAmount);

        let newBoard = this.copy();
        
        for (let i: number = 0, b = 0; i < this.board.length; i++ , b += this.bitsPerByte) {
          newBoard.board[i] = parseInt(str.slice(b, b + this.bitsPerByte), 2);
        }
        return newBoard;
      }
      throw new RangeError('Invalid input. Must be greater than or equal to zero and less than or equal to BitBoard.length');
    }
    throw new TypeError('Invalid input. Must be "number"');
  }

  /**
   * 
   * @param shiftAmount: number
   * @returns BitBoard
   */
  shiftRight(shiftAmount: number): BitBoard {
    if (typeof shiftAmount === 'number') {
      if (shiftAmount >= 0 && shiftAmount <= this.length) {
        let str = this.boardToString();
        str = '0'.repeat(shiftAmount) + str;
        str = str.slice(0, this.length);

        let newBoard = this.copy();

        for (let i = 0, b = 0; i < this.board.length; i++ , b += this.bitsPerByte) {
          newBoard.board[i] = parseInt(str.slice(b, b + this.bitsPerByte), 2);
        }
        return newBoard;
      }
      throw new RangeError('Invalid input. Must be greater than or equal to zero and less than or equal to BitBoard.length');
    }
    throw new TypeError('Invalid input. Must be "number"');
  }
}

/**
 * @function padString: function
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
