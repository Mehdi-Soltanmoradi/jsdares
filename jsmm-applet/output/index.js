/*jshint node:true*/
"use strict";

var output = {};

require('./output.robot')(output);
require('./output.console')(output);
require('./output.canvas')(output);
require('./output.input')(output);
require('./output.math')(output);
require('./output.performance')(output);

module.exports = output;