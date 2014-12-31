(function() {
  "use strict";
  (function(moduleName) {
    return angular.module(moduleName).factory("" + moduleName + ".Com.AlphaBeta", [
      "$timeout", "" + moduleName + ".PlayerBase", function($timeout, PlayerBase) {
        return function(name, boardMaster, maxDepth, delay) {
          var choice, choiceFirst, choiceNext, l, self, _i, _ref, _results;
          if (maxDepth == null) {
            maxDepth = 7;
          }
          if (delay == null) {
            delay = 0;
          }
          l = (function() {
            _results = [];
            for (var _i = 0, _ref = boardMaster["const"].rank() - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
            return _results;
          }).apply(this);
          choice = function(depth, a, b) {
            var i, pos, s, t, turn, _j, _len;
            if (depth <= 0) {
              return 0;
            }
            pos = boardMaster.current.position();
            turn = boardMaster.current.turn();
            if (boardMaster.isFinished()) {
              if (boardMaster.current.winner(turn)) {
                return Infinity;
              } else {
                return -Infinity;
              }
            }
            for (_j = 0, _len = l.length; _j < _len; _j++) {
              i = l[_j];
              pos[turn] = i;
              if (!boardMaster.selectable(pos)) {
                continue;
              }
              boardMaster.select(pos);
              s = boardMaster.current.score(turn);
              t = s - choice(depth - 1, s - b, s - a);
              boardMaster.undo();
              if (t > a) {
                a = t;
              }
              if (a >= b) {
                return a;
              }
            }
            return a;
          };
          choiceFirst = function(depth) {
            var i, j, pos, result, s, score, t, turn, _j, _k, _len, _len1;
            score = -Infinity;
            result = [0, 0];
            turn = boardMaster.current.turn();
            for (_j = 0, _len = l.length; _j < _len; _j++) {
              i = l[_j];
              for (_k = 0, _len1 = l.length; _k < _len1; _k++) {
                j = l[_k];
                pos = [i, j];
                boardMaster.select(pos);
                s = boardMaster.current.score(turn);
                t = s - choice(depth - 1, -Infinity, Infinity);
                boardMaster.undo();
                if (t >= score) {
                  score = t;
                  result = pos;
                }
              }
            }
            return result;
          };
          choiceNext = function(depth) {
            var i, pos, result, s, score, t, turn, _j, _len;
            if (depth <= 0) {
              return [0, 0];
            }
            if (boardMaster.isFinished()) {
              return [0, 0];
            }
            pos = boardMaster.current.position();
            turn = boardMaster.current.turn();
            score = -Infinity;
            result = 0;
            for (_j = 0, _len = l.length; _j < _len; _j++) {
              i = l[_j];
              pos[turn] = i;
              if (!boardMaster.selectable(pos)) {
                continue;
              }
              boardMaster.select(pos);
              s = boardMaster.current.score(turn);
              t = s - choice(depth - 1, -Infinity, Infinity);
              boardMaster.undo();
              if (t >= score) {
                score = t;
                result = i;
              }
            }
            pos[turn] = result;
            return pos;
          };
          self = PlayerBase(name);
          self.play = function(callback) {
            return $timeout(function() {
              var pos;
              if (boardMaster.current.isFirst()) {
                pos = choiceFirst(maxDepth);
              } else {
                pos = choiceNext(maxDepth);
              }
              boardMaster.select(pos);
              return callback(boardMaster.isFinished());
            }, delay);
          };
          return self;
        };
      }
    ]);
  })("amo.minmax.Player");

}).call(this);

//# sourceMappingURL=alphaBeta.js.map
