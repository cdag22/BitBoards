/**
 * @author Cj D'Agostino
 * 
 * @class BitBoard
 * 
 * @param board : [optional] Array<number> of length = 2 where
 * each number n must be: 0 <= n <= 2 ^ 32 - 1
 * 
 * NOTE
 *    the last parameter to all binary operator methods is an [optional] boolean
 *    flag {modify}. When true the BitBoard calling the method will be modified
 *    as opposed to leaving the calling BitBoard unchanged and returning a new BitBoard.
 *    If a BitBoard is an argument to a method it is ALWAYS left unchanged.
 */
class BitBoard {

  public board: Array<number>;
  public length: number;
  private readonly BITS_PER_BUCKET: number;
  private readonly MAX_BITS: number;

  constructor(board?: Array<number>) {
    this.MAX_BITS = 4294967296; // (2 ^ 32)
    this.BITS_PER_BUCKET = 32;
    this.length = 64;
    this.board;

    if (board) {
      if (board.length !== 2 || board.some(x => Math.floor(x) !== x || x < 0 || x >= this.MAX_BITS)) {
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
  determineIfBitBoard(bb: BitBoard): boolean {
    const names = Object.getOwnPropertyNames(bb);

    const doPrototypesMatch: boolean = Object.getPrototypeOf(bb) === BitBoard.prototype;
    const arePropertyNamesCorrect = names.every(name => ['board', 'length', 'BITS_PER_BUCKET', 'MAX_BITS'].indexOf(name) !== -1);
    const isBoardLengthCorrect: boolean = bb.board && bb.board.length === 2 && bb.length === this.length;
    const isBoardArrayCorrect: boolean = Array.isArray(bb.board) &&
      bb.board.every(b => typeof b === 'number' && b >= 0 && b < this.MAX_BITS && Math.floor(b) === b);

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
  copy = (): BitBoard => new BitBoard(this.board.slice());


  isEmpty = (): boolean => this.board[0] === 0 && this.board[1] === 0;

  /**
   * @param bb: BitBoard
   * @returns BitBoard
   */
  and(bb: BitBoard, modify: boolean = false): BitBoard {
    if (this.determineIfBitBoard(bb)) {
      let newBoard: BitBoard = modify ? this : this.copy();
      
      for (let i = 0; i < this.board.length; i++) {
        newBoard.board[i] = (newBoard.board[i] & bb.board[i]) >>> 0;
      }
      return newBoard;
    }
    throw new TypeError('Invalid input. Must be of type BitBoard');
  }

  /**
   * @param bb: BitBoard
   * @returns BitBoard
   */
  or(bb: BitBoard, modify: boolean = false): BitBoard {
    if (this.determineIfBitBoard(bb)) {
      let newBoard: BitBoard = modify ? this : this.copy();

      for (let i = 0; i < this.board.length; i++) {
        newBoard.board[i] = (newBoard.board[i] | bb.board[i]) >>> 0;
      }
      return newBoard;
    }
    throw new TypeError('Invalid input. Must be of type "BitBoard" or "number"');
  }

  /**
   * @param bb: BitBoard
   * @returns BitBoard
   */
  xOr(bb: BitBoard, modify: boolean = false): BitBoard {
    if (this.determineIfBitBoard(bb)) {
      let newBoard: BitBoard = modify ? this : this.copy();

      for (let i = 0; i < this.board.length; i++) {
        newBoard.board[i] = (newBoard.board[i] ^ bb.board[i]) >>> 0;
      }
      return newBoard;
    }
    throw new TypeError('Invalid input. Must be of type "BitBoard" or "number"');
  }

  /**
   * @param shiftAmount : number n such that 0 <= n < 64
   * @param num : number n such that 0 <= n <= 2 ^ 32 - 1
   * @returns BitBoard
   */
  orNumber(shiftAmount: number, num: number = 1, modify: boolean = false): BitBoard {
    if (typeof shiftAmount === 'number') {
      
      if (shiftAmount >= 0 && shiftAmount < this.length && num >= 0 && num < this.MAX_BITS) {
        let newBoard: BitBoard = modify ? this : this.copy();

        const startDigits = (((num << shiftAmount) >>> 0) & (2 ** 32 - 1)) >>> 0;
        const startDigitMask = (startDigits & (2 ** 32 - 1)) >>> 0;
        const numCarryDigits = (num >>> (32 - shiftAmount)) >>> 0;

        if (shiftAmount === 32) {
          newBoard.board[0] = (newBoard.board[0] | num) >>> 0;
        } else if (shiftAmount === 0) {
          newBoard.board[1] = (newBoard.board[1] | startDigitMask) >>> 0;
        } else {
          newBoard.board[1] = (newBoard.board[1] | startDigitMask) >>> 0;
          newBoard.board[0] = (newBoard.board[0] | numCarryDigits) >>> 0;
        }

        return newBoard;
      }
      throw new RangeError('index must be integer greater than or equal to 0 and less than 64')
    }
    throw new TypeError('Invalid input. Must be of type number');
  }

  /**
   * @param shiftAmount : number n such that 0 <= n < 64
   * @param num : number n such that 0 <= n <= 2 ^ 32 - 1
   * @returns BitBoard
   */
  xOrNumber(shiftAmount: number, num: number = 1, modify: boolean = false): BitBoard {
    if (typeof shiftAmount === 'number') {
      
      if (shiftAmount >= 0 && shiftAmount < this.length && num >= 0 && num < this.MAX_BITS) {
        let newBoard: BitBoard = modify ? this : this.copy();

        const startDigits = (((num << shiftAmount) >>> 0) & (2 ** 32 - 1)) >>> 0;
        const startDigitMask = (startDigits & (2 ** 32 - 1)) >>> 0;
        const numCarryDigits = (num >>> (32 - shiftAmount)) >>> 0;

        if (shiftAmount === 32) {
          newBoard.board[0] = (newBoard.board[0] ^ num) >>> 0;
        } else if (shiftAmount === 0) {
          newBoard.board[1] = (newBoard.board[1] ^ startDigitMask) >>> 0;
        } else {
          newBoard.board[1] = (newBoard.board[1] ^ startDigitMask) >>> 0;
          newBoard.board[0] = (newBoard.board[0] ^ numCarryDigits) >>> 0;
        }

        return newBoard;
      }
      throw new RangeError('index must be integer greater than or equal to 0 and less than 64')
    }
    throw new TypeError('Invalid input. Must be of type number');
  }

  /**
   * @returns BitBoard
   */
  not(modify: boolean = false): BitBoard {
    const newBoard = modify ? this : this.copy();
    
    for (let i: number = 0; i < newBoard.board.length; i++) {
      newBoard.board[i] = (~newBoard.board[i]) >>> 0;
    }
    return newBoard;
  }

  /**
   * @param shiftAmount: number
   * @returns BitBoard
   */
  shiftLeft(shiftAmount: number, modify: boolean = false): BitBoard {
    if (typeof shiftAmount === 'number') {
      if (shiftAmount >= 0 && shiftAmount <= this.BITS_PER_BUCKET) {

        let newBoard = modify ? this : this.copy();
        
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
  shiftRight(shiftAmount: number, modify: boolean = false): BitBoard {
    if (typeof shiftAmount === 'number') {
      if (shiftAmount >= 0 && shiftAmount <= this.BITS_PER_BUCKET) {
        let newBoard = modify ? this : this.copy();
        
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
