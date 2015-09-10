module.exports = function(callback){
    var htmlFile = "index.html";

    console.log("   >", htmlFile);
    console.log("   >", htmlFile, "===> START");

    fs.readFile(htmlFile, function(error, data){
        var xhtml = data.toString();
        var match = xhtml.substr(0, xhtml.length).match(/[^<Yennoo\.config]+version\:.+"(\S*)"+/);
        if (match && match.length >= 2){
            xhtml = xhtml.replace(match[1], RELEASE);
            console.log("   >", htmlFile, "===> Updated from", match[1], "to", RELEASE);
        }

        xhtml = xhtml.replace(/compiled\.css/, "compiled.css?v="+RELEASE)
                     .replace(/compiled\.js/,  "compiled.js?v=" +RELEASE);

        fs.writeFile("./"+ htmlFile, xhtml, function(error, result){
            if (result || error === null){
                console.log("   >", htmlFile, "===> OK >", htmlFile);
                console.log("");
                callback.apply(null, []);
            }
            else if (error) throw error;
        });
    });
};