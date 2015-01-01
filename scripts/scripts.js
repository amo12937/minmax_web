(function() {
  "use strict";
  (function(moduleName) {
    return angular.module(moduleName, ["ng"]).factory("" + moduleName + ".PlayerBase", function() {
      var idSeed;
      idSeed = 0;
      return function(name) {
        var id;
        id = idSeed++;
        return {
          id: function() {
            return id;
          },
          name: function() {
            return name;
          }
        };
      };
    });
  })("amo.minmax.Player");

}).call(this);

//# sourceMappingURL=player.js.map
;(function() {
  "use strict";
  (function(moduleName) {
    return angular.module(moduleName).factory("" + moduleName + ".Man", [
      "$q", "" + moduleName + ".PlayerBase", function($q, PlayerBase) {
        return function(name, boardMaster) {
          var deferred, self;
          deferred = null;
          self = PlayerBase(name);
          self.choice = function(p) {
            if (!deferred) {
              return;
            }
            if (!boardMaster.selectable(p)) {
              return;
            }
            deferred.resolve(p);
            return deferred = null;
          };
          self.play = function(callback) {
            var promise;
            deferred = $q.defer();
            promise = deferred.promise;
            promise.then(function(p) {
              boardMaster.select(p);
              return callback(boardMaster.isFinished());
            });
          };
          return self;
        };
      }
    ]);
  })("amo.minmax.Player");

}).call(this);

//# sourceMappingURL=man.js.map
;(function() {
  "use strict";
  (function(moduleName) {
    return angular.module(moduleName).factory("" + moduleName + ".Com.Base", [
      "$timeout", "" + moduleName + ".PlayerBase", function($timeout, PlayerBase) {
        return function(name, boardMaster, maxDepth, delay) {
          var self;
          if (maxDepth == null) {
            maxDepth = 7;
          }
          if (delay == null) {
            delay = 0;
          }
          self = PlayerBase(name);
          self.play = function(callback) {
            return $timeout(function() {
              var pos;
              pos = self.getChosen(maxDepth);
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

//# sourceMappingURL=base.js.map
;(function() {
  "use strict";
  (function(moduleName) {
    return angular.module(moduleName).factory("" + moduleName + ".Com.AlphaBeta", [
      "" + moduleName + ".Com.Base", function(ComBase) {
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
              if (boardMaster.current.result(turn)) {
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
          self = ComBase(name, boardMaster, maxDepth, delay);
          self.getChosen = function(depth) {
            if (boardMaster.current.isFirst()) {
              return choiceFirst(maxDepth);
            } else {
              return choiceNext(maxDepth);
            }
          };
          return self;
        };
      }
    ]);
  })("amo.minmax.Player");

}).call(this);

//# sourceMappingURL=alphaBeta.js.map
;(function() {
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
;(function() {
  "use strict";
  (function(moduleName) {
    return angular.module(moduleName).factory("" + moduleName + ".Com.DoubleChecker", [
      "" + moduleName + ".Com.Base", "" + moduleName + ".Com.AlphaBeta", "" + moduleName + ".Com", function(ComBase, AlphaBeta, MinMax) {
        return function(name, boardMaster, maxDepth, delay) {
          var ab, mm, self;
          if (maxDepth == null) {
            maxDepth = 7;
          }
          if (delay == null) {
            delay = 0;
          }
          ab = AlphaBeta(name, boardMaster, maxDepth, delay);
          mm = MinMax(name, boardMaster, maxDepth, delay);
          self = ComBase(name, boardMaster, maxDepth, delay);
          self.getChosen = function(depth) {
            var abPos, mmPos;
            abPos = ab.getChosen(depth);
            mmPos = mm.getChosen(depth);
            if (!(abPos[0] === mmPos[0] && abPos[1] === mmPos[1])) {
              console.log("abPos = (" + abPos + "), mmPos = (" + mmPos + ")");
            }
            return abPos;
          };
          return self;
        };
      }
    ]);
  })("amo.minmax.Player");

}).call(this);

//# sourceMappingURL=doubleChecker.js.map
;(function() {
  "use strict";
  (function(moduleName) {
    return angular.module(moduleName, ["ng", "amo.module.translator"]).value("" + moduleName + ".config", {
      resourceDir: "res/minmax/translator/",
      resourceExt: ".json",
      loader: {
        trans: {
          rules: [
            {
              key: "en",
              displayName: "English"
            }, {
              key: "jp",
              displayName: "日本語"
            }
          ],
          defaultRule: "jp"
        }
      }
    });
  })("amo.minmax.module.translator");

}).call(this);

//# sourceMappingURL=translator.js.map
;(function() {
  "use strict";
  (function(moduleName) {
    return angular.module(moduleName).factory("" + moduleName + ".api.GetRule", [
      "$http", "" + moduleName + ".config", function($http, config) {
        return function() {
          var self;
          return self = {
            getPath: function(name, ext) {
              if (ext == null) {
                ext = config.resourceExt;
              }
              return "" + config.resourceDir + name + ext;
            },
            request: function(name, ext) {
              return $http.get(self.getPath(name, ext));
            }
          };
        };
      }
    ]);
  })("amo.minmax.module.translator");

}).call(this);

//# sourceMappingURL=getRule.js.map
;(function() {
  "use strict";
  (function(moduleName) {
    var translatorModuleName, translatorName;
    translatorModuleName = "amo.module.translator";
    translatorName = "trans";
    return angular.module(moduleName).config([
      "" + translatorModuleName + ".translatorCollectionProvider", function(tcProvider) {
        return tcProvider.registerTranslator(translatorName);
      }
    ]).provider("" + moduleName + ".transResolver", function() {
      return {
        $get: function() {
          return {};
        },
        getResolver: function() {
          return [
            "$location", "" + translatorModuleName + ".translatorCollection", "" + moduleName + ".api.GetRule", function($location, tc, GetRuleApi) {
              var lang, query, translator;
              query = $location.search();
              lang = query.lang || "ja";
              translator = tc.getTranslator(translatorName);
              translator.setRule({});
              return GetRuleApi().request("" + lang + "/" + translatorName).then(function(response) {
                translator.setRule(response.data);
              });
            }
          ];
        }
      };
    });
  })("amo.minmax.module.translator");

}).call(this);

//# sourceMappingURL=transResolver.js.map
;(function() {
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
;(function() {
  "use strict";
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function(moduleName) {
    return angular.module(moduleName, ["ng"]).factory("" + moduleName + ".GameMasterFsm", function() {
      return function(action) {
        var DONE, DefaultState, INIT, PLAYING, STOPPED, changing, currentState, defaultAction, self, setState;
        currentState = null;
        changing = false;
        setState = function(state) {
          if (changing) {
            return;
          }
          changing = true;
          if (currentState != null) {
            if (typeof currentState.Exit === "function") {
              currentState.Exit();
            }
          }
          currentState = state;
          if (state != null) {
            if (typeof state.Entry === "function") {
              state.Entry();
            }
          }
          return changing = false;
        };
        defaultAction = function() {};
        DefaultState = (function() {
          function DefaultState() {}

          DefaultState.prototype.Entry = defaultAction;

          DefaultState.prototype.Exit = defaultAction;

          DefaultState.prototype.start = defaultAction;

          DefaultState.prototype.finish = defaultAction;

          DefaultState.prototype.endGame = defaultAction;

          DefaultState.prototype.stop = function() {
            return setState(STOPPED);
          };

          DefaultState.prototype.started = function() {
            return false;
          };

          DefaultState.prototype.done = function() {
            return false;
          };

          DefaultState.prototype.stopped = function() {
            return false;
          };

          return DefaultState;

        })();
        INIT = new ((function(_super) {
          __extends(_Class, _super);

          function _Class() {
            return _Class.__super__.constructor.apply(this, arguments);
          }

          _Class.prototype.start = function() {
            return setState(PLAYING);
          };

          return _Class;

        })(DefaultState));
        PLAYING = new ((function(_super) {
          __extends(_Class, _super);

          function _Class() {
            return _Class.__super__.constructor.apply(this, arguments);
          }

          _Class.prototype.Entry = function() {
            return action.startPlaying();
          };

          _Class.prototype.Exit = function() {
            return action.finishPlaying();
          };

          _Class.prototype.finish = function() {
            return setState(PLAYING);
          };

          _Class.prototype.endGame = function() {
            return setState(DONE);
          };

          _Class.prototype.started = function() {
            return true;
          };

          return _Class;

        })(DefaultState));
        DONE = new ((function(_super) {
          __extends(_Class, _super);

          function _Class() {
            return _Class.__super__.constructor.apply(this, arguments);
          }

          _Class.prototype.Entry = function() {
            return action.endGame();
          };

          _Class.prototype.stop = defaultAction;

          _Class.prototype.done = function() {
            return true;
          };

          return _Class;

        })(DefaultState));
        STOPPED = new ((function(_super) {
          __extends(_Class, _super);

          function _Class() {
            return _Class.__super__.constructor.apply(this, arguments);
          }

          _Class.prototype.Entry = function() {
            return action.stop();
          };

          _Class.prototype.stop = defaultAction;

          _Class.prototype.stopped = function() {
            return true;
          };

          return _Class;

        })(DefaultState));
        currentState = INIT;
        self = function() {
          return currentState;
        };
        self.changing = function() {
          return changing;
        };
        return self;
      };
    }).factory("" + moduleName + ".GameMaster", [
      "$timeout", "" + moduleName + ".GameMasterFsm", function($timeout, Fsm) {
        return function(delegate, nextPlayer) {
          var current, fsm, self;
          current = nextPlayer();
          fsm = Fsm({
            startPlaying: function() {
              return $timeout(function() {
                console.log("turn = " + (current.id()));
                return current.play(function(ended) {
                  if (ended) {
                    return fsm().endGame();
                  } else {
                    return fsm().finish();
                  }
                });
              });
            },
            finishPlaying: function() {
              return current = nextPlayer();
            },
            endGame: function() {
              return typeof delegate.endGame === "function" ? delegate.endGame() : void 0;
            },
            stop: function() {
              return typeof delegate.stop === "function" ? delegate.stop() : void 0;
            }
          });
          return self = {
            start: function() {
              return fsm().start();
            },
            current: function() {
              return current;
            },
            stop: function() {
              return typeof fsm === "function" ? fsm().stop() : void 0;
            },
            started: function() {
              return typeof fsm === "function" ? fsm().started() : void 0;
            },
            done: function() {
              return typeof fsm === "function" ? fsm().done() : void 0;
            },
            stopped: function() {
              return typeof fsm === "function" ? fsm().stopped() : void 0;
            }
          };
        };
      }
    ]);
  })("amo.minmax.GameMaster");

}).call(this);

//# sourceMappingURL=gameMaster.js.map
;(function() {
  "use strict";
  (function(modulePrefix) {
    return angular.module("" + modulePrefix + ".controllers", ["ng", "ngRoute", "" + modulePrefix + ".BoardMaster", "" + modulePrefix + ".Player", "" + modulePrefix + ".GameMaster", "" + modulePrefix + ".module.translator"]).controller("" + modulePrefix + ".controllers.minmax", [
      "$location", "$route", "$scope", "" + modulePrefix + ".BoardMaster.RandomScoreCreator", "" + modulePrefix + ".BoardMaster.Board", "" + modulePrefix + ".BoardMaster.BoardMaster", "" + modulePrefix + ".Player.Man", "" + modulePrefix + ".Player.Com.AlphaBeta", "" + modulePrefix + ".Player.Com", "" + modulePrefix + ".Player.Com.DoubleChecker", "" + modulePrefix + ".GameMaster.GameMaster", "amo.module.translator.translatorCollection", function($location, $route, $scope, RandomScoreCreator, Board, BoardMaster, Man, ComAB, Com, ComDC, GameMaster, translatorCollection) {
        var board, boardMaster, createPlayer, createScore, gameMaster, gameMasterDelegate, options, opts, p1, p2, playerClass, playerTypes, players, toNum, translator, _i, _ref, _results;
        playerTypes = {
          "MAN": "MAN",
          "COM": "COM",
          "COMAB": "COMAB",
          "COMDC": "COMDC"
        };
        playerClass = {
          MAN: Man,
          COM: Com,
          COMAB: ComAB,
          COMDC: ComDC
        };
        toNum = function(n, d) {
          if (!n) {
            return d;
          }
          return Number(n);
        };
        createPlayer = function(type, name, level, delay) {
          return playerClass[type](name, $scope.boardMaster, Math.max(level, 1), Math.max(delay, 0));
        };
        translator = translatorCollection.getTranslator("trans");
        opts = $location.search();
        options = {
          min: toNum(opts.min, -10),
          max: toNum(opts.max, 10),
          rank: toNum(opts.rank, 7),
          p1: opts.p1 || playerTypes.MAN,
          p1_name: opts.p1_name || translator("You"),
          p1_level: toNum(opts.p1_level, 5),
          p1_delay: toNum(opts.p1_delay, 100),
          p2: opts.p2 || playerTypes.COMAB,
          p2_name: opts.p2_name || translator("Com"),
          p2_level: toNum(opts.p2_level, 5),
          p2_delay: toNum(opts.p2_delay, 100)
        };
        $scope.levels = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        $scope.p2_level = options.p2_level;
        createScore = RandomScoreCreator(options.min, options.max);
        board = Board(options.rank, createScore, "outside");
        $scope.boardMaster = boardMaster = BoardMaster(board);
        $scope.rankList = (function() {
          _results = [];
          for (var _i = 0, _ref = options.rank - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
          return _results;
        }).apply(this);
        players = {};
        players[boardMaster["const"].TURN.BLACK] = p1 = createPlayer(options.p1, options.p1_name, options.p1_level, options.p1_delay);
        players[boardMaster["const"].TURN.WHITE] = p2 = createPlayer(options.p2, options.p2_name, options.p2_level, options.p2_delay);
        gameMasterDelegate = {
          endGame: function() {
            var result;
            console.log("end");
            result = boardMaster.current.result();
            if (result > 0) {
              return $scope.winner = {
                name: p1.name()
              };
            } else if (result < 0) {
              return $scope.winner = {
                name: p2.name()
              };
            }
          },
          stop: function() {
            return console.log("stop");
          }
        };
        gameMaster = null;
        gameMaster = GameMaster(gameMasterDelegate, function() {
          return players[boardMaster.current.turn()];
        });
        gameMaster.start();
        $scope.play = function() {
          $location.search("p2_level", $scope.p2_level);
          return $route.reload();
        };
        return $scope.clickCell = function(i, j) {
          var _base;
          return typeof (_base = gameMaster.current()).choice === "function" ? _base.choice([i, j]) : void 0;
        };
      }
    ]);
  })("amo.minmax");

}).call(this);

//# sourceMappingURL=minmax.js.map
;(function() {
  "use strict";
  (function(moduleName) {
    return angular.module(moduleName).config([
      "$routeProvider", "amo.minmax.module.translator.transResolverProvider", function($routeProvider, transResolverProvider) {
        return $routeProvider.when("/", {
          templateUrl: "templates/minmax.html",
          controller: "" + moduleName + ".minmax",
          resolve: {
            trans: transResolverProvider.getResolver()
          }
        });
      }
    ]);
  })("amo.minmax.controllers");

}).call(this);

//# sourceMappingURL=route.js.map
;(function() {
  "use strict";
  (function(ng) {
    return ng.module("ngLoadScript", []).directive("script", function() {
      return {
        restrict: "E",
        scope: false,
        link: function(scope, elm, attr) {
          var code, f;
          if (attr.type !== "text/javascript-lazy") {
            return;
          }
          code = elm.text();
          f = new Function(code);
          return f();
        }
      };
    });
  })(angular);

}).call(this);

//# sourceMappingURL=ngLoadScript.js.map
;(function() {
  "use strict";
  (function(modulePrefix) {
    return angular.module("" + modulePrefix + ".Main", ["ng", "ngLoadScript", "" + modulePrefix + ".BoardMaster", "" + modulePrefix + ".Player", "" + modulePrefix + ".controllers"]);
  })("amo.minmax");

}).call(this);

//# sourceMappingURL=app.js.map
;(function() {
  "use strict";
  angular.element(window.document).ready(function() {
    var e, p;
    try {
      return angular.bootstrap(window.document, ["amo.minmax.Main"]);
    } catch (_error) {
      e = _error;
      p = e.message.indexOf("?");
      console.log(decodeURIComponent(e.message.slice(p + 1)));
      return console.log(e);
    }
  });

}).call(this);

//# sourceMappingURL=bootstrap.js.map
