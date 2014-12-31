(function() {
  "use strict";
  (function(moduleName) {
    return angular.module(moduleName).factory("" + moduleName + ".Com", [
      "$timeout", "" + moduleName + ".PlayerBase", function($timeout, PlayerBase) {
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
            if (boardMaster.isFinished()) {
              return [0, [0, 0]];
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
          self = PlayerBase(name);
          self.play = function(callback) {
            return $timeout(function() {
              var pos, _, _ref1, _ref2;
              if (boardMaster.current.isFirst()) {
                _ref1 = choiceFirst(maxDepth), _ = _ref1[0], pos = _ref1[1];
              } else {
                _ref2 = choice(maxDepth), _ = _ref2[0], pos = _ref2[1];
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

//# sourceMappingURL=com.js.map
