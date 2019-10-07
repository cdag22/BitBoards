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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./BitBoard"], factory);
    }
})(function (require, exports) {
    "use strict";
    var BitBoard_1 = __importDefault(require("./BitBoard"));
    /**
     * @author Cj D'Agostino
     *
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
    }(BitBoard_1.default));
    return ConnectFourBitBoard;
});
//# sourceMappingURL=ConnectFourBitBoard.js.map