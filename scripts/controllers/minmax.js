(function() {
  "use strict";
  (function(modulePrefix) {
    return angular.module("" + modulePrefix + ".controllers", ["ng", "ngRoute", "" + modulePrefix + ".BoardMaster", "" + modulePrefix + ".Player", "" + modulePrefix + ".GameMaster", "" + modulePrefix + ".module.Translator"]).controller("" + modulePrefix + ".controllers.minmax", [
      "$location", "$route", "$scope", "" + modulePrefix + ".BoardMaster.RandomScoreCreator", "" + modulePrefix + ".BoardMaster.Board", "" + modulePrefix + ".BoardMaster.BoardMaster", "" + modulePrefix + ".Player.Man", "" + modulePrefix + ".Player.Com", "" + modulePrefix + ".Player.Com.AlphaBeta", "" + modulePrefix + ".GameMaster.GameMaster", function($location, $route, $scope, RandomScoreCreator, Board, BoardMaster, Man, Com, ComAB, GameMaster) {
        var board, boardMaster, createPlayer, createScore, gameMaster, gameMasterDelegate, options, opts, playerClass, playerTypes, players, toNum, _i, _ref, _results;
        playerTypes = {
          "MAN": "MAN",
          "COM": "COM",
          "COMAB": "COMAB"
        };
        playerClass = {
          MAN: Man,
          COM: Com,
          COMAB: ComAB
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
        opts = $location.search();
        options = {
          min: toNum(opts.min, -10),
          max: toNum(opts.max, 10),
          rank: toNum(opts.rank, 7),
          p1: opts.p1 || playerTypes.MAN,
          p1_name: opts.p1_name || "you",
          p1_level: toNum(opts.p1_level, 5),
          p1_delay: toNum(opts.p1_delay, 100),
          p2: opts.p2 || playerTypes.COM,
          p2_name: opts.p2_name || "com",
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
        players[boardMaster["const"].TURN.BLACK] = createPlayer(options.p1, options.p1_name, options.p1_level, options.p1_delay);
        players[boardMaster["const"].TURN.WHITE] = createPlayer(options.p2, options.p2_name, options.p2_level, options.p2_delay);
        gameMasterDelegate = {
          endGame: function() {
            return console.log("end");
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
