"use strict";
/**
 * @class BitBoard
 *
 * @param input : object = { [OPTIONAL: boardType, board] }
 *
 * @augments boardType : string equal to one of the following:
 *      "black", "white", "piece", "pawn", "knight", "bishop", "rook", "queen", "king"
 *
 * @arguments board : [optional] Array<number> with length = 2 and each number n: 0 <= n < 2 ^ 32
 *
 * NOTE:
 *    if boardType is present, board is ignored
 *    if neither boardType or board are present, BitBoard.board = [0, 0]
 */
var BitBoard = /** @class */ (function () {
    function BitBoard(input) {
        var _this = this;
        /**
         * @returns BitBoard
         */
        this.copy = function () { return new BitBoard({ board: _this.board.slice() }); };
        var boardType = input.boardType, board = input.board;
        this.MAX_BITS = 4294967296; // (2 ^ 32)
        this.BITS_PER_BUCKET = 32;
        this.length = 64;
        this.board;
        if (boardType) {
            switch (boardType) {
                case 'piece':
                    this.board = [4294901760, 65535];
                    break;
                case 'black':
                    this.board = [0, 65535];
                    break;
                case 'white':
                    this.board = [4294901760, 0];
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
                    this.board = [2164260864, 129];
                    break;
                case 'queen':
                    this.board = [268435456, 16];
                    break;
                case 'king':
                    this.board = [134217728, 8];
                    break;
                default:
                    throw new Error("Input: " + boardType + " is not a valid value for boardType. Must be one of the following:\n              \"black\", \"white\", \"piece\", \"pawn\", \"knight\", \"bishop\", \"rook\", \"queen\", \"king\"");
            }
        }
        else if (board) {
            if (board.length !== 2 && !board.every(function (x) { return Math.floor(x) === x && x >= 0 && x < _this.MAX_BITS; })) {
                throw new RangeError('inputs to board array must be two integers x where  0 <= x < 2 ^ 32 (or 4294967296)');
            }
            this.board = board;
        }
        else {
            this.board = [0, 0];
        }
    }
    /**
     * @param bit: Object
     * @returns boolean
     */
    BitBoard.prototype.determineIfBitBoard = function (bitBoard) {
        var _this = this;
        var names = Object.getOwnPropertyNames(bitBoard);
        if (typeof bitBoard === 'object') {
            var arePropertyNamesCorrect = names.every(function (name) { return ['board', 'length', 'BITS_PER_BUCKET', 'MAX_BITS'].indexOf(name) !== -1; });
            var isBoardCorrectArray = Array.isArray(bitBoard.board) && bitBoard.board.length === 2;
            var isBoardValidNumber = bitBoard.board.every(function (b) { return typeof b === 'number' && b >= 0 && b < _this.MAX_BITS && Math.floor(b) === b; });
            var isBoardLengthCorrect = bitBoard.length === this.length;
            var doPrototypesMatch = Object.getPrototypeOf(bitBoard) === BitBoard.prototype;
            return arePropertyNamesCorrect && isBoardCorrectArray && isBoardValidNumber && isBoardLengthCorrect && doPrototypesMatch;
        }
        return false;
    };
    /**
     * @returns string
     */
    BitBoard.prototype.boardToString = function () {
        var str = '';
        for (var i = 0; i < this.board.length; i++) {
            str += padString(this.board[i].toString(2), this.BITS_PER_BUCKET, '0', true);
        }
        return str;
    };
    /**
     *
     * @param index : number
     * @returns 1 or 0
     */
    BitBoard.prototype.getIndex = function (index) {
        if (Math.floor(index) === index && index > -1 && index < this.length) {
            var powOfTwo = Math.pow(2, (index % this.BITS_PER_BUCKET));
            var bucketOffset = (index % this.length) > this.BITS_PER_BUCKET ? 1 : 0;
            return ((this.board[1 - bucketOffset] & powOfTwo) >>> 0) > 0 ? 1 : 0;
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
                    newBoard.board[i] = ((newBoard.board[i] & bitBoardOrIndex.board[i]) >>> 0);
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
                var powOfTwo = Math.pow(2, (bitBoardOrIndex % this.BITS_PER_BUCKET));
                var bucketOffset = (bitBoardOrIndex % this.length) > this.BITS_PER_BUCKET ? 1 : 0;
                newBoard.board[1 - bucketOffset] = ((newBoard.board[1 - bucketOffset] | powOfTwo) >>> 0);
                return newBoard;
            }
            throw new RangeError('index must be integer greater than or equal to 0 and less than BitBoard.length');
        }
        else if (this.determineIfBitBoard(bitBoardOrIndex)) {
            if (this.length === bitBoardOrIndex.length) {
                for (var i = 0; i < this.board.length; i++) {
                    newBoard.board[i] = ((newBoard.board[i] | bitBoardOrIndex.board[i]) >>> 0);
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
                var powOfTwo = Math.pow(2, (bitBoardOrIndex % this.BITS_PER_BUCKET));
                var bucketOffset = (bitBoardOrIndex % this.length) > this.BITS_PER_BUCKET ? 1 : 0;
                newBoard.board[1 - bucketOffset] = ((newBoard.board[1 - bucketOffset] ^ powOfTwo) >>> 0);
                return newBoard;
            }
            throw new RangeError('index must be integer greater than or equal to 0 and less than BitBoard.length');
        }
        else if (this.determineIfBitBoard(bitBoardOrIndex)) {
            if (this.length === bitBoardOrIndex.length) {
                for (var i = 0; i < this.board.length; i++) {
                    newBoard.board[i] = ((newBoard.board[i] ^ bitBoardOrIndex.board[i]) >>> 0);
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
        var newBoard = this.copy();
        for (var i = 0; i < newBoard.board.length; i++) {
            newBoard.board[i] = (~newBoard.board[i]) >>> 0;
        }
        return newBoard;
    };
    /**
     *
     * @param shiftAmount: number
     * @returns BitBoard
     */
    BitBoard.prototype.shiftLeft = function (shiftAmount) {
        if (typeof shiftAmount === 'number') {
            if (shiftAmount >= 0 && shiftAmount <= this.BITS_PER_BUCKET) {
                var newBoard = this.copy();
                var bitMask = ((Math.pow(2, shiftAmount) - 1) << (this.BITS_PER_BUCKET - shiftAmount)) >>> 0;
                var carryDigits = ((newBoard.board[1] & bitMask) >>> 0) >>> (this.BITS_PER_BUCKET - shiftAmount);
                if (shiftAmount === this.BITS_PER_BUCKET) {
                    newBoard.board[1] = 0;
                    newBoard.board[0] = carryDigits;
                }
                else {
                    newBoard.board[1] = ((newBoard.board[1] << shiftAmount) >>> 0) % (Math.pow(2, this.BITS_PER_BUCKET) - 1);
                    newBoard.board[0] = ((((newBoard.board[0] << shiftAmount) >>> 0) % (Math.pow(2, this.BITS_PER_BUCKET) - 1)) | carryDigits) >>> 0;
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
            if (shiftAmount >= 0 && shiftAmount <= this.BITS_PER_BUCKET) {
                var newBoard = this.copy();
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
            throw new RangeError('Invalid input. Must be greater than or equal to zero and less than or equal to BitBoard.length');
        }
        throw new TypeError('Invalid input. Must be "number"');
    };
    return BitBoard;
}());
/**
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
//# sourceMappingURL=index.js.map