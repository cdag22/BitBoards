var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./src/BitBoard", "./src/ChessBitBoard", "./src/ConnectFourBitBoard"], factory);
    }
})(function (require, exports) {
    "use strict";
    var BitBoard_1 = __importDefault(require("./src/BitBoard"));
    var ChessBitBoard_1 = __importDefault(require("./src/ChessBitBoard"));
    var ConnectFourBitBoard_1 = __importDefault(require("./src/ConnectFourBitBoard"));
    return { BitBoard: BitBoard_1.default, ChessBitBoard: ChessBitBoard_1.default, ConnectFourBitBoard: ConnectFourBitBoard_1.default };
});
//# sourceMappingURL=index.js.map