(function() {
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
