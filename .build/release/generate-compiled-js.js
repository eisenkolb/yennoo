module.exports = function(callback){
    console.log("===> Compile JavaScript");

    /**
     * None file present? throw an Error
     */

    if (jsxFiles.length === 0 || Array.isArray(jsxFiles) === false){
        throw new Error("none input");
    }

    /**
     * Requirements and definitions
     */

    var compiled = "compiled.js";
    var compiler = require("closurecompiler");

    /**
     * jQuery should the first, push it
     */

    jsxCores.sort(function(input){
        this.temp = input.split("/");
        this.temp = temp[temp.length-1];

        return(this.temp[0] < "j");
    });

    /**
     * Combine the sorted 'library'
     */

    jsxFiles = jsxCores.concat(jsxFiles);
    jsxFiles = jsxFiles.filter(function(input){
        if(input && input.indexOf("transporter.demo") < 0){
            return(input);
        }
    });

    /**
     * Start the compiling
     */

    console.log("   >", jsxFiles.length, "files found");
    console.log("   > Compressing: START");

    compiler.compile(jsxFiles,
        {
            compilation_level: "WHITESPACE_ONLY",
            Formatting       : "PRINT_INPUT_DELIMITER"
        },
        function(error, result){
            if (result){
                result = result.replace(/Yennoo.register.controller\(/ig, "Yennoo.controller(");
                fs.writeFile(__dirname +"/"+ compiled, result, function(error, result){
                    if (result || error === null){
                        console.log("   > Compressing: OK >", compiled);
                        console.log("");
                        callback.apply(null, []);
                    }
                });
            }
            else if (error) throw error;
        }
    );
};