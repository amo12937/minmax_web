(function() {
  "use strict";
  (function(moduleName) {
    var _black, _nextTurn, _used, _white;
    _white = 0;
    _black = 1;
    _nextTurn = function(turn) {
      return 1 - turn;
    };
    _used = "**";
    return angular.module(moduleName, ["ng"]).factory("" + moduleName + ".RandomScoreCreator", function() {
      return function(min, max) {
        return function() {
          return Math.floor(Math.random() * (max - min + 1)) + min;
        };
      };
    }).factory("" + moduleName + ".Board", function() {
      return function(rank, createScore, outside) {
        var b, i, j, l, self, _i, _ref, _results;
        l = (function() {
          _results = [];
          for (var _i = 0, _ref = rank - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
          return _results;
        }).apply(this);
        b = (function() {
          var _j, _len, _results1;
          _results1 = [];
          for (_j = 0, _len = l.length; _j < _len; _j++) {
            i = l[_j];
            _results1.push((function() {
              var _k, _len1, _results2;
              _results2 = [];
              for (_k = 0, _len1 = l.length; _k < _len1; _k++) {
                j = l[_k];
                _results2.push([false, createScore(i, j)]);
              }
              return _results2;
            })());
          }
          return _results1;
        })();
        return self = {
          rank: function() {
            return rank;
          },
          isInside: function(p) {
            var _ref1, _ref2;
            return (0 <= (_ref1 = p[_white]) && _ref1 < rank) && (0 <= (_ref2 = p[_black]) && _ref2 < rank);
          },
          get: function(p) {
            if (self.isInside(p)) {
              return b[p[_white]][p[_black]][1];
            }
            return outside;
          },
          used: function(p) {
            if (!self.isInside(p)) {
              return false;
            }
            return b[p[_white]][p[_black]][0];
          },
          use: function(p) {
            if (self.isInside(p)) {
              return b[p[_white]][p[_black]][0] = true;
            }
          },
          unuse: function(p) {
            if (self.isInside(p)) {
              return b[p[_white]][p[_black]][0] = false;
            }
          }
        };
      };
    }).factory("" + moduleName + ".BoardMaster", function() {
      var BoardMaster;
      BoardMaster = function(board) {
        var pos, score, self, stack, turn;
        turn = _black;
        score = [0, 0];
        pos = [];
        stack = [];
        return self = {
          "const": {
            rank: function() {
              return board.rank();
            },
            TURN: {
              BLACK: _black,
              WHITE: _white
            }
          },
          current: {
            turn: function(t) {
              if (t === void 0) {
                return turn;
              }
              return turn === t;
            },
            score: function(t) {
              if (t === void 0) {
                return [score[_white], score[_black]];
              }
              return score[t];
            },
            position: function(p) {
              if (p === void 0) {
                return [pos[_white], pos[_black]];
              }
              return p[_white] === pos[_white] && p[_black] === pos[_white];
            },
            isFirst: function() {
              return pos[_white] === void 0 && pos[_black] === void 0;
            },
            result: function(t) {
              if (t === void 0) {
                return score[_black] - score[_white];
              }
              return score[t] > score[_nextTurn(t)];
            }
          },
          get: function(p) {
            return board.get(p);
          },
          used: function(p) {
            return board.used(p);
          },
          selectable: function(p) {
            var t;
            if (!board.isInside(p)) {
              return false;
            }
            t = _nextTurn(turn);
            if (pos[t] === void 0) {
              return true;
            }
            if (p[t] !== pos[t]) {
              return false;
            }
            return !board.used(p);
          },
          select: function(p) {
            var oldPos, s, t;
            if (!self.selectable(p)) {
              return false;
            }
            oldPos = pos;
            pos = [p[_white], p[_black]];
            s = board.get(pos);
            score[turn] += s;
            board.use(pos);
            t = turn;
            turn = _nextTurn(t);
            stack.push(function() {
              turn = t;
              board.unuse(pos);
              score[turn] -= s;
              return pos = oldPos;
            });
            return true;
          },
          undo: function() {
            var _base;
            return typeof (_base = stack.pop()) === "function" ? _base() : void 0;
          },
          isFinished: function() {
            var n, p, _i, _ref;
            if (pos[turn] === void 0) {
              return false;
            }
            p = self.current.position();
            for (n = _i = 0, _ref = board.rank() - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; n = 0 <= _ref ? ++_i : --_i) {
              p[turn] = n;
              if (self.selectable(p)) {
                return false;
              }
            }
            return true;
          }
        };
      };
      return BoardMaster;
    });
  })("amo.minmax.BoardMaster");

}).call(this);

//# sourceMappingURL=boardMaster.js.map
