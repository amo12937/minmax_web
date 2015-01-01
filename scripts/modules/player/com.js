(function() {
  "use strict";
  (function(moduleName) {
    return angular.module(moduleName).factory("" + moduleName + ".Com", [
      "" + moduleName + ".Com.Base", function(ComBase) {
        return function(name, boardMaster, maxDepth, delay) {
          var choice, choiceFirst, l, self, _i, _ref, _results;
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
          choice = function(depth) {
            var i, pos, result, s, s2, score, turn, _, _j, _len, _ref1;
            if (depth <= 0) {
              return [0, [0, 0]];
            }
            pos = boardMaster.current.position();
            turn = boardMaster.current.turn();
            if (boardMaster.isFinished()) {
              if (boardMaster.current.result(turn)) {
                return [Infinity, [0, 0]];
              } else {
                return [-Infinity, [0, 0]];
              }
            }
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
              _ref1 = choice(depth - 1), s2 = _ref1[0], _ = _ref1[1];
              s -= s2;
              boardMaster.undo();
              if (s > score) {
                score = s;
                result = i;
              }
            }
            pos[turn] = result;
            return [score, pos];
          };
          choiceFirst = function(depth) {
            var i, j, pos, result, s, s2, score, turn, _, _j, _k, _len, _len1, _ref1;
            turn = boardMaster.current.turn();
            score = -Infinity;
            result = 0;
            for (_j = 0, _len = l.length; _j < _len; _j++) {
              i = l[_j];
              for (_k = 0, _len1 = l.length; _k < _len1; _k++) {
                j = l[_k];
                pos = [i, j];
                boardMaster.select(pos);
                s = boardMaster.current.score(turn);
                _ref1 = choice(depth - 1), s2 = _ref1[0], _ = _ref1[1];
                s -= s2;
                boardMaster.undo();
                if (s > score) {
                  score = s;
                  result = pos;
                }
              }
            }
            return [score, result];
          };
          self = ComBase(name, boardMaster, maxDepth, delay);
          self.getChosen = function(depth) {
            if (boardMaster.current.isFirst()) {
              return choiceFirst(depth)[1];
            } else {
              return choice(depth)[1];
            }
          };
          return self;
        };
      }
    ]);
  })("amo.minmax.Player");

}).call(this);

//# sourceMappingURL=com.js.map
