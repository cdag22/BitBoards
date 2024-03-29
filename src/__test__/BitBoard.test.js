const { BitBoard } = require('../../bitboards.js');

describe('BitBoard', () => {

  describe('errors', () => {

    describe('constructor', () => {

      describe('board type is array', () => {
        it('throws a Type Error for parameters not equal to an array of numbers', () => {
          expect(() => new BitBoard(['a'])).toThrow(Error);
        })
        
        it('throws Range Error for values less than zero or greater than 2 ^ 32 - 1', () => {
          expect(() => new BitBoard([0, -1])).toThrow(Error);
          expect(() => new BitBoard([0, Math.pow(2, 32)])).toThrow(Error);
        });
      })
      
      describe('board type is string', () => {
        it('throws Syntax Error for strings greater than 64 characters', () => {
          expect(() => new BitBoard('0'.repeat(65))).toThrow(SyntaxError);
        });
        
        it('throws Syntax Error for strings contain characters other than 1s or 0s', () => {
          expect(() => new BitBoard('a')).toThrow(SyntaxError);
        });

        it('does not throw error for strings equal to 64 1s and 0s', () => {
          expect(() => new BitBoard('0'.repeat(64))).not.toThrow(SyntaxError);
        });
      });
    });
    
    describe('getIndex()', () => {
      it('throws a Range Error for values less than zero xOr greater than BitBoard.length', () => {
        const b = new BitBoard();

        expect(() => b.getIndex(64)).toThrow(RangeError);
        expect(() => b.getIndex(-1)).toThrow(RangeError);
      });
    });

    describe('and()', () => {
      let b;

      beforeEach(() => {
        b = new BitBoard();
      });

      it('throws a Type Error if input is not a BitBoard xOr number', () => {
        expect(() => b.and('a')).toThrow(TypeError);
        expect(() => b.and({})).toThrow(TypeError);
        expect(() => b.and({ board: [0,0], length: 64 })).toThrow(TypeError);
      });
    });

    describe('or()', () => {
      let b;

      beforeEach(() => {
        b = new BitBoard();
      });

      it('throws a Type Error if input is not a BitBoard or number', () => {
        expect(() => b.or('a')).toThrow(TypeError);
        expect(() => b.or({})).toThrow(TypeError);
        expect(() => b.or({ board: [0,0], length: 64 })).toThrow(TypeError);
      });
    });

    describe('xOr()', () => {
      let b;

      beforeEach(() => {
        b = new BitBoard();
      });

      it('throws a Type Error if input is not a BitBoard or number', () => {
        expect(() => b.xOr('a')).toThrow(TypeError);
        expect(() => b.xOr({})).toThrow(TypeError);
        expect(() => b.xOr({ board: [0,0], length: 64 })).toThrow(TypeError);
      });
    });

    describe('orNumber()', () => {
      let MAX_BITS = 4294967296;
      let b;

      beforeEach(() => {
        b = new BitBoard();
      });

      it('Range Error for shiftAmount < 0 || shiftAmount > 63', () => {
        expect(() => b.orNumber(-1, 1)).toThrow(RangeError);
        expect(() => b.orNumber(64, 1)).toThrow(RangeError);
      });

      it('Range Error for num < 0 || num > 2 ^ 32 - 1', () => {
        expect(() => b.orNumber(1, -1)).toThrow(RangeError);
        expect(() => b.orNumber(1, MAX_BITS)).toThrow(RangeError);
      });

      it('Type Error if shiftAmount or num are not type number', () => {
        expect(() => b.orNumber('1',1)).toThrow(TypeError);
        expect(() => b.orNumber(1, '1')).toThrow(TypeError);
      })
    });
    
    describe('xOrNumber()', () => {
      let MAX_BITS = 4294967296;
      let b;

      beforeEach(() => {
        b = new BitBoard();
      });

      it('Range Error for shiftAmount < 0 || shiftAmount > 63', () => {
        expect(() => b.xOrNumber(-1, 1)).toThrow(RangeError);
        expect(() => b.xOrNumber(64, 1)).toThrow(RangeError);
      });

      it('Range Error for num < 0 || num > 2 ^ 32 - 1', () => {
        expect(() => b.xOrNumber(1, -1)).toThrow(RangeError);
        expect(() => b.xOrNumber(1, MAX_BITS)).toThrow(RangeError);
      });

      it('Type Error if shiftAmount or num are not type number', () => {
        expect(() => b.xOrNumber('1',1)).toThrow(TypeError);
        expect(() => b.xOrNumber(1, '1')).toThrow(TypeError);
      })
    });

    describe('shiftLeft()', () => {
      let b = new BitBoard();

      it('throws a Range Error for values less than zero or greater than BitBoard.length', () => {
        expect(() => b.shiftLeft(-1)).toThrow(RangeError);
      });

      it('throws a Type Error if input is not a number', () => {
        expect(() => b.shiftLeft('a')).toThrow(TypeError);
      });
    });

    describe('shiftRight()', () => {
      let b = new BitBoard();

      it('throws a Range Error for values less than zero or greater than BitBoard.length', () => {
        expect(() => b.shiftRight(-1)).toThrow(RangeError);
      });

      it('throws a Type Error if input is not a number', () => {
        expect(() => b.shiftRight('a')).toThrow(TypeError);
      });
    });
  });

  describe('binary operations between bit boards', () => {
    let boardA;
    let boardB;
    let zeroBoard = '0'.repeat(64);
    let oneBoard = '1'.repeat(64);


    beforeEach(() => {
      boardA = new BitBoard();
      boardB = new BitBoard([Math.pow(2,32)-1, Math.pow(2,32)-1]);
    });

    it('does not change either bit board with AND', () => {
      boardA.and(boardB);

      expect(boardA.toString()).toEqual(zeroBoard);
      expect(boardB.toString()).toEqual(oneBoard);
    });

    it('correctly ANDs two bit boards', () => {
      expect(boardA.and(boardB).toString()).toEqual(zeroBoard);
    });

    it('does not change either bit board with OR', () => {
      boardA.or(boardB);

      expect(boardA.toString()).toEqual(zeroBoard);
      expect(boardB.toString()).toEqual(oneBoard);
    });

    it('correctly ORs two bit boards', () => {
      expect(boardA.or(boardB).toString()).toEqual(oneBoard);
    });

    it('does not change either bit board with XOR', () => {
      boardA.xOr(boardB);

      expect(boardA.toString()).toEqual(zeroBoard);
      expect(boardB.toString()).toEqual(oneBoard);
    });

    it('correctly XORs two bit boards', () => {
      expect(boardA.xOr(boardB).toString()).toEqual(oneBoard);
    });
  });

  describe('binary operations between a bit board and a number', () => {
    let boardA;
    let boardB;
    let zeroBoard = '0'.repeat(64);
    let oneBoard = '1'.repeat(64);

    beforeEach(() => {
      boardA = new BitBoard();
      boardB = new BitBoard([Math.pow(2,32)-1, Math.pow(2,32)-1]);
    });


    it('getIndex() => correctly returns the bit at an index', () => {
      bitBoard = new BitBoard([0,129]);

      expect(bitBoard.getIndex(0)).toBe(1);
      expect(bitBoard.getIndex(1)).toBe(0);
      expect(bitBoard.getIndex(6)).toBe(0);
      expect(bitBoard.getIndex(7)).toBe(1);
    });

    describe('not', () => {
      it('does not change a bit board with NOT', () => {
        boardA.not();
  
        expect(boardA.toString()).toEqual(zeroBoard);
      });
  
      it('correctly NOTs a bit board', () => {
        expect(boardA.not().toString()).toEqual(oneBoard);
      });
    });

    describe('orNumber()', () => {

      it('does not modify a bit board', () => {
        boardB.orNumber(0, 10);

        expect(boardB.toString()).toEqual(oneBoard);
      });

      it('correctly ors a bit board and a number at an index', () => {
        expect(boardB.orNumber(0, 10).toString()).toEqual(oneBoard);
      });
    });

    describe('xOrNumber()', () => {

      it('does not modify a bit board', () => {
        boardB.xOrNumber(0, 10);

        expect(boardB.toString()).toEqual(oneBoard);
      });

      it('correctly xors a bit board and a number at an index', () => {
        expect(boardB.xOrNumber(0, 10).toString()).toEqual('0101'.padStart(64, '1'));
      });
    });


    describe('shiftLeft()', () => {
      it('does not change bit board', () => {
        boardA.shiftLeft(8);
  
        expect(boardA.toString()).toEqual(zeroBoard);
      });
  
      it('correctly bit shifts a bit board left', () => {
        expect(boardB.shiftLeft(8).toString()).toEqual('00000000'.padStart(64,'1'));
        expect(boardB.shiftLeft(4).toString()).toEqual('0000'.padStart(64, '1'));
        expect(boardB.shiftLeft(43).toString()).toEqual('1'.repeat(21) + '0'.repeat(43))
      });
    });
    
    
    describe('shiftRight()', () => {
      it('does not change bit board', () => {
        boardA.shiftRight(8);
        
        expect(boardA.toString()).toEqual(zeroBoard);
      });
      
      it('correctly bit shifts a bit board right', () => {
        expect(boardB.shiftRight(8).toString()).toEqual('00000000'.padEnd(64, '1'));
        expect(boardB.shiftRight(4).toString()).toEqual('0000'.padEnd(64, '1'));
        expect(boardB.shiftRight(43).toString()).toEqual('0'.repeat(43) + '1'.repeat(21))
      });
    })
  });

  describe('rotations and reflections', () => {
    let boardA;
    let boardB;

    beforeEach(() => {
      boardA = new BitBoard([65535, 0]);
      // boardA --> "0000000000000000111111111111111100000000000000000000000000000000"
      boardB = new BitBoard([16711935,0]);
      // boardB --> "0000000011111111000000001111111100000000000000000000000000000000"
    });

    it('flipVertical()', () => {
      expect(boardA.flipVertical()).toEqual(new BitBoard([ 0, 4294901760 ]));
      // --> "0000000000000000000000000000000011111111111111110000000000000000"

      expect(boardB.flipVertical()).toEqual(new BitBoard([ 0, 4278255360 ]));
      // --> "0000000000000000000000000000000011111111000000001111111100000000"
    });
    
    it('flipDiagonal()', () => {
      expect(boardA.flipDiagonal()).toEqual(new BitBoard([ 202116108, 202116108 ]));
      // --> "0000110000001100000011000000110000001100000011000000110000001100"

      expect(boardB.flipDiagonal()).toEqual(new BitBoard([ 168430090, 168430090 ]));
      // --> "0000101000001010000010100000101000001010000010100000101000001010"
    });
    
    it('rotate180Degrees()', () => {
      expect(boardA.rotate180Degrees()).toEqual(new BitBoard([ 0, 4294901760 ]));
      // --> "0000000000000000000000000000000011111111111111110000000000000000"

      expect(boardB.rotate180Degrees()).toEqual(new BitBoard([ 0, 4278255360 ]));
      // --> "0000000000000000000000000000000011111111000000001111111100000000"
    });
    
    it('rotate90DegreesClockwise()', () => {
      expect(boardA.rotate90DegreesClockwise()).toEqual(new BitBoard([ 202116108, 202116108 ]));
      // --> "0000110000001100000011000000110000001100000011000000110000001100"

      expect(boardB.rotate90DegreesClockwise()).toEqual(new BitBoard([ 168430090, 168430090 ]));
      // --> "0000101000001010000010100000101000001010000010100000101000001010"
    });
  });
});