require("./_defines");

var steps = function(){
    step1();
};
var step1 = function(){
    this.fn = require("./release/generate-minified-css");
    this.fn(step2);
};
var step2 = function(){
    this.fn = require("./release/generate-compiled-js");
    this.fn(step3);
};
var step3 = function(){
    this.fn = require("./release/update-xml-metadata");
    this.fn(step4);
};
var step4 = function(){
    this.fn = require("./release/update-html-description");
    this.fn(step5);
};
var step5 = function(){
    this.fn = require("./release/create-package-archive");
    this.fn(step6);
};
var step6 = function(){
    console.log("===> Complete");
};

steps.apply(null, []);