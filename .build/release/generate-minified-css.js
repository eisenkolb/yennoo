module.exports = function(callback){
    console.log("===> Generate CSS");

    /**
     * None file present? throw an Error
     */

    if (cssFiles.length === 0 || Array.isArray(cssFiles) === false){
        throw new Error("none input");
    }

    /**
     * Requirements and definitions
     */

    var compiled = "compiled.css";
    var uglified = require("uglifycss").processFiles(cssFiles);

    /**
     * Start the compressing
     */

    console.log("   >", cssFiles.length, "files found");
    console.log("   > Compressing: START");

    fs.writeFile(__dirname +"/"+ compiled, uglified, function(error, result){
        if (result || error === null){
            console.log("   > Compressing: OK >", compiled);
            console.log("");
            callback.apply(null, []);
        }
        else if (error) throw error;
    });
};