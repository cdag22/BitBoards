/**
 * @author cj dagostino
 * 
 * @class BitBoard
 * @param bitRows: [optional] Array<number>
 * Each number must be an INTEGER in the range of 0-255; i.e. each number is a byte
 * DEFAULT: bitRows = [0,0,0,0,0,0,0,0].length = 8; i.e. 8 bytes)
 * Each value: n is converted to an integer and then set to 0 if n > 255
 */

class BitBoard {

  public board: string;
  public length: number;

  /**
   * @param bitRows: Array<number>
   */
  constructor(bitRows: number[] = [0, 0, 0, 0, 0, 0, 0, 0]) {
    if (!Array.isArray(bitRows) || bitRows.some(x => typeof x !== 'number')) {
      throw new TypeError('Invalid Input. Must be "Array" of "numbers"')
    }

    for (let i: number = 0, length: number = bitRows.length; i < length; i++) {
      if (Math.floor(bitRows[i]) !== bitRows[i] || bitRows[i] < 0 || bitRows[i] > 255) {
        throw new RangeError('inputs to bitRows array must be integers greater than or equal to zero and less than 256')
      }
    }
    
    this.board = bitRows.map(byte => padString(byte.toString(2), 8, '0', true)).join('');
    this.length = this.board.length;
  }

  /**
   * @param bit: Object
   * @returns boolean
   */
  determineIfBitBoard(bit: BitBoard): boolean {
    const names = Object.getOwnPropertyNames(bit);
    if (typeof bit === 'object' && names.indexOf('board') !== -1 && names.indexOf('length') !== -1) {
      const isLengthByteMultiple: boolean = bit.length % 8 === 0;
      const isBoardString: boolean = typeof bit.board === 'string';
      const isBoardLengthCorrect: boolean = bit.board.length === bit.length;
      const doPrototypesMatch: boolean = Object.getPrototypeOf(bit) === BitBoard.prototype;

      return isLengthByteMultiple && isBoardString && isBoardLengthCorrect && doPrototypesMatch;
    }
    return false;
  }

  /**
   * 
   * @param index: number
   * @returns number
   */
  getIndex(index: number): number {
    if (Math.floor(index) === index && index > -1 && index < this.length) {
      return parseInt(this.board[this.length -  1 - index]);
    }
    throw new RangeError('index must be integer greater than or equal to 0 and less than BitBoard.length');
  }

  /**
   * @returns BitBoard
   */
  copy(): BitBoard {
    let newBoard = new BitBoard();
    newBoard.board = this.board;

    return newBoard;
  }

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
        let str: string = '';
  
        for (let i: number = 0; i < this.length; i++) {
          str += String(parseInt(newBoard.board[i]) & parseInt(bitBoardOrIndex.board[i]));
        }
        newBoard.board = str;
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

        const start: string = newBoard.board.slice(0, this.length - bitBoardOrIndex - 1);
        const altered: string = String(parseInt(this.board[this.length - 1 - bitBoardOrIndex]) | 1);
        const end: string = newBoard.board.slice(this.length - bitBoardOrIndex);

        newBoard.board = start + altered + end;

        return newBoard;
      }
      throw new RangeError('index must be integer greater than or equal to 0 and less than BitBoard.length');

    } else if (this.determineIfBitBoard(bitBoardOrIndex)) {
      if (this.length === bitBoardOrIndex.length) {
        let str: string = '';

        for (let i: number = 0; i < this.length; i++) {
          str += String(parseInt(newBoard.board[i]) | parseInt(bitBoardOrIndex.board[i]));
        }
        newBoard.board = str;

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

        const start: string = newBoard.board.slice(0, this.length - bitBoardOrIndex - 1);
        const altered: string = String(parseInt(this.board[this.length - 1 - bitBoardOrIndex]) ^ 1);
        const end: string = newBoard.board.slice(this.length - bitBoardOrIndex);

        newBoard.board = start + altered + end;

        return newBoard;
      }
      throw new RangeError('index must be integer greater than or equal to 0 and less than BitBoard.length');

    } else if (this.determineIfBitBoard(bitBoardOrIndex)) {
      if (this.length === bitBoardOrIndex.length) {
        let str: string = '';

        for (let i: number = 0; i < this.length; i++) {
          str += String(parseInt(newBoard.board[i]) ^ parseInt(bitBoardOrIndex.board[i]));
        }
        newBoard.board = str;

        return newBoard;
      }
      throw new RangeError('BitBoard lengths do not match');
    }
    throw new TypeError('Invalid input. Must be of type "BitBoard" or "number"')
  }

  /**
   * @returns BitBoard
   */
  not(): BitBoard {
    let newBoard: BitBoard = this.copy();
    let str: string = '';

    for (let i: number = 0; i < this.length; i++) {
      str += newBoard.board[i] === '1' ? '0' : '1';
    }
    newBoard.board = str;

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
        let newBoard: BitBoard = this.copy();
  
        newBoard.board = padString(newBoard.board, this.length + shiftAmount, '0', false).slice(shiftAmount);
  
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
        let newBoard: BitBoard = this.copy();
  
        newBoard.board = padString(newBoard.board, this.length + shiftAmount, '0', true).slice(0, this.length);
  
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
