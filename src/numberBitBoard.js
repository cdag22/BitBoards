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
        var _this = this;
        if (bitRows === void 0) { bitRows = [0, 0, 0, 0, 0, 0, 0, 0]; }
        /**
         * @returns BitBoard
         */
        this.copy = function () { return new BitBoard(_this.board.slice()); };
        if (!Array.isArray(bitRows) || bitRows.some(function (x) { return typeof x !== 'number'; })) {
            throw new TypeError('Invalid Input. Must be "Array" of "numbers"');
        }
        for (var i = 0, length = bitRows.length; i < length; i++) {
            if (Math.floor(bitRows[i]) !== bitRows[i] || bitRows[i] < 0 || bitRows[i] > 255) {
                throw new RangeError('inputs to bitRows array must be integers greater than or equal to zero and less than 256');
            }
        }
        this.board = bitRows;
        this.length = this.board.length * 8;
        this.bitsPerByte = 8;
    }
    /**
     * @param bit: Object
     * @returns boolean
     */
    BitBoard.prototype.determineIfBitBoard = function (bit) {
        var names = Object.getOwnPropertyNames(bit);
        if (typeof bit === 'object' && names.indexOf('board') !== -1 && names.indexOf('length') !== -1 && names.indexOf('bitsPerByte') !== -1) {
            var isLengthByteMultiple = bit.length % 8 === 0;
            var isBoardArray = Array.isArray(bit.board);
            var isBoardValidNumber = bit.board.every(function (b) { return typeof b === 'number' && b >= 0 && b <= 255 && Math.floor(b) === b; });
            var isBoardLengthCorrect = bit.board.length * 8 === bit.length;
            var doPrototypesMatch = Object.getPrototypeOf(bit) === BitBoard.prototype;
            return isLengthByteMultiple && isBoardArray && isBoardValidNumber && isBoardLengthCorrect && doPrototypesMatch;
        }
        return false;
    };
    /**
     * @returns string
     */
    BitBoard.prototype.boardToString = function () {
        var str = '';
        for (var i = 0; i < this.board.length; i++) {
            str += padString(this.board[i].toString(2), this.bitsPerByte, '0', true);
        }
        return str;
    };
    /**
     *
     * @param index: number
     * @returns number
     */
    BitBoard.prototype.getIndex = function (index) {
        if (Math.floor(index) === index && index > -1 && index < this.length) {
            var powOfTwo = Math.pow(2, (index % this.bitsPerByte));
            var numberOfBuckets = this.length / this.bitsPerByte;
            return (this.board[numberOfBuckets - 1 - Math.floor(index / this.bitsPerByte)] & (powOfTwo)) / powOfTwo;
        }
        throw new RangeError('index must be integer greater than or equal to 0 and less than BitBoard.length');
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
                for (var i = 0; i < this.board.length; i++) {
                    newBoard.board[i] &= bitBoardOrIndex.board[i];
                }
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
                var numberOfBuckets = this.length / this.bitsPerByte;
                newBoard.board[numberOfBuckets - 1 - Math.floor(bitBoardOrIndex / this.bitsPerByte)] |= Math.pow(2, (bitBoardOrIndex % this.bitsPerByte));
                return newBoard;
            }
            throw new RangeError('index must be integer greater than or equal to 0 and less than BitBoard.length');
        }
        else if (this.determineIfBitBoard(bitBoardOrIndex)) {
            if (this.length === bitBoardOrIndex.length) {
                for (var i = 0; i < this.board.length; i++) {
                    newBoard.board[i] |= bitBoardOrIndex.board[i];
                }
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
                var numberOfBuckets = this.length / this.bitsPerByte;
                newBoard.board[numberOfBuckets - 1 - Math.floor(bitBoardOrIndex / this.bitsPerByte)] ^= Math.pow(2, (bitBoardOrIndex % this.bitsPerByte));
                return newBoard;
            }
            throw new RangeError('index must be integer greater than or equal to 0 and less than BitBoard.length');
        }
        else if (this.determineIfBitBoard(bitBoardOrIndex)) {
            if (this.length === bitBoardOrIndex.length) {
                for (var i = 0; i < this.board.length; i++) {
                    newBoard.board[i] ^= bitBoardOrIndex.board[i];
                }
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
        var strBoard = this.boardToString();
        var newStr;
        var notBoard = [];
        for (var i = 0; i < this.length; i++) {
            newStr = '';
            for (var k = 0; k < this.bitsPerByte; k++, i++) {
                newStr += strBoard[i] === '1' ? '0' : '1';
            }
            notBoard.push(parseInt(newStr, 2));
        }
        var newBoard = this.copy();
        newBoard.board = notBoard;
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
                var str = this.boardToString();
                str += '0'.repeat(shiftAmount);
                str = str.slice(shiftAmount);
                var newBoard = this.copy();
                for (var i = 0, b = 0; i < this.board.length; i++, b += this.bitsPerByte) {
                    newBoard.board[i] = parseInt(str.slice(b, b + this.bitsPerByte), 2);
                }
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
                var str = this.boardToString();
                str = '0'.repeat(shiftAmount) + str;
                str = str.slice(0, this.length);
                var newBoard = this.copy();
                for (var i = 0, b = 0; i < this.board.length; i++, b += this.bitsPerByte) {
                    newBoard.board[i] = parseInt(str.slice(b, b + this.bitsPerByte), 2);
                }
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
//# sourceMappingURL=numberBitBoard.js.map