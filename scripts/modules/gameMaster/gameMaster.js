(function() {
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
