"use strict";
/**
 * @author cj dagostino
 *
 * @class BitBoard
 * @param bitRows: [optional] Array<number>
 * Each number must be an INTEGER in the range of 0-255; i.e. each number is a byte
 * DEFAULT: bitRows = [0,0,0,0,0,0,0,0].length = 8; i.e. 8 bytes)
 * Each value: n is converted to an integer and then set to 0 if n > 255
 */
var BitBoard = /** @class */ (function () {
    /**
     * @param bitRows: Array<number>
     */
    function BitBoard(bitRows) {
        if (bitRows === void 0) { bitRows = [0, 0, 0, 0, 0, 0, 0, 0]; }
        if (!Array.isArray(bitRows) || bitRows.some(function (x) { return typeof x !== 'number'; })) {
            throw new TypeError('Invalid Input. Must be "Array" of "numbers"');
        }
        for (var i = 0, length = bitRows.length; i < length; i++) {
            if (Math.floor(bitRows[i]) !== bitRows[i] || bitRows[i] < 0 || bitRows[i] > 255) {
                throw new RangeError('inputs to bitRows array must be integers greater than or equal to zero and less than 256');
            }
        }
        this.board = bitRows.map(function (byte) { return padString(byte.toString(2), 8, '0', true); }).join('');
        this.length = this.board.length;
    }
    /**
     * @param bit: Object
     * @returns boolean
     */
    BitBoard.prototype.determineIfBitBoard = function (bit) {
        var names = Object.getOwnPropertyNames(bit);
        if (typeof bit === 'object' && names.indexOf('board') !== -1 && names.indexOf('length') !== -1) {
            var isLengthByteMultiple = bit.length % 8 === 0;
            var isBoardString = typeof bit.board === 'string';
            var isBoardLengthCorrect = bit.board.length === bit.length;
            var doPrototypesMatch = Object.getPrototypeOf(bit) === BitBoard.prototype;
            return isLengthByteMultiple && isBoardString && isBoardLengthCorrect && doPrototypesMatch;
        }
        return false;
    };
    /**
     *
     * @param index: number
     * @returns number
     */
    BitBoard.prototype.getIndex = function (index) {
        if (Math.floor(index) === index && index > -1 && index < this.length) {
            return parseInt(this.board[this.length - 1 - index]);
        }
        throw new RangeError('index must be integer greater than or equal to 0 and less than BitBoard.length');
    };
    /**
     * @returns BitBoard
     */
    BitBoard.prototype.copy = function () {
        var newBoard = new BitBoard();
        newBoard.board = this.board;
        return newBoard;
    };
    /**
     *
     * @param bitBoardOrIndex: BitBoard | number
     * @returns BitBoard
     */
    BitBoard.prototype.and = function (bitBoardOrIndex) {
        var newBoard = this.copy();
        if (typeof bitBoardOrIndex === 'number') {
            if (bitBoardOrIndex >= 0 && bitBoardOrIndex < this.length) {
                return newBoard;
            }
            throw new RangeError('index must be integer greater than or equal to 0 and less than BitBoard.length');
        }
        else if (this.determineIfBitBoard(bitBoardOrIndex)) {
            if (this.length === bitBoardOrIndex.length) {
                var str = '';
                for (var i = 0; i < this.length; i++) {
                    str += String(parseInt(newBoard.board[i]) & parseInt(bitBoardOrIndex.board[i]));
                }
                newBoard.board = str;
                return newBoard;
            }
            throw new RangeError('BitBoard lengths do not match');
        }
        throw new TypeError('Invalid input. Must be of type "BitBoard" or "number"');
    };
    /**
     *
     * @param bitBoardOrIndex: BitBoard | number
     * @returns BitBoard
     */
    BitBoard.prototype.or = function (bitBoardOrIndex) {
        var newBoard = this.copy();
        if (typeof bitBoardOrIndex === 'number') {
            if (bitBoardOrIndex >= 0 && bitBoardOrIndex < this.length) {
                var start = newBoard.board.slice(0, this.length - bitBoardOrIndex - 1);
                var altered = String(parseInt(this.board[this.length - 1 - bitBoardOrIndex]) | 1);
                var end = newBoard.board.slice(this.length - bitBoardOrIndex);
                newBoard.board = start + altered + end;
                return newBoard;
            }
            throw new RangeError('index must be integer greater than or equal to 0 and less than BitBoard.length');
        }
        else if (this.determineIfBitBoard(bitBoardOrIndex)) {
            if (this.length === bitBoardOrIndex.length) {
                var str = '';
                for (var i = 0; i < this.length; i++) {
                    str += String(parseInt(newBoard.board[i]) | parseInt(bitBoardOrIndex.board[i]));
                }
                newBoard.board = str;
                return newBoard;
            }
            throw new RangeError('BitBoard lengths do not match');
        }
        throw new TypeError('Invalid input. Must be of type "BitBoard" or "number"');
    };
    /**
     *
     * @param bitBoardOrIndex: BitBoard | number
     * @returns BitBoard
     */
    BitBoard.prototype.xOr = function (bitBoardOrIndex) {
        var newBoard = this.copy();
        if (typeof bitBoardOrIndex === 'number') {
            if (bitBoardOrIndex >= 0 && bitBoardOrIndex < this.length) {
                var start = newBoard.board.slice(0, this.length - bitBoardOrIndex - 1);
                var altered = String(parseInt(this.board[this.length - 1 - bitBoardOrIndex]) ^ 1);
                var end = newBoard.board.slice(this.length - bitBoardOrIndex);
                newBoard.board = start + altered + end;
                return newBoard;
            }
            throw new RangeError('index must be integer greater than or equal to 0 and less than BitBoard.length');
        }
        else if (this.determineIfBitBoard(bitBoardOrIndex)) {
            if (this.length === bitBoardOrIndex.length) {
                var str = '';
                for (var i = 0; i < this.length; i++) {
                    str += String(parseInt(newBoard.board[i]) ^ parseInt(bitBoardOrIndex.board[i]));
                }
                newBoard.board = str;
                return newBoard;
            }
            throw new RangeError('BitBoard lengths do not match');
        }
        throw new TypeError('Invalid input. Must be of type "BitBoard" or "number"');
    };
    /**
     * @returns BitBoard
     */
    BitBoard.prototype.not = function () {
        var newBoard = this.copy();
        var str = '';
        for (var i = 0; i < this.length; i++) {
            str += newBoard.board[i] === '1' ? '0' : '1';
        }
        newBoard.board = str;
        return newBoard;
    };
    /**
     *
     * @param shiftAmount: number
     * @returns BitBoard
     */
    BitBoard.prototype.shiftLeft = function (shiftAmount) {
        if (typeof shiftAmount === 'number') {
            if (shiftAmount >= 0 && shiftAmount <= this.length) {
                var newBoard = this.copy();
                newBoard.board = padString(newBoard.board, this.length + shiftAmount, '0', false).slice(shiftAmount);
                return newBoard;
            }
            throw new RangeError('Invalid input. Must be greater than or equal to zero and less than or equal to BitBoard.length');
        }
        throw new TypeError('Invalid input. Must be "number"');
    };
    /**
     *
     * @param shiftAmount: number
     * @returns BitBoard
     */
    BitBoard.prototype.shiftRight = function (shiftAmount) {
        if (typeof shiftAmount === 'number') {
            if (shiftAmount >= 0 && shiftAmount <= this.length) {
                var newBoard = this.copy();
                newBoard.board = padString(newBoard.board, this.length + shiftAmount, '0', true).slice(0, this.length);
                return newBoard;
            }
            throw new RangeError('Invalid input. Must be greater than or equal to zero and less than or equal to BitBoard.length');
        }
        throw new TypeError('Invalid input. Must be "number"');
    };
    return BitBoard;
}());
/**
 * @function padString: function
 * @param str: string
 * @param length: number
 * @param padValue: string
 * @param start: boolean
 * @returns string
 */
function padString(str, length, padValue, start) {
    if (start) {
        for (var i = str.length; i < length; i++) {
            str = padValue + str;
        }
    }
    else {
        for (var i = str.length; i < length; i++) {
            str += padValue;
        }
    }
    return str;
}
module.exports = BitBoard;
//# sourceMappingURL=stringBitBoard.js.map