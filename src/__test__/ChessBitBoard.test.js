const ChessBitBoard = require('../ChessBitBoard');

describe('ChessBitBoard', () => {
  
  describe('constructor(args = { boardType, board })', () => {

    it('correct defaults for no args', () => {
      const board = new ChessBitBoard();
      expect(board.length).toEqual(64);
      expect(board.board).toEqual([0, 0]);
    });

    it('boardType superseeds board', () => {
      expect(new ChessBitBoard({ boardType: 'piece', board: [1, 1] }).board).toEqual([4294901760,65535]);
    });

    it('boardType === piece', () => {
      expect(new ChessBitBoard({ boardType: 'piece' }).board).toEqual([4294901760,65535]);
    });

    describe('boardType === black', () =>{
      it('lsb not present', () => {
        expect(new ChessBitBoard({ boardType: 'black' }).board).toEqual([0,65535]);
      });
      
      it('lsb === a1', () => {
        expect(new ChessBitBoard({ boardType: 'black', lsb: 'a1' }).board).toEqual([4294901760,0]);
      })

      it('lsb invalid', () => {
        expect(new ChessBitBoard({ boardType: 'black', lsb: 'a' }).board).toEqual([0,65535]);
      })
    })
    
    describe('boardType === white', () =>{
      it('lsb not present', () => {
        expect(new ChessBitBoard({ boardType: 'white' }).board).toEqual([4294901760,0]);
      });

      it('lsb === a1', () => {
        expect(new ChessBitBoard({ boardType: 'white', lsb: 'a1' }).board).toEqual([0,65535]);
      });

      it('lsb invalid', () => {
        expect(new ChessBitBoard({ boardType: 'white', lsb: 'a' }).board).toEqual([4294901760,0]);
      });
    });
    
    it('boardType === pawn', () => {
      expect(new ChessBitBoard({ boardType: 'pawn' }).board).toEqual([16711680, 65280]);
    });

    it('boardType === knight', () => {
      expect(new ChessBitBoard({ boardType: 'knight' }).board).toEqual([1107296256, 66]);
    });

    it('boardType === bishop', () => {
      expect(new ChessBitBoard({ boardType: 'bishop' }).board).toEqual([603979776, 36]);
    });

    it('boardType === rook', () => {
      expect(new ChessBitBoard({ boardType: 'rook' }).board).toEqual([2164260864,129]);
    });

    it('boardType === queen', () => {
      expect(new ChessBitBoard({ boardType: 'queen' }).board).toEqual([268435456, 16]);
    });

    it('boardType === king', () => {
      expect(new ChessBitBoard({ boardType: 'king' }).board).toEqual([134217728, 8]);
    });

    it('boardType invalid to throw error', () => {
      expect(() => new ChessBitBoard({ boardType: 'wrong' })).toThrow(SyntaxError);
    });

    it('boardType empty && board with negative number to throw error', () => {
      expect(() => new ChessBitBoard({ board: [-1, 0] })).toThrow(RangeError);
    });

    it('boardType empty && board with too large a number to throw error', () => {
      expect(() => new ChessBitBoard({ board: [2**33, 0] })).toThrow(RangeError);
    });

    it('boardType empty && valid board', () => {
      expect(new ChessBitBoard({ board: [1,1] }).board).toEqual([1,1]);
    });

  });
});