/**
 * @author Cj D'Agostino
 * 
 * @class BitBoard
 * @param {board} Array<number> | string [optional]
 *    --> Must be length = 2 where each number n must be: 0 <= n <= 2 ^ 32 - 1
 *    --> Or a string of length 1 to 64 zeros and ones
 * @exports BitBoard
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

  constructor(board?: Array<number> | string) {
    this.MAX_BITS = 4294967296; // (2 ^ 32)
    this.BITS_PER_BUCKET = 32;
    this.length = 64;
    this.board;

    if (board) {
      if (typeof board === 'string') {
        if (board.split('').some(n => n !== '0' && n !== '1') || board.length > this.length) {
          throw new SyntaxError('Inputs to board as a string must be between 1 and 64 zeroes and ones')
        }
        const left = board.length > 32 ? parseInt(board.slice(0, board.length - 32), 2) : 0;
        const right = board.length > 32 ? parseInt(board.slice(32), 2) : parseInt(board, 2);
        this.board = [left, right];

      } else if (Array.isArray(board)) {
        if (board.some(x => typeof x !== 'number') || board.length !== 2 || board.some(x => Math.floor(x) !== x || x < 0 || x >= this.MAX_BITS)) {
          throw new Error('array inputs to board must be two integers x where  0 <= x < 2 ^ 32 (or 4294967296)');
        }
        this.board = board;
      }
    } else {
      this.board = [0, 0];
    }
  }

  /**
   * @method
   * @param {bit} BitBoard
   * @returns {boolean}
   */
  determineIfBitBoard(bb: BitBoard): boolean {
    const names = Object.getOwnPropertyNames(bb);

    const doPrototypesMatch: boolean = Object.getPrototypeOf(bb) === BitBoard.prototype;
    const arePropertyNamesCorrect = names.every(name => ['board', 'length', 'BITS_PER_BUCKET', 'MAX_BITS'].indexOf(name) !== -1);
    const isBoardLengthCorrect: boolean = bb.board && (bb.board.length === 2) && (bb.length === this.length);
    const isBoardArrayCorrect: boolean = Array.isArray(bb.board) &&
      bb.board.every(n => typeof n === 'number' && n >= 0 && n < this.MAX_BITS && Math.floor(n) === n);

    return arePropertyNamesCorrect && isBoardLengthCorrect && isBoardArrayCorrect && doPrototypesMatch;
  }
  
  /**
   * @method
   * @returns {string}
   */
  toString(): string {
    let str = '';

    for (let i = 0; i < this.board.length; i++) {
      str += padString((this.board[i] >>> 0).toString(2), this.BITS_PER_BUCKET, '0', true);
    }
    return str;
  }

  /**
   * @method
   * @param {index} number
   * @returns {1 or 0}
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
   * @method
   * @returns BitBoard
   */
  copy(): BitBoard {
    return new BitBoard(this.board.slice());
  }


  isEmpty(): boolean {
    return this.board[0] === 0 && this.board[1] === 0;
  }

  /**
   * @method
   * @param {bb} BitBoard
   * @param {modify} boolean [optional]
   * @returns {BitBoard}
   */
  and(bb: BitBoard, modify: boolean = false): BitBoard {
    if (this.determineIfBitBoard(bb)) {
      let targetBoard: BitBoard = modify ? this : this.copy();
      
      for (let i = 0; i < this.board.length; i++) {
        targetBoard.board[i] = (targetBoard.board[i] & bb.board[i]) >>> 0;
      }
      return targetBoard;
    }
    throw new TypeError('Invalid input. Must be of type BitBoard');
  }

  /**
   * @method
   * @param {bb} BitBoard
   * @param {modify} boolean [optional]
   * @returns {BitBoard}
   */
  or(bb: BitBoard, modify: boolean = false): BitBoard {
    if (this.determineIfBitBoard(bb)) {
      let targetBoard: BitBoard = modify ? this : this.copy();

      for (let i = 0; i < this.board.length; i++) {
        targetBoard.board[i] = (targetBoard.board[i] | bb.board[i]) >>> 0;
      }
      return targetBoard;
    }
    throw new TypeError('Invalid input. Must be of type BitBoard');
  }

  /**
   * @method
   * @param {bb} BitBoard
   * @param {modify} boolean [optional]
   * @returns {BitBoard}
   */
  xOr(bb: BitBoard, modify: boolean = false): BitBoard {
    if (this.determineIfBitBoard(bb)) {
      let targetBoard: BitBoard = modify ? this : this.copy();

      for (let i = 0; i < this.board.length; i++) {
        targetBoard.board[i] = (targetBoard.board[i] ^ bb.board[i]) >>> 0;
      }
      return targetBoard;
    }
    throw new TypeError('Invalid input. Must be of type BitBoard');
  }

  /**
   * @method
   * @param {shiftAmount} number --> n such that 0 <= n < 64
   * @param {num} number --> n such that 0 <= n <= 2 ^ 32 - 1
   * @param {modify} boolean [optional]
   * @returns {BitBoard}
   */
  orNumber(shiftAmount: number = 0, num: number = 1, modify: boolean = false): BitBoard {
    if (typeof shiftAmount === 'number' && typeof num === 'number') {
      
      if (shiftAmount >= 0 && shiftAmount < this.length && num >= 0 && num < this.MAX_BITS) {
        let targetBoard: BitBoard = modify ? this : this.copy();

        const startDigits = (((num << shiftAmount) >>> 0) & (Math.pow(2, this.BITS_PER_BUCKET) - 1)) >>> 0;
        const startDigitMask = (startDigits & (2 ** this.BITS_PER_BUCKET - 1)) >>> 0;
        const numCarryDigits = (num >>> (this.BITS_PER_BUCKET - shiftAmount)) >>> 0;

        if (shiftAmount === this.BITS_PER_BUCKET) {
          targetBoard.board[0] = (targetBoard.board[0] | num) >>> 0;
        } else if (shiftAmount === 0) {
          targetBoard.board[1] = (targetBoard.board[1] | startDigitMask) >>> 0;
        } else if (shiftAmount > this.BITS_PER_BUCKET) {
          targetBoard.board[0] = (targetBoard.board[0] | startDigitMask) >>> 0;
        } else {
          targetBoard.board[1] = (targetBoard.board[1] | startDigitMask) >>> 0;
          targetBoard.board[0] = (targetBoard.board[0] | numCarryDigits) >>> 0;
        }

        return targetBoard;
      }
      throw new RangeError('0 <= shiftAmount < 64 && 0 <= num <= 2 ^ 32 - 1')
    }
    throw new TypeError('Invalid input. Must be of type number');
  }

  /**
   * @method
   * @param {shiftAmount} number --> n such that 0 <= n < 64
   * @param {num} number --> n such that 0 <= n <= 2 ^ 32 - 1
   * @param {modify} boolean [optional]
   * @returns {BitBoard}
   */
  xOrNumber(shiftAmount: number = 0, num: number = 1, modify: boolean = false): BitBoard {
    if (typeof shiftAmount === 'number' && typeof num === 'number') {
      
      if (shiftAmount >= 0 && shiftAmount < this.length && num >= 0 && num < this.MAX_BITS) {
        let targetBoard: BitBoard = modify ? this : this.copy();

        const startDigits = (((num << shiftAmount) >>> 0) & (Math.pow(2, this.BITS_PER_BUCKET) - 1)) >>> 0;
        const startDigitMask = (startDigits & (Math.pow(2, this.BITS_PER_BUCKET) - 1)) >>> 0;
        const numCarryDigits = (num >>> (this.BITS_PER_BUCKET - shiftAmount)) >>> 0;

        if (shiftAmount === this.BITS_PER_BUCKET) {
          targetBoard.board[0] = (targetBoard.board[0] ^ num) >>> 0;
        } else if (shiftAmount === 0) {
          targetBoard.board[1] = (targetBoard.board[1] ^ startDigitMask) >>> 0;
        } else if (shiftAmount > this.BITS_PER_BUCKET) {
          targetBoard.board[0] = (targetBoard.board[0] ^ startDigitMask) >>> 0;
        } else {
          targetBoard.board[1] = (targetBoard.board[1] ^ startDigitMask) >>> 0;
          targetBoard.board[0] = (targetBoard.board[0] ^ numCarryDigits) >>> 0;
        }

        return targetBoard;
      }
      throw new RangeError('0 <= shiftAmount < 64 && 0 <= num <= 2 ^ 32 - 1')
    }
    throw new TypeError('Invalid input. Must be of type number');
  }

  /**
   * @method
   * @param {modify} boolean [optional]
   * @returns BitBoard
   */
  not(modify: boolean = false): BitBoard {
    const targetBoard = modify ? this : this.copy();
    
    for (let i: number = 0; i < targetBoard.board.length; i++) {
      targetBoard.board[i] = (~targetBoard.board[i]) >>> 0;
    }
    return targetBoard;
  }

  /**
   * @method
   * @param {shiftAmount} number
   * @param {modify} boolean [optional]
   * @returns {BitBoard}
   */
  shiftLeft(shiftAmount: number, modify: boolean = false): BitBoard {
    if (typeof shiftAmount === 'number') {
      if (shiftAmount >= 0) {

        let targetBoard = modify ? this : this.copy();
        
        const bitMask = ((Math.pow(2, shiftAmount) - 1) << (this.BITS_PER_BUCKET - shiftAmount)) >>> 0;
        const carryDigits = ((targetBoard.board[1] & bitMask) >>> 0) >>> (this.BITS_PER_BUCKET - shiftAmount);

        if (shiftAmount === this.BITS_PER_BUCKET) {
          targetBoard.board[1] = 0;
          targetBoard.board[0] = carryDigits;
        } else if (shiftAmount > this.BITS_PER_BUCKET && shiftAmount < this.length) {
          targetBoard.board[0] = (targetBoard.board[1] << (shiftAmount - this.BITS_PER_BUCKET)) >>> 0;
          targetBoard.board[1] = 0;
        } else if (shiftAmount >= this.length) {
          targetBoard.board[0] = 0;
          targetBoard.board[1] = 0;
        } else {
          targetBoard.board[1] = (targetBoard.board[1] << shiftAmount) >>> 0;
          targetBoard.board[0] = (((targetBoard.board[0] << shiftAmount) >>> 0) | carryDigits) >>> 0;
        }

        return targetBoard;
      }
      throw new RangeError('Invalid input. index must be >= 0');
    }
    throw new TypeError('Invalid input. Must be "number"');
  }

  /**
   * @method
   * @param {shiftAmount} number
   * @param {modify} boolean [optional]
   * @returns {BitBoard}
   */
  shiftRight(shiftAmount: number, modify: boolean = false): BitBoard {
    if (typeof shiftAmount === 'number') {
      if (shiftAmount >= 0) {
        let targetBoard = modify ? this : this.copy();
        
        const bitMask = ((Math.pow(2, shiftAmount) - 1) << (this.BITS_PER_BUCKET - shiftAmount)) >>> 0;
        const carryDigits = ((targetBoard.board[0] << (this.BITS_PER_BUCKET - shiftAmount) >>> 0) & bitMask) >>> 0;

        if (shiftAmount === this.BITS_PER_BUCKET) {
          targetBoard.board[0] = 0;
          targetBoard.board[1] = carryDigits;
        } else if (shiftAmount > this.BITS_PER_BUCKET && shiftAmount < this.length) {
          targetBoard.board[1] = (targetBoard.board[0] >>> (shiftAmount - this.BITS_PER_BUCKET)) >>> 0;
          targetBoard.board[0] = 0;
        } else if (shiftAmount >= this.length) {
          targetBoard.board[0] = 0;
          targetBoard.board[1] = 0;
        } else {
          targetBoard.board[0] = (targetBoard.board[0] >>> shiftAmount) >>> 0;
          targetBoard.board[1] = ((targetBoard.board[1] >>> shiftAmount) | carryDigits) >>> 0;
        }

        return targetBoard;
      }
      throw new RangeError('Invalid input. index must be >= 0');
    }
    throw new TypeError('Invalid input. Must be "number"');
  }

  /**
   * @param {modify} : boolean [optional] = false 
   * @return {BitBoard} : flipped vertically
   */
  flipVertical(modify: boolean = false) {
    let targetBoard: BitBoard = modify ? this : this.copy();

    const mask1: BitBoard = new BitBoard([16711935, 16711935]);
    // mask1 --> "0000000011111111000000001111111100000000111111110000000011111111"

    const mask2: BitBoard = new BitBoard([65535, 65535]);
    // mask2 --> "0000000000000000111111111111111100000000000000001111111111111111"

    targetBoard = targetBoard.shiftRight(8).and(mask1).or(targetBoard.and(mask1).shiftLeft(8));
    targetBoard = targetBoard.shiftRight(16).and(mask2).or(targetBoard.and(mask2).shiftLeft(16));
    targetBoard = targetBoard.shiftRight(32).or(targetBoard.shiftLeft(32));

    return targetBoard;
  }

  /**
   * @param {modify} : boolean [optional] = false
   * @return {BitBoard} : flipped along the diagonal from a8 to h1; i.e. top left to bottom right from white's orientation
   */
  flipDiagonal(modify: boolean = false) {
    let targetBoard: BitBoard = modify ? this : this.copy();

    const mask1: BitBoard = new BitBoard([2852170240, 2852170240]);
    // mask1 --> "1010101000000000101010100000000010101010000000001010101000000000"

    const mask2: BitBoard = new BitBoard([3435921408, 3435921408]);
    // mask2 --> "1100110011001100000000000000000011001100110011000000000000000000"

    const mask4: BitBoard = new BitBoard([4042322160, 252645135]);
    // mask4 --> "1111000011110000111100001111000000001111000011110000111100001111"
    
    let temp: BitBoard = targetBoard.xOr(targetBoard.shiftLeft(36));
    targetBoard.xOr(mask4.and(temp.xOr(targetBoard.shiftRight(36))), true)
    temp = mask2.and(targetBoard.xOr(targetBoard.shiftLeft(18)));
    targetBoard.xOr(temp.xOr(temp.shiftRight(18)), true);
    temp = mask1.and(targetBoard.xOr(targetBoard.shiftLeft(9)));

    return targetBoard.xOr(temp.xOr(temp.shiftRight(9)), true)
  }

  /**
   * @param {modify} : boolean [optional] = false
   * @return {BitBoard} : rotated 180 degrees
   */
  rotate180Degrees(modify: boolean = false) {
    let targetBoard = modify ? this : this.copy();

    const maskh1: BitBoard = new BitBoard([1431655765, 1431655765]);
    // maskh1 --> "0101010101010101010101010101010101010101010101010101010101010101"

    const maskh2: BitBoard = new BitBoard([858993459, 858993459]);
    // maskh2 --> "0011001100110011001100110011001100110011001100110011001100110011"

    const maskh4: BitBoard = new BitBoard([252645135, 252645135]);
    // maskh4 --> "0000111100001111000011110000111100001111000011110000111100001111"

    const maskv1: BitBoard = new BitBoard([16711935, 16711935]);
    // maskv1 --> "0000000011111111000000001111111100000000111111110000000011111111"

    const maskv2: BitBoard = new BitBoard([65535, 65535]);
    // maskv2 --> "0000000000000000111111111111111100000000000000001111111111111111"

    targetBoard = targetBoard.shiftRight(1).and(maskh1).or(targetBoard.and(maskh1).shiftLeft(1));
    targetBoard = targetBoard.shiftRight(2).and(maskh2).or(targetBoard.and(maskh2).shiftLeft(2));
    targetBoard = targetBoard.shiftRight(4).and(maskh4).or(targetBoard.and(maskh4).shiftLeft(4));
    targetBoard = targetBoard.shiftRight(8).and(maskv1).or(targetBoard.and(maskv1).shiftLeft(8));
    targetBoard = targetBoard.shiftRight(16).and(maskv2).or(targetBoard.and(maskv2).shiftLeft(16));
    targetBoard = targetBoard.shiftRight(32).or(targetBoard.shiftLeft(32));

    return targetBoard;
  }

  /**
   * @param {modify} : boolean [option] = false
   * @return {BitBoard} : rotated 90 degrees clockwise
   */
  rotate90DegreesClockwise(modify: boolean = false) {
    let targetBoard = modify ? this : this.copy();

    return targetBoard.flipDiagonal().flipVertical();
  }
}

/**
 * @function
 * @param {str} string
 * @param {length} number
 * @param {padValue} string
 * @param {start} boolean
 * @returns {string}
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

interface BitBoardInputDictionary {
  boardType?: string,
  board?: Array<number>,
  lsb?: string
}

/**
 * @class ChessBitBoard
 * @extends {BitBoard}
 * @param {input} object = { boardType, board, lsb }
 * @augments boardType : string [optional] 
 * Valid inputs are:
 *      "black", "white", "piece", "pawn", "knight", "bishop", "rook", "queen", "king"
 * @arguments board : Array<number> [optional]
 * With length = 2
 * Each number n must satisfy: 0 <= n <= 2 ^ 32 - 1 (i.e. the largest 32 digit binary number)
 * @arguments lsb: string [optional]
 * Represents the square for the Least Significant Bit. Default is 'undefined'. Only valid input is "a1".
 * The difference between "a1" and default is that boards for "white" and "black" swap.
 *      
 * 
 * NOTE ON ARGUMENTS
 *    if boardType is present, board is ignored
 *    boardType must be "white" or "black" for lsb to take affect
 *    if neither boardType or board are present, ChessBitBoard.board = [0, 0]
 * 
 * SHAPE OF DEFAULT BOARDS
 *    All default boards are based on the the starting positions for pieces according to the
 *    following mapping of squares to indicies:
 * 
 *    a8: 0,  b8: 1,  c8: 2,  d8: 3,  e8: 4,  f8: 5,  g8: 6,  h8: 7,
 *    a7: 8,  b7: 9,  c7: 10, d7: 11, e7: 12, f7: 13, g7: 14, h7: 15,
 *    a6: 16, b6: 17, c6: 18, d6: 19, e6: 20, f6: 21, g6: 22, h6: 23,
 *    a5: 24, b5: 25, c5: 26, d5: 27, e5: 28, f5: 29, g5: 30, h5: 31,
 *    a4: 32, b4: 33, c4: 34, d4: 35, e4: 36, f4: 37, g4: 38, h4: 39,
 *    a3: 40, b3: 41, c3: 42, d3: 43, e3: 44, f3: 45, g3: 46, h3: 47,
 *    a2: 48, b2: 49, c2: 50, d2: 51, e2: 52, f2: 53, g2: 54, h2: 55,
 *    a1: 56, b1: 57, c1: 58, d1: 59, e1: 60, f1: 61, g1: 62, h1: 63
 */
class ChessBitBoard extends BitBoard {

  constructor(input) {
    if (input && input.boardType) {
      switch (input.boardType) {
        case 'piece':
          super([4294901760, 65535]);
          break;
        case 'black':
          input.lsb === "a1" ? super([4294901760, 0]) : super([0, 65535]);
          break;
        case 'white':
          input.lsb === "a1" ? super([0, 65535]) : super([4294901760, 0]);
          break;
        case 'pawn':
          super([16711680, 65280]);
          break;
        case 'knight':
          super([1107296256, 66]);
          break;
        case 'bishop':
          super([603979776, 36]);
          break;
        case 'rook':
          super([2164260864, 129]);
          break;
        case 'queen':
          super([268435456, 16]);
          break;
        case 'king':
          super([134217728, 8]);
          break;
        default:
          throw new SyntaxError('Input is not a valid value for boardType. Must be one of the following:\n\t"black", "white", "piece", "pawn", "knight", "bishop", "rook", "queen", "king"');
      }
    } else if (input && input.board) {
        super(input.board); // this.board = custom input
    } else {
      super(input); // this.board = [0, 0];
    }
  }
}

/**
 * @class ConnectFourBitBoard
 * @extends {BitBoard}
 * @param {board} Array<number> [optional]
 *    With length = 2
 *    Each number n must satisfy: 0 <= n <= 2 ^ 32 - 1 (i.e. the largest 32 digit binary number)
 */
class ConnectFourBitBoard extends BitBoard {

  constructor(board: Array<number> = [0, 0]) {
    super(board);
  }

  /**
   * Calculates whether the given team has won
   * @method
   * @static
   * @param {bb} ConnectFourBitBoard  --> Board for a team, i.e. BitBoard for 'X' or "O"
   */
  public static isWin(bb: ConnectFourBitBoard): boolean {
    const directions: Array<number> = [1, 7, 6, 8];

    for (let direction of directions) {
      let firstShift: BitBoard = bb.shiftRight(2 * direction);
      let secondShift: BitBoard = bb.shiftRight(3 * direction);

      const result: BitBoard = bb.and(bb.shiftRight(direction)).and(firstShift).and(secondShift);

      if (!result.isEmpty()) return true;
    }
    return false;
  }
}

export { BitBoard, ChessBitBoard, ConnectFourBitBoard };