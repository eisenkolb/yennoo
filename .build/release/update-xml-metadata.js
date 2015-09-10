module.exports = function(callback){
    var addonFile = "addon.xml";

    console.log("===> Update version info");
    console.log("   >", addonFile);
    console.log("   >", addonFile, "===> START");

    fs.readFile(addonFile, function(error, data){
        var addon = data.toString();
        var start = addon.indexOf("<addon");
        var match = addon.substr(start, addon.length).match(/[^<addon]+version="(\S*)"+/);
        if (match && match.length >= 2){
            addon = addon.replace(match[1], RELEASE);
            console.log("   >", addonFile, "===> Updated from", match[1], "to", RELEASE);
        }

        fs.writeFile("./"+ addonFile, addon, function(error, result){
            if (result || error === null){
                console.log("   >", addonFile, "===> OK >", addonFile);
                console.log("");
                callback.apply(null, []);
            }
            else if (error) throw error;
        });
    });
};