"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var BitBoard_1 = __importDefault(require("./src/BitBoard"));
var ChessBitBoard_1 = __importDefault(require("./src/ChessBitBoard"));
var ConnectFourBitBoard_1 = __importDefault(require("./src/ConnectFourBitBoard"));

if (typeof exports !== 'undefined') {
  /*
   * Export BitBoard classes if using node or any other CommonJS compatible environment.
   */
 
  exports = { BitBoard: BitBoard_1.default, ChessBitBoard: ChessBitBoard_1.default, ConnectFourBitBoard: ConnectFourBitBoard_1.default };
    
} else if (typeof define !== 'undefined') {
  /*
   * Export BitBoard classes for any RequireJS compatible environment.
   */

  define((() => {
    return { BitBoard: BitBoard_1.default, ChessBitBoard: ChessBitBoard_1.default, ConnectFourBitBoard: ConnectFourBitBoard_1.default };
  }));
}

//# sourceMappingURL=index.js.map