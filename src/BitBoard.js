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
                if (typeof board === 'string') {
                    if (board.split('').some(function (n) { return ['0', '1'].indexOf(n) === -1; }) || board.length > this.length) {
                        throw new SyntaxError('Inputs to board as a string must be between 1 and 64 zeroes and ones.');
                    }
                    var left = board.length > 32 ? parseInt(board.slice(0, board.length - 32), 2) : 0;
                    var right = parseInt(board.slice(32), 2);
                    this.board = [left, right];
                }
                else if (Array.isArray(board)) {
                    if (board.some(function (x) { return typeof x !== 'number'; }) || board.length !== 2 || board.some(function (x) { return Math.floor(x) !== x || x < 0 || x >= _this.MAX_BITS; })) {
                        throw new RangeError('array inputs to board must be two integers x where  0 <= x < 2 ^ 32 (or 4294967296)');
                    }
                    this.board = board;
                }
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
                var targetBoard = modify ? this : this.copy();
                for (var i = 0; i < this.board.length; i++) {
                    targetBoard.board[i] = (targetBoard.board[i] & bb.board[i]) >>> 0;
                }
                return targetBoard;
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
                var targetBoard = modify ? this : this.copy();
                for (var i = 0; i < this.board.length; i++) {
                    targetBoard.board[i] = (targetBoard.board[i] | bb.board[i]) >>> 0;
                }
                return targetBoard;
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
                var targetBoard = modify ? this : this.copy();
                for (var i = 0; i < this.board.length; i++) {
                    targetBoard.board[i] = (targetBoard.board[i] ^ bb.board[i]) >>> 0;
                }
                return targetBoard;
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
                    var targetBoard = modify ? this : this.copy();
                    var startDigits = (((num << shiftAmount) >>> 0) & (Math.pow(2, 32) - 1)) >>> 0;
                    var startDigitMask = (startDigits & (Math.pow(2, 32) - 1)) >>> 0;
                    var numCarryDigits = (num >>> (32 - shiftAmount)) >>> 0;
                    if (shiftAmount === 32) {
                        targetBoard.board[0] = (targetBoard.board[0] | num) >>> 0;
                    }
                    else if (shiftAmount === 0) {
                        targetBoard.board[1] = (targetBoard.board[1] | startDigitMask) >>> 0;
                    }
                    else if (shiftAmount > 32 && shiftAmount < 64) {
                        targetBoard.board[0] = (targetBoard.board[0] | startDigitMask) >>> 0;
                    }
                    else {
                        targetBoard.board[1] = (targetBoard.board[1] | startDigitMask) >>> 0;
                        targetBoard.board[0] = (targetBoard.board[0] | numCarryDigits) >>> 0;
                    }
                    return targetBoard;
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
                    var targetBoard = modify ? this : this.copy();
                    var startDigits = (((num << shiftAmount) >>> 0) & (Math.pow(2, 32) - 1)) >>> 0;
                    var startDigitMask = (startDigits & (Math.pow(2, 32) - 1)) >>> 0;
                    var numCarryDigits = (num >>> (32 - shiftAmount)) >>> 0;
                    if (shiftAmount === 32) {
                        targetBoard.board[0] = (targetBoard.board[0] ^ num) >>> 0;
                    }
                    else if (shiftAmount === 0) {
                        targetBoard.board[1] = (targetBoard.board[1] ^ startDigitMask) >>> 0;
                    }
                    else if (shiftAmount > 32) {
                        targetBoard.board[0] = (targetBoard.board[0] ^ startDigitMask) >>> 0;
                    }
                    else {
                        targetBoard.board[1] = (targetBoard.board[1] ^ startDigitMask) >>> 0;
                        targetBoard.board[0] = (targetBoard.board[0] ^ numCarryDigits) >>> 0;
                    }
                    return targetBoard;
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
            var targetBoard = modify ? this : this.copy();
            for (var i = 0; i < targetBoard.board.length; i++) {
                targetBoard.board[i] = (~targetBoard.board[i]) >>> 0;
            }
            return targetBoard;
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
                    var targetBoard = modify ? this : this.copy();
                    var bitMask = ((Math.pow(2, shiftAmount) - 1) << (this.BITS_PER_BUCKET - shiftAmount)) >>> 0;
                    var carryDigits = ((targetBoard.board[1] & bitMask) >>> 0) >>> (this.BITS_PER_BUCKET - shiftAmount);
                    if (shiftAmount === this.BITS_PER_BUCKET) {
                        targetBoard.board[1] = 0;
                        targetBoard.board[0] = carryDigits;
                    }
                    else if (shiftAmount > this.BITS_PER_BUCKET && shiftAmount < this.length) {
                        targetBoard.board[0] = (targetBoard.board[1] << (shiftAmount - this.BITS_PER_BUCKET)) >>> 0;
                        targetBoard.board[1] = 0;
                    }
                    else if (shiftAmount >= this.length) {
                        targetBoard.board[0] = 0;
                        targetBoard.board[1] = 0;
                    }
                    else {
                        targetBoard.board[1] = (targetBoard.board[1] << shiftAmount) >>> 0;
                        targetBoard.board[0] = (((targetBoard.board[0] << shiftAmount) >>> 0) | carryDigits) >>> 0;
                    }
                    return targetBoard;
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
                    var targetBoard = modify ? this : this.copy();
                    var bitMask = ((Math.pow(2, shiftAmount) - 1) << (this.BITS_PER_BUCKET - shiftAmount)) >>> 0;
                    var carryDigits = ((targetBoard.board[0] << (this.BITS_PER_BUCKET - shiftAmount) >>> 0) & bitMask) >>> 0;
                    if (shiftAmount === this.BITS_PER_BUCKET) {
                        targetBoard.board[0] = 0;
                        targetBoard.board[1] = carryDigits;
                    }
                    else if (shiftAmount > this.BITS_PER_BUCKET && shiftAmount < this.length) {
                        targetBoard.board[1] = (targetBoard.board[0] >>> (shiftAmount - this.BITS_PER_BUCKET)) >>> 0;
                        targetBoard.board[0] = 0;
                    }
                    else if (shiftAmount >= this.length) {
                        targetBoard.board[0] = 0;
                        targetBoard.board[1] = 0;
                    }
                    else {
                        targetBoard.board[0] = (targetBoard.board[0] >>> shiftAmount) >>> 0;
                        targetBoard.board[1] = ((targetBoard.board[1] >>> shiftAmount) | carryDigits) >>> 0;
                    }
                    return targetBoard;
                }
                throw new RangeError('Invalid input. index must be >= 0');
            }
            throw new TypeError('Invalid input. Must be "number"');
        };
        /**
         * @param {modify} : boolean [optional] = false
         * @return {BitBoard} : flipped vertically
         */
        BitBoard.prototype.flipVertical = function (modify) {
            if (modify === void 0) { modify = false; }
            var targetBoard = modify ? this : this.copy();
            var mask1 = new BitBoard([16711935, 16711935]);
            // mask1 --> "0000000011111111000000001111111100000000111111110000000011111111"
            var mask2 = new BitBoard([65535, 65535]);
            // mask2 --> "0000000000000000111111111111111100000000000000001111111111111111"
            targetBoard = targetBoard.shiftRight(8).and(mask1).or(targetBoard.and(mask1).shiftLeft(8));
            targetBoard = targetBoard.shiftRight(16).and(mask2).or(targetBoard.and(mask2).shiftLeft(16));
            targetBoard = targetBoard.shiftRight(32).or(targetBoard.shiftLeft(32));
            return targetBoard;
        };
        /**
         * @param {modify} : boolean [optional] = false
         * @return {BitBoard} : flipped along the diagonal from a8 to h1; i.e. top left to bottom right from white's orientation
         */
        BitBoard.prototype.flipDiagonal = function (modify) {
            if (modify === void 0) { modify = false; }
            var targetBoard = modify ? this : this.copy();
            var mask1 = new BitBoard([2852170240, 2852170240]);
            // mask1 --> "1010101000000000101010100000000010101010000000001010101000000000"
            var mask2 = new BitBoard([3435921408, 3435921408]);
            // mask2 --> "1100110011001100000000000000000011001100110011000000000000000000"
            var mask4 = new BitBoard([4042322160, 252645135]);
            // mask4 --> "1111000011110000111100001111000000001111000011110000111100001111"
            var temp = targetBoard.xOr(targetBoard.shiftLeft(36));
            targetBoard.xOr(mask4.and(temp.xOr(targetBoard.shiftRight(36))), true);
            temp = mask2.and(targetBoard.xOr(targetBoard.shiftLeft(18)));
            targetBoard.xOr(temp.xOr(temp.shiftRight(18)), true);
            temp = mask1.and(targetBoard.xOr(targetBoard.shiftLeft(9)));
            return targetBoard.xOr(temp.xOr(temp.shiftRight(9)), true);
        };
        /**
         * @param {modify} : boolean [optional] = false
         * @return {BitBoard} : rotated 180 degrees
         */
        BitBoard.prototype.rotate180Degrees = function (modify) {
            if (modify === void 0) { modify = false; }
            var targetBoard = modify ? this : this.copy();
            var maskh1 = new BitBoard([1431655765, 1431655765]);
            // maskh1 --> "0101010101010101010101010101010101010101010101010101010101010101"
            var maskh2 = new BitBoard([858993459, 858993459]);
            // maskh2 --> "0011001100110011001100110011001100110011001100110011001100110011"
            var maskh4 = new BitBoard([252645135, 252645135]);
            // maskh4 --> "0000111100001111000011110000111100001111000011110000111100001111"
            var maskv1 = new BitBoard([16711935, 16711935]);
            // maskv1 --> "0000000011111111000000001111111100000000111111110000000011111111"
            var maskv2 = new BitBoard([65535, 65535]);
            // maskv2 --> "0000000000000000111111111111111100000000000000001111111111111111"
            targetBoard = targetBoard.shiftRight(1).and(maskh1).or(targetBoard.and(maskh1).shiftLeft(1));
            targetBoard = targetBoard.shiftRight(2).and(maskh2).or(targetBoard.and(maskh2).shiftLeft(2));
            targetBoard = targetBoard.shiftRight(4).and(maskh4).or(targetBoard.and(maskh4).shiftLeft(4));
            targetBoard = targetBoard.shiftRight(8).and(maskv1).or(targetBoard.and(maskv1).shiftLeft(8));
            targetBoard = targetBoard.shiftRight(16).and(maskv2).or(targetBoard.and(maskv2).shiftLeft(16));
            targetBoard = targetBoard.shiftRight(32).or(targetBoard.shiftLeft(32));
            return targetBoard;
        };
        /**
         * @param {modify} : boolean [option] = false
         * @return {BitBoard} : rotated 90 degrees clockwise
         */
        BitBoard.prototype.rotate90DegreesClockwise = function (modify) {
            if (modify === void 0) { modify = false; }
            var targetBoard = modify ? this : this.copy();
            return targetBoard.flipDiagonal().flipVertical();
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
    return BitBoard;
});
//# sourceMappingURL=BitBoard.js.map