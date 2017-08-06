/*jshint node:true*/
"use strict";

var client = {};

require('./client.init')(client);
require('./client.sync')(client);
require('./client.manager')(client);
require('./client.page.home')(client);
require('./client.page.about')(client);
require('./client.page.blog')(client);

module.exports = client;
