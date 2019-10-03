"use strict";
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
var BitBoard = require("./BitBoard");
/**
 * @author Cj D'Agostino
 *
 * @class ConnectFourBitBoard
 * @extends BitBoard
 *
 * @param board : [optional] Array<number>
 * With length = 2
 * Each number n must satisfy: 0 <= n <= 2 ^ 32 - 1 (i.e. the largest 32 digit binary number)
 */
var ConnectFourBitBoard = /** @class */ (function (_super) {
    __extends(ConnectFourBitBoard, _super);
    function ConnectFourBitBoard(board) {
        if (board === void 0) { board = [0, 0]; }
        return _super.call(this, board) || this;
    }
    /**
     * @param bb : ConnectFourBitBoard for a team, i.e. BitBoard for 'X' or "O"
     *
     * Calculates whether the given team has won
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
module.exports = ConnectFourBitBoard;
//# sourceMappingURL=ConnectFourBitBoard.js.map