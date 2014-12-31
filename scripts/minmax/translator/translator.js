(function() {
  "use strict";
  (function(moduleName) {
    var translatorModuleName;
    translatorModuleName = "amo.module.Translator";
    return angular.module(moduleName, ["ng", translatorModuleName]).value("" + moduleName + ".config", {
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
  })("amo.minmax.module.Translator");

}).call(this);

//# sourceMappingURL=translator.js.map
