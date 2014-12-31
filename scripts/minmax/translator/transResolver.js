(function() {
  "use strict";
  (function(moduleName) {
    var translatorModuleName, translatorName;
    translatorModuleName = "amo.module.Translator";
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
              lang = query.lang || "jp";
              translator = tc.getTranslator(translatorName);
              translator.setRules({});
              return GetRuleApi().request("" + lang + "/" + translatorName).then(function(response) {
                translator.setRules(response.data);
              });
            }
          ];
        }
      };
    });
  })("amo.minmax.module.Translator");

}).call(this);

//# sourceMappingURL=transResolver.js.map
