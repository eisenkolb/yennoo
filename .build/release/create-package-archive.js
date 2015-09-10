module.exports = function(callback){
    console.log("===> Create Package:", PRODUCT);

    /**
     * Requirements and definitions
     */

    var archive = new EasyZip();
    var output  = "%name%-v%tag%.zip".replace("%name%", PRODUCT).replace("%tag%", RELEASE);
    var files   = glob.sync("./**/*", {ignore: "./**/{node_modules,controllers,components,assets/{src,lib,css},index.dev.html,package.json}/**"});
    var batch   = [];

    /**
     * Prepare for the batch process
     */

    for(var index = 0; index < (files || []).length; index++){
        var file  = files[index].replace("./", "");
        if (file && fs.lstatSync(file).isDirectory() === false){
            batch.push({source: file, target: file});
        } else batch.push({target: file});
    }

    /**
     * Adding the Compressed file
     */

    batch.push({source: "./.build/release/compiled.css", target: "assets/css/compiled.css"});
    batch.push({source: "./.build/release/compiled.js", target: "assets/lib/compiled.js"});

    /**
     * Start the Packaging
     */

    console.log("   >", batch.length, "entries found");
    console.log("   > Packaging: START");

    archive.batchAdd(batch, function(){
        archive.writeToFile(output);
        console.log("   > Packaging: OK >", output);
        console.log("");
        callback.apply(null, []);
    });
};