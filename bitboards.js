var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
        BitBoard.prototype.toString = function () {
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
                    else if (shiftAmount > 32 && shiftAmount < 64) {
                        newBoard.board[0] = (newBoard.board[0] | startDigitMask) >>> 0;
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
                    else if (shiftAmount > 32) {
                        newBoard.board[0] = (newBoard.board[0] ^ startDigitMask) >>> 0;
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
                if (shiftAmount >= 0) {
                    var newBoard = modify ? this : this.copy();
                    var bitMask = ((Math.pow(2, shiftAmount) - 1) << (this.BITS_PER_BUCKET - shiftAmount)) >>> 0;
                    var carryDigits = ((newBoard.board[1] & bitMask) >>> 0) >>> (this.BITS_PER_BUCKET - shiftAmount);
                    if (shiftAmount === this.BITS_PER_BUCKET) {
                        newBoard.board[1] = 0;
                        newBoard.board[0] = carryDigits;
                    }
                    else if (shiftAmount > this.BITS_PER_BUCKET && shiftAmount < this.length) {
                        newBoard.board[0] = (newBoard.board[1] << (shiftAmount - this.BITS_PER_BUCKET)) >>> 0;
                        newBoard.board[1] = 0;
                    }
                    else if (shiftAmount >= this.length) {
                        newBoard.board[0] = 0;
                        newBoard.board[1] = 0;
                    }
                    else {
                        newBoard.board[1] = (newBoard.board[1] << shiftAmount) >>> 0;
                        newBoard.board[0] = (((newBoard.board[0] << shiftAmount) >>> 0) | carryDigits) >>> 0;
                    }
                    return newBoard;
                }
                throw new RangeError('Invalid input. index must be >= 0');
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
                if (shiftAmount >= 0) {
                    var newBoard = modify ? this : this.copy();
                    var bitMask = ((Math.pow(2, shiftAmount) - 1) << (this.BITS_PER_BUCKET - shiftAmount)) >>> 0;
                    var carryDigits = ((newBoard.board[0] << (this.BITS_PER_BUCKET - shiftAmount) >>> 0) & bitMask) >>> 0;
                    if (shiftAmount === this.BITS_PER_BUCKET) {
                        newBoard.board[0] = 0;
                        newBoard.board[1] = carryDigits;
                    }
                    else if (shiftAmount > this.BITS_PER_BUCKET && shiftAmount < this.length) {
                        newBoard.board[1] = (newBoard.board[0] >>> (shiftAmount - this.BITS_PER_BUCKET)) >>> 0;
                        newBoard.board[0] = 0;
                    }
                    else if (shiftAmount >= this.length) {
                        newBoard.board[0] = 0;
                        newBoard.board[1] = 0;
                    }
                    else {
                        newBoard.board[0] = (newBoard.board[0] >>> shiftAmount) >>> 0;
                        newBoard.board[1] = ((newBoard.board[1] >>> shiftAmount) | carryDigits) >>> 0;
                    }
                    return newBoard;
                }
                throw new RangeError('Invalid input. index must be >= 0');
            }
            throw new TypeError('Invalid input. Must be "number"');
        };
        return BitBoard;
    }());
    exports.BitBoard = BitBoard;
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
    var ChessBitBoard = /** @class */ (function (_super) {
        __extends(ChessBitBoard, _super);
        function ChessBitBoard(input) {
            var _this = this;
            if (input && input.boardType) {
                switch (input.boardType) {
                    case 'piece':
                        _this = _super.call(this, [4294901760, 65535]) || this;
                        break;
                    case 'black':
                        input.lsb === "a1" ? _this = _super.call(this, [4294901760, 0]) || this : _this = _super.call(this, [0, 65535]) || this;
                        break;
                    case 'white':
                        input.lsb === "a1" ? _this = _super.call(this, [0, 65535]) || this : _this = _super.call(this, [4294901760, 0]) || this;
                        break;
                    case 'pawn':
                        _this = _super.call(this, [16711680, 65280]) || this;
                        break;
                    case 'knight':
                        _this = _super.call(this, [1107296256, 66]) || this;
                        break;
                    case 'bishop':
                        _this = _super.call(this, [603979776, 36]) || this;
                        break;
                    case 'rook':
                        _this = _super.call(this, [2164260864, 129]) || this;
                        break;
                    case 'queen':
                        _this = _super.call(this, [268435456, 16]) || this;
                        break;
                    case 'king':
                        _this = _super.call(this, [134217728, 8]) || this;
                        break;
                    default:
                        throw new SyntaxError('Input is not a valid value for boardType. Must be one of the following:\n\t"black", "white", "piece", "pawn", "knight", "bishop", "rook", "queen", "king"');
                }
            }
            else if (input && input.board) {
                _this = _super.call(this, input.board) || this; // this.board = custom input
            }
            else {
                _this = _super.call(this) || this; // this.board = [0, 0];
            }
            return _this;
        }
        return ChessBitBoard;
    }(BitBoard));
    exports.ChessBitBoard = ChessBitBoard;
    /**
     * @class ConnectFourBitBoard
     * @extends {BitBoard}
     * @param {board} Array<number> [optional]
     *    With length = 2
     *    Each number n must satisfy: 0 <= n <= 2 ^ 32 - 1 (i.e. the largest 32 digit binary number)
     */
    var ConnectFourBitBoard = /** @class */ (function (_super) {
        __extends(ConnectFourBitBoard, _super);
        function ConnectFourBitBoard(board) {
            if (board === void 0) { board = [0, 0]; }
            return _super.call(this, board) || this;
        }
        /**
         * Calculates whether the given team has won
         * @method
         * @static
         * @param {bb} ConnectFourBitBoard  --> Board for a team, i.e. BitBoard for 'X' or "O"
         */
        ConnectFourBitBoard.isWin = function (bb) {
            var directions = [1, 7, 6, 8];
            for (var _i = 0, directions_1 = directions; _i < directions_1.length; _i++) {
                var direction = directions_1[_i];
                var firstShift = bb.shiftRight(2 * direction);
                var secondShift = bb.shiftRight(3 * direction);
                var result = bb.and(bb.shiftRight(direction)).and(firstShift).and(secondShift);
                if (!result.isEmpty())
                    return true;
            }
            return false;
        };
        return ConnectFourBitBoard;
    }(BitBoard));
    exports.ConnectFourBitBoard = ConnectFourBitBoard;
});
//# sourceMappingURL=bitboards.js.map