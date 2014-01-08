"use strict";

var jQuery = require("jquery");

module.exports = jQuery.fn ? jQuery : jQuery(window);
