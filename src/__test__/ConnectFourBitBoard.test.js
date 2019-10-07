const { ConnectFourBitBoard } = require('../../bitboards.js');

describe('ConnectFourBitBoard', () => {

  describe('isWin()', () => {
    it('calculates wins properly', () => {
      const horizontalWin = new ConnectFourBitBoard([0, 2113665]);
      const verticalWin = new ConnectFourBitBoard([0,15]);
      const northWestSouthEast = new ConnectFourBitBoard([0,2130440]);
      const southWestNorthEast = new ConnectFourBitBoard([0,16843009]);
      
      expect(ConnectFourBitBoard.isWin(horizontalWin)).toBe(true);
      expect(ConnectFourBitBoard.isWin(verticalWin)).toBe(true);
      expect(ConnectFourBitBoard.isWin(northWestSouthEast)).toBe(true);
      expect(ConnectFourBitBoard.isWin(southWestNorthEast)).toBe(true);
    });
  });
});