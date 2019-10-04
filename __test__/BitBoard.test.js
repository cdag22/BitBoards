const BitBoard = require('../BitBoard');

xdescribe('BitBoard', () => {

  describe('constructor(args = { boardType, board })', () => {

    it('correct defaults for no args', () => {
      const board = new BitBoard();
      expect(board.length).toEqual(64);
      expect(board.board).toEqual([0, 0]);
    });

    it('boardType superseeds board', () => {
      expect(new BitBoard({ boardType: 'piece', board: [1, 1] }).board).toEqual([4294901760,65535]);
    });

    it('boardType === piece', () => {
      expect(new BitBoard({ boardType: 'piece' }).board).toEqual([4294901760,65535]);
    });

    it('boardType === black', () => {
      expect(new BitBoard({ boardType: 'black' }).board).toEqual([0,65535]);
    });
    
    it('boardType === white', () => {
      expect(new BitBoard({ boardType: 'white' }).board).toEqual([4294901760,0]);
    });
    
    it('boardType === pawn', () => {
      expect(new BitBoard({ boardType: 'pawn' }).board).toEqual([16711680, 65280]);
    });

    it('boardType === knight', () => {
      expect(new BitBoard({ boardType: 'knight' }).board).toEqual([1107296256, 66]);
    });

    it('boardType === bishop', () => {
      expect(new BitBoard({ boardType: 'bishop' }).board).toEqual([603979776, 36]);
    });

    it('boardType === rook', () => {
      expect(new BitBoard({ boardType: 'rook' }).board).toEqual([2164260864,129]);
    });

    it('boardType === queen', () => {
      expect(new BitBoard({ boardType: 'queen' }).board).toEqual([268435456, 16]);
    });

    it('boardType === king', () => {
      expect(new BitBoard({ boardType: 'king' }).board).toEqual([134217728, 8]);
    });

    it('boardType invalid to throw error', () => {
      expect(new BitBoard({ boardType: 'wrong' })).toThrowError(new SyntaxError('Input is not a valid value for boardType. Must be one of the following:\n\t"black", "white", "piece", "pawn", "knight", "bishop", "rook", "queen", "king"'));
    });

    it('boardType empty && board with negative number to throw error', () => {
      expect(new BitBoard({ board: [-1, 0] })).toThrow(RangeError);
    });

    it('boardType empty && board with too large a number to throw error', () => {
      expect(new BitBoard({ board: [2**33, 0] })).toThrow(RangeError);
    });

    it('boardType empty && valid board', () => {
      expect(new BitBoard({ board: [1,1] }).board).toEqual([1,1]);
    });


  });

  xdescribe('errors', () => {

    describe('constructor', () => {
      it('throws a Type Error for parameters not equal to an array of numbers', () => {
        expect(() => new BitBoard('a')).toThrow(TypeError);
        expect(() => new BitBoard(['a'])).toThrow(TypeError);
      })

      it('throws Range Error for values less than zero or greater than 255', () => {
        expect(() => new BitBoard([257, -1])).toThrow(RangeError);
      });
    });
    
    describe('getIndex()', () => {
      it('throws a Range Error for values less than zero or greater than BitBoard.length', () => {
        const b = new BitBoard();

        expect(() => b.getIndex(64)).toThrow(RangeError);
        expect(() => b.getIndex(-1)).toThrow(RangeError);
      });
    });

    describe('and()', () => {
      let a;
      let b;

      beforeEach(() => {
        b = new BitBoard();
        a = new BitBoard([0]);
      });

      it('throws a Range Error for values less than zero or greater than BitBoard.length', () => {
        expect(() => b.and(-1)).toThrow(RangeError);
        expect(() => b.and(64)).toThrow(RangeError);
      });

      it('throws a Range Error if BitBoard lengths do not match', () => {
        expect(() => b.and(a)).toThrow(RangeError);
      });

      it('throws a Type Error if input is not a BitBoard or number', () => {
        expect(() => b.and('a')).toThrow(TypeError);
        expect(() => b.and({})).toThrow(TypeError);
        expect(() => b.and({ board: [0,0,0,0,0,0,0,0], length: 64 })).toThrow(TypeError);
      });
    });

    describe('or()', () => {
      let a;
      let b;

      beforeEach(() => {
        b = new BitBoard();
        a = new BitBoard([0]);
      });

      it('throws a Range Error for values less than zero or greater than BitBoard.length', () => {
        expect(() => b.or(-1)).toThrow(RangeError);
        expect(() => b.or(64)).toThrow(RangeError);
      });

      it('throws a Range Error if BitBoard lengths do not match', () => {
        expect(() => b.or(a)).toThrow(RangeError);
      });

      it('throws a Type Error if input is not a BitBoard or number', () => {
        expect(() => b.or('a')).toThrow(TypeError);
        expect(() => b.or({})).toThrow(TypeError);
        expect(() => b.or({ board: [0,0,0,0,0,0,0,0], length: 64 })).toThrow(TypeError);
      });
    });

    describe('xOr()', () => {
      let a;
      let b;

      beforeEach(() => {
        b = new BitBoard();
        a = new BitBoard([0]);
      });

      it('throws a Range Error for values less than zero or greater than BitBoard.length', () => {
        expect(() => b.xOr(-1)).toThrow(RangeError);
        expect(() => b.xOr(64)).toThrow(RangeError);
      });

      it('throws a Range Error if BitBoard lengths do not match', () => {
        expect(() => b.xOr(a)).toThrow(RangeError);
      });

      it('throws a Type Error if input is not a BitBoard or number', () => {
        expect(() => b.xOr('a')).toThrow(TypeError);
        expect(() => b.xOr({})).toThrow(TypeError);
        expect(() => b.xOr({ board: [0,0,0,0,0,0,0,0], length: 64 })).toThrow(TypeError);
      });
    });

    describe('shiftLeft()', () => {
      let b = new BitBoard();

      it('throws a Range Error for values less than zero or greater than BitBoard.length', () => {
        expect(() => b.shiftLeft(-1)).toThrow(RangeError);
        expect(() => b.shiftLeft(65)).toThrow(RangeError);
      });

      it('throws a Type Error if input is not a number', () => {
        expect(() => b.shiftLeft('a')).toThrow(TypeError);
      });
    });

    describe('shiftRight()', () => {
      let b = new BitBoard();

      it('throws a Range Error for values less than zero or greater than BitBoard.length', () => {
        expect(() => b.shiftRight(-1)).toThrow(RangeError);
        expect(() => b.shiftRight(65)).toThrow(RangeError);
      });

      it('throws a Type Error if input is not a number', () => {
        expect(() => b.shiftRight('a')).toThrow(TypeError);
      });
    });
  });

  xdescribe('operations between bit boards', () => {
    let boardA;
    let boardB;
    let zeroBoard = '0'.repeat(8);
    let oneBoard = '1'.repeat(8);


    beforeEach(() => {
      boardA = new BitBoard([255]);
      boardB = new BitBoard([0]);
    });

    it('does not change either bit board with AND', () => {
      boardA.and(boardB);

      expect(boardA.boardToString()).toEqual(oneBoard);
      expect(boardB.boardToString()).toEqual(zeroBoard);
    });

    it('correctly ANDs two bit boards', () => {
      expect(boardA.and(boardB).boardToString()).toEqual(zeroBoard);
    });

    it('does not change either bit board with OR', () => {
      boardA.or(boardB);

      expect(boardA.boardToString()).toEqual(oneBoard);
      expect(boardB.boardToString()).toEqual(zeroBoard);
    });

    it('correctly ORs two bit boards', () => {
      expect(boardA.or(boardB).boardToString()).toEqual(oneBoard);
    });

    it('does not change either bit board with XOR', () => {
      boardA.xOr(boardB);

      expect(boardA.boardToString()).toEqual(oneBoard);
      expect(boardB.boardToString()).toEqual(zeroBoard);
    });

    it('correctly XORs two bit boards', () => {
      expect(boardA.xOr(boardB).boardToString()).toEqual(oneBoard);
    });

    it('does not change a bit board with NOT', () => {
      boardA.not();

      expect(boardA.boardToString()).toEqual(oneBoard);
    });

    it('correctly NOTs a bit board', () => {
      expect(boardA.not().boardToString()).toEqual(zeroBoard);
    });

    it('does not change either bit board with shiftLeft()', () => {
      boardA.shiftLeft(8);

      expect(boardA.boardToString()).toEqual(oneBoard);
    });

    it('correctly bit shifts a bit board left', () => {
      expect(boardA.shiftLeft(8).boardToString()).toEqual(zeroBoard);

      boardA = new BitBoard([255]);

      expect(boardA.shiftLeft(4).boardToString()).toEqual('1111'.padEnd(8, '0'));
    });

    it('does not change either bit board with shiftRight()', () => {
      boardA.shiftRight(8);

      expect(boardA.boardToString()).toEqual(oneBoard);
    });

    it('correctly bit shifts a bit board right', () => {
      expect(boardA.shiftRight(8).boardToString()).toEqual(zeroBoard);

      boardA = new BitBoard([255]);

      expect(boardA.shiftRight(4).boardToString()).toEqual('1111'.padStart(8, '0'));
    });
  });

  xdescribe('operations between a bit board and a number', () => {
    let boardA;
    let zeroBoard = '0'.repeat(8);
    let oneBoard = '1'.repeat(8);


    beforeEach(() => {
      boardA = new BitBoard([255]);
    });

    it('correctly returns the bit at an index', () => {
      bitBoard = new BitBoard([129]);

      expect(bitBoard.getIndex(0)).toBe(1);
      expect(bitBoard.getIndex(1)).toBe(0);
      expect(bitBoard.getIndex(6)).toBe(0);
      expect(bitBoard.getIndex(7)).toBe(1);
    });

    it('does not change the bit board with AND', () => {
      boardA.and(1);

      expect(boardA.boardToString()).toEqual(oneBoard);
    });

    it('correctly ANDs a bit board and one at an index', () => {
      expect(boardA.and(0).boardToString()).toEqual(oneBoard);
      expect(boardA.and(1).boardToString()).toEqual(oneBoard);
      expect(boardA.and(2).boardToString()).toEqual(oneBoard);
      expect(boardA.and(3).boardToString()).toEqual(oneBoard);
    });

    it('does not change a bit board with OR', () => {
      boardA.or(1);

      expect(boardA.boardToString()).toEqual(oneBoard);
    });

    it('correctly ORs a bit board and 1 at an index', () => {
      expect(boardA.or(1).boardToString()).toEqual(oneBoard);
      expect(boardA.or(2).boardToString()).toEqual(oneBoard);
      expect(boardA.or(3).boardToString()).toEqual(oneBoard);
    });

    it('does not change the bit board with XOR', () => {
      boardA.xOr(5);

      expect(boardA.boardToString()).toEqual(oneBoard);
    });

    it('correctly XORs a bit board and 1 at an index', () => {
      expect(boardA.xOr(0).boardToString()).toEqual('1'.repeat(7) + '0');
      expect(boardA.xOr(1).boardToString()).toEqual('1'.repeat(6) + '01');
      expect(boardA.xOr(2).boardToString()).toEqual('1'.repeat(5) + '011');
      expect(boardA.xOr(3).boardToString()).toEqual('1'.repeat(4) + '0111');
    });
  });
});