(function() {
  "use strict";
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function(moduleName) {
    return angular.module(moduleName, ["ng", "amo.module.state_machine"]).factory("" + moduleName + ".GameFsm", [
      "amo.module.state_machine.StateSetter", function(StateSetter) {
        return function(action) {
          var DONE, DefaultState, INIT, PLAYING, STOPPED, s;
          s = StateSetter();
          DefaultState = (function() {
            function DefaultState() {}

            DefaultState.prototype.Entry = s.defaultAction;

            DefaultState.prototype.Exit = s.defaultAction;

            DefaultState.prototype.start = s.defaultAction;

            DefaultState.prototype.pause = s.defaultAction;

            DefaultState.prototype.resume = s.defaultAction;

            DefaultState.prototype.finish = s.defaultAction;

            DefaultState.prototype.stop = function() {
              return s(STOPPED);
            };

            DefaultState.prototype.isInit = function() {
              return false;
            };

            DefaultState.prototype.isPlaying = function() {
              return false;
            };

            DefaultState.prototype.isPausing = function() {
              return false;
            };

            DefaultState.prototype.isDone = function() {
              return false;
            };

            DefaultState.prototype.isStopped = function() {
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
              return s(PLAYING);
            };

            _Class.prototype.isInit = function() {
              return true;
            };

            return _Class;

          })(DefaultState));
          PLAYING = (function() {
            var pausing;
            pausing = false;
            return new ((function(_super) {
              __extends(_Class, _super);

              function _Class() {
                return _Class.__super__.constructor.apply(this, arguments);
              }

              _Class.prototype.Entry = function() {
                return action.startToPlay();
              };

              _Class.prototype.Exit = function() {
                return action.finishPlaying();
              };

              _Class.prototype.pause = function() {
                if (pausing) {
                  return;
                }
                if (!action.canPause()) {
                  return;
                }
                pausing = true;
                return action.pause();
              };

              _Class.prototype.resume = function() {
                if (!pausing) {
                  return;
                }
                action.resume();
                return pausing = false;
              };

              _Class.prototype.finish = function(ended) {
                if (pausing) {
                  return;
                }
                if (ended) {
                  return s(DONE);
                } else {
                  return s(PLAYING);
                }
              };

              _Class.prototype.isPlaying = function() {
                return true;
              };

              _Class.prototype.isPausing = function() {
                return pausing;
              };

              return _Class;

            })(DefaultState));
          })();
          DONE = new ((function(_super) {
            __extends(_Class, _super);

            function _Class() {
              return _Class.__super__.constructor.apply(this, arguments);
            }

            _Class.prototype.Entry = function() {
              return action.entryDone();
            };

            _Class.prototype.stop = s.defaultAction;

            _Class.prototype.isDone = function() {
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
              return action.entryStopped();
            };

            _Class.prototype.stop = s.defaultAction;

            _Class.prototype.isStopped = function() {
              return true;
            };

            return _Class;

          })(DefaultState));
          return s.getFsm(INIT);
        };
      }
    ]).factory("" + moduleName + ".Game", [
      "$timeout", "" + moduleName + ".GameFsm", function($timeout, Fsm) {
        return function(delegate) {
          var current, fsm, self;
          current = null;
          fsm = Fsm({
            startToPlay: function() {
              if (typeof delegate.notifyStartingToPlay === "function") {
                delegate.notifyStartingToPlay();
              }
              current = delegate.getNextPlayer();
              return $timeout(function() {
                return current.play(function(ended) {
                  return fsm().finish(ended);
                });
              });
            },
            finishPlaying: function() {
              current = null;
              return typeof delegate.notifyFinishedPlaying === "function" ? delegate.notifyFinishedPlaying() : void 0;
            },
            canPause: function() {
              return current != null ? typeof current.canPause === "function" ? current.canPause() : void 0 : void 0;
            },
            pause: function() {
              current.pause();
              return typeof delegate.notifyPausing === "function" ? delegate.notifyPausing() : void 0;
            },
            resume: function() {
              if (typeof delegate.notifyResuming === "function") {
                delegate.notifyResuming();
              }
              return current.resume();
            },
            entryDone: function() {
              return typeof delegate.end === "function" ? delegate.end() : void 0;
            },
            entryStopped: function() {
              return typeof delegate.stop === "function" ? delegate.stop() : void 0;
            }
          });
          return self = {
            start: function() {
              return fsm().start();
            },
            pause: function() {
              return fsm().pause();
            },
            resume: function() {
              return fsm().resume();
            },
            stop: function() {
              return fsm().stop();
            }
          };
        };
      }
    ]);
  })("amo.module.game.game");

}).call(this);
