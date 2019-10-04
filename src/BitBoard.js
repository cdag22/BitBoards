"use strict";
/**
 * @author Cj D'Agostino
 *
 * @class BitBoard
 * @param {board} Array<number> [optional]  --> Must be length = 2 where each number n must be: 0 <= n <= 2 ^ 32 - 1
 * @exports BitBoard
 *
 * NOTE
 *    the last parameter to all binary operator methods is an [optional] boolean
 *    flag {modify}. When true the BitBoard calling the method will be modified
 *    as opposed to leaving the calling BitBoard unchanged and returning a new BitBoard.
 *    If a BitBoard is an argument to a method it is ALWAYS left unchanged.
 */
var BitBoard = /** @class */ (function () {
    function BitBoard(board) {
        var _this = this;
        this.MAX_BITS = 4294967296; // (2 ^ 32)
        this.BITS_PER_BUCKET = 32;
        this.length = 64;
        this.board;
        if (board) {
            if (!Array.isArray(board) || board.some(function (x) { return typeof x !== 'number'; })) {
                throw new TypeError('board must be an array');
            }
            else if (board.length !== 2 || board.some(function (x) { return Math.floor(x) !== x || x < 0 || x >= _this.MAX_BITS; })) {
                throw new RangeError('inputs to board array must be two integers x where  0 <= x < 2 ^ 32 (or 4294967296)');
            }
            this.board = board;
        }
        else {
            this.board = [0, 0];
        }
    }
    /**
     * @method
     * @param {bit} BitBoard
     * @returns {boolean}
     */
    BitBoard.prototype.determineIfBitBoard = function (bb) {
        var _this = this;
        var names = Object.getOwnPropertyNames(bb);
        var doPrototypesMatch = Object.getPrototypeOf(bb) === BitBoard.prototype;
        var arePropertyNamesCorrect = names.every(function (name) { return ['board', 'length', 'BITS_PER_BUCKET', 'MAX_BITS'].indexOf(name) !== -1; });
        var isBoardLengthCorrect = bb.board && (bb.board.length === 2) && (bb.length === this.length);
        var isBoardArrayCorrect = Array.isArray(bb.board) &&
            bb.board.every(function (n) { return typeof n === 'number' && n >= 0 && n < _this.MAX_BITS && Math.floor(n) === n; });
        return arePropertyNamesCorrect && isBoardLengthCorrect && isBoardArrayCorrect && doPrototypesMatch;
    };
    /**
     * @method
     * @returns {string}
     */
    BitBoard.prototype.boardToString = function () {
        var str = '';
        for (var i = 0; i < this.board.length; i++) {
            str += padString((this.board[i] >>> 0).toString(2), this.BITS_PER_BUCKET, '0', true);
        }
        return str;
    };
    /**
     * @method
     * @param {index} number
     * @returns {1 or 0}
     */
    BitBoard.prototype.getIndex = function (index) {
        if (Math.floor(index) === index && index >= 0 && index < this.length) {
            var powOfTwo = Math.pow(2, (index % this.BITS_PER_BUCKET));
            var bucketOffset = index > this.BITS_PER_BUCKET ? 1 : 0;
            return ((this.board[1 - bucketOffset] & powOfTwo) >>> 0) > 0 ? 1 : 0;
        }
        throw new RangeError('index must be integer greater than or equal to 0 and less than 64');
    };
    /**
     * @method
     * @returns BitBoard
     */
    BitBoard.prototype.copy = function () {
        return new BitBoard(this.board.slice());
    };
    BitBoard.prototype.isEmpty = function () {
        return this.board[0] === 0 && this.board[1] === 0;
    };
    /**
     * @method
     * @param {bb} BitBoard
     * @param {modify} boolean [optional]
     * @returns {BitBoard}
     */
    BitBoard.prototype.and = function (bb, modify) {
        if (modify === void 0) { modify = false; }
        if (this.determineIfBitBoard(bb)) {
            var newBoard = modify ? this : this.copy();
            for (var i = 0; i < this.board.length; i++) {
                newBoard.board[i] = (newBoard.board[i] & bb.board[i]) >>> 0;
            }
            return newBoard;
        }
        throw new TypeError('Invalid input. Must be of type BitBoard');
    };
    /**
     * @method
     * @param {bb} BitBoard
     * @param {modify} boolean [optional]
     * @returns {BitBoard}
     */
    BitBoard.prototype.or = function (bb, modify) {
        if (modify === void 0) { modify = false; }
        if (this.determineIfBitBoard(bb)) {
            var newBoard = modify ? this : this.copy();
            for (var i = 0; i < this.board.length; i++) {
                newBoard.board[i] = (newBoard.board[i] | bb.board[i]) >>> 0;
            }
            return newBoard;
        }
        throw new TypeError('Invalid input. Must be of type "BitBoard" or "number"');
    };
    /**
     * @method
     * @param {bb} BitBoard
     * @param {modify} boolean [optional]
     * @returns {BitBoard}
     */
    BitBoard.prototype.xOr = function (bb, modify) {
        if (modify === void 0) { modify = false; }
        if (this.determineIfBitBoard(bb)) {
            var newBoard = modify ? this : this.copy();
            for (var i = 0; i < this.board.length; i++) {
                newBoard.board[i] = (newBoard.board[i] ^ bb.board[i]) >>> 0;
            }
            return newBoard;
        }
        throw new TypeError('Invalid input. Must be of type "BitBoard" or "number"');
    };
    /**
     * @method
     * @param {shiftAmount} number --> n such that 0 <= n < 64
     * @param {num} number --> n such that 0 <= n <= 2 ^ 32 - 1
     * @param {modify} boolean [optional]
     * @returns {BitBoard}
     */
    BitBoard.prototype.orNumber = function (shiftAmount, num, modify) {
        if (shiftAmount === void 0) { shiftAmount = 0; }
        if (num === void 0) { num = 1; }
        if (modify === void 0) { modify = false; }
        if (typeof shiftAmount === 'number' && typeof num === 'number') {
            if (shiftAmount >= 0 && shiftAmount < this.length && num >= 0 && num < this.MAX_BITS) {
                var newBoard = modify ? this : this.copy();
                var startDigits = (((num << shiftAmount) >>> 0) & (Math.pow(2, 32) - 1)) >>> 0;
                var startDigitMask = (startDigits & (Math.pow(2, 32) - 1)) >>> 0;
                var numCarryDigits = (num >>> (32 - shiftAmount)) >>> 0;
                if (shiftAmount === 32) {
                    newBoard.board[0] = (newBoard.board[0] | num) >>> 0;
                }
                else if (shiftAmount === 0) {
                    newBoard.board[1] = (newBoard.board[1] | startDigitMask) >>> 0;
                }
                else {
                    newBoard.board[1] = (newBoard.board[1] | startDigitMask) >>> 0;
                    newBoard.board[0] = (newBoard.board[0] | numCarryDigits) >>> 0;
                }
                return newBoard;
            }
            throw new RangeError('0 <= shiftAmount < 64 && 0 <= num <= 2 ^ 32 - 1');
        }
        throw new TypeError('Invalid input. Must be of type number');
    };
    /**
     * @method
     * @param {shiftAmount} number --> n such that 0 <= n < 64
     * @param {num} number --> n such that 0 <= n <= 2 ^ 32 - 1
     * @param {modify} boolean [optional]
     * @returns {BitBoard}
     */
    BitBoard.prototype.xOrNumber = function (shiftAmount, num, modify) {
        if (shiftAmount === void 0) { shiftAmount = 0; }
        if (num === void 0) { num = 1; }
        if (modify === void 0) { modify = false; }
        if (typeof shiftAmount === 'number' && typeof num === 'number') {
            if (shiftAmount >= 0 && shiftAmount < this.length && num >= 0 && num < this.MAX_BITS) {
                var newBoard = modify ? this : this.copy();
                var startDigits = (((num << shiftAmount) >>> 0) & (Math.pow(2, 32) - 1)) >>> 0;
                var startDigitMask = (startDigits & (Math.pow(2, 32) - 1)) >>> 0;
                var numCarryDigits = (num >>> (32 - shiftAmount)) >>> 0;
                if (shiftAmount === 32) {
                    newBoard.board[0] = (newBoard.board[0] ^ num) >>> 0;
                }
                else if (shiftAmount === 0) {
                    newBoard.board[1] = (newBoard.board[1] ^ startDigitMask) >>> 0;
                }
                else {
                    newBoard.board[1] = (newBoard.board[1] ^ startDigitMask) >>> 0;
                    newBoard.board[0] = (newBoard.board[0] ^ numCarryDigits) >>> 0;
                }
                return newBoard;
            }
            throw new RangeError('0 <= shiftAmount < 64 && 0 <= num <= 2 ^ 32 - 1');
        }
        throw new TypeError('Invalid input. Must be of type number');
    };
    /**
     * @method
     * @param {modify} boolean [optional]
     * @returns BitBoard
     */
    BitBoard.prototype.not = function (modify) {
        if (modify === void 0) { modify = false; }
        var newBoard = modify ? this : this.copy();
        for (var i = 0; i < newBoard.board.length; i++) {
            newBoard.board[i] = (~newBoard.board[i]) >>> 0;
        }
        return newBoard;
    };
    /**
     * @method
     * @param {shiftAmount} number
     * @param {modify} boolean [optional]
     * @returns {BitBoard}
     */
    BitBoard.prototype.shiftLeft = function (shiftAmount, modify) {
        if (modify === void 0) { modify = false; }
        if (typeof shiftAmount === 'number') {
            if (shiftAmount >= 0 && shiftAmount <= this.BITS_PER_BUCKET) {
                var newBoard = modify ? this : this.copy();
                var bitMask = ((Math.pow(2, shiftAmount) - 1) << (this.BITS_PER_BUCKET - shiftAmount)) >>> 0;
                var carryDigits = ((newBoard.board[1] & bitMask) >>> 0) >>> (this.BITS_PER_BUCKET - shiftAmount);
                if (shiftAmount === this.BITS_PER_BUCKET) {
                    newBoard.board[1] = 0;
                    newBoard.board[0] = carryDigits;
                }
                else {
                    newBoard.board[1] = (newBoard.board[1] << shiftAmount) >>> 0;
                    newBoard.board[0] = (((newBoard.board[0] << shiftAmount) >>> 0) | carryDigits) >>> 0;
                }
                return newBoard;
            }
            throw new RangeError('Invalid input. index n must satisfy 0 <= n <= 64');
        }
        throw new TypeError('Invalid input. Must be "number"');
    };
    /**
     * @method
     * @param {shiftAmount} number
     * @param {modify} boolean [optional]
     * @returns {BitBoard}
     */
    BitBoard.prototype.shiftRight = function (shiftAmount, modify) {
        if (modify === void 0) { modify = false; }
        if (typeof shiftAmount === 'number') {
            if (shiftAmount >= 0 && shiftAmount <= this.BITS_PER_BUCKET) {
                var newBoard = modify ? this : this.copy();
                var bitMask = ((Math.pow(2, shiftAmount) - 1) << (this.BITS_PER_BUCKET - shiftAmount)) >>> 0;
                var carryDigits = ((newBoard.board[0] << (this.BITS_PER_BUCKET - shiftAmount) >>> 0) & bitMask) >>> 0;
                if (shiftAmount === this.BITS_PER_BUCKET) {
                    newBoard.board[0] = 0;
                    newBoard.board[1] = carryDigits;
                }
                else {
                    newBoard.board[0] = (newBoard.board[0] >>> shiftAmount) >>> 0;
                    newBoard.board[1] = ((newBoard.board[1] >>> shiftAmount) | carryDigits) >>> 0;
                }
                return newBoard;
            }
            throw new RangeError('Invalid input. index n must satisfy 0 <= n <= 64');
        }
        throw new TypeError('Invalid input. Must be "number"');
    };
    return BitBoard;
}());
/**
 * @function
 * @param {str} string
 * @param {length} number
 * @param {padValue} string
 * @param {start} boolean
 * @returns {string}
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
//# sourceMappingURL=BitBoard.js.map