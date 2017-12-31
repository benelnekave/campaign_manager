
var tap = require('tap');

var campaignDAO = require('../dataRepository/campaignDAO');
campaignDAO.init();
var db = campaignDAO.get_db();
tap.equal(Array.isArray(db),true);
