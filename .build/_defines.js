GLOBAL.fs       = require("fs");
GLOBAL.glob     = require("glob");
GLOBAL.EasyZip  = require("easy-zip").EasyZip;
GLOBAL.cssFiles = glob.sync("assets/**/*.css", {ignore: "../node_modules/**"});
GLOBAL.jsxFiles = glob.sync("./**/*.js", {ignore: "./**/{node_modules,assets/lib,.*}/**"});
GLOBAL.jsxCores = glob.sync("./assets/lib/*.js");

GLOBAL.RELEASE = (process.env.TRAVIS_TAG || process.env.GIT_TAG || "0~devel").replace(/^v/, "");
GLOBAL.PRODUCT = (process.env.product || "yennoo").toLowerCase();