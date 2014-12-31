(function() {
  "use strict";
  var __slice = [].slice;

  (function(moduleName) {
    var Translator;
    Translator = function($filter, name, rules) {
      var self;
      if (rules == null) {
        rules = {};
      }
      self = function(key, context) {
        var attrs, filter, filterName, filterNames, k, result, v, _i, _len, _ref, _ref1;
        if (context == null) {
          context = {};
        }
        result = rules[key] || key;
        for (k in context) {
          v = context[k];
          _ref = v instanceof Array ? v : [v], v = _ref[0], filterNames = 2 <= _ref.length ? __slice.call(_ref, 1) : [];
          for (_i = 0, _len = filterNames.length; _i < _len; _i++) {
            filterName = filterNames[_i];
            _ref1 = filterName instanceof Array ? filterName : [filterName], filterName = _ref1[0], attrs = 2 <= _ref1.length ? __slice.call(_ref1, 1) : [];
            filter = $filter(filterName);
            v = filter.apply(filter, [v].concat(__slice.call(attrs)));
          }
          result = result.split("%" + k + "%").join(v);
        }
        return result;
      };
      self.setRules = function(r) {
        if (r == null) {
          r = {};
        }
        return rules = r;
      };
      self.getName = function() {
        return name;
      };
      return self;
    };
    return angular.module(moduleName, ["ng"]).provider("" + moduleName + ".translatorCollection", [
      "$filterProvider", function($filterProvider) {
        var _collection;
        _collection = {};
        return {
          registerTranslator: function(name) {
            return $filterProvider.register(name, [
              "" + moduleName + ".translatorCollection", function(tc) {
                var translator;
                translator = tc.getTranslator(name);
                return function() {
                  return translator.apply(void 0, arguments);
                };
              }
            ]);
          },
          $get: [
            "$filter", function($filter) {
              return {
                getTranslator: function(name) {
                  return _collection[name] != null ? _collection[name] : _collection[name] = Translator($filter, name);
                }
              };
            }
          ]
        };
      }
    ]);
  })("amo.module.Translator");

}).call(this);

//# sourceMappingURL=translatorCollection.js.map
