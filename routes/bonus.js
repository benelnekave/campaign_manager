var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');

//Here we are configuring express to use body-parser as middle-ware.
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var brain = require('../logic/campaignAPILogic.js');
var bonusAPILogic = require('../logic/bonusAPILogic.js');
var bonusHelper = require('./bonusHelper.js');

const errorLog = require('../util/logger').errorlog;
const successLog = require('../util/logger').successlog;
const debugLog = require('../util/logger').debuglog;

/**
 * This request will return the campaignModelList which holds some back office
     information on each campaign:
     num_of_users_got_it
     num_of_per_user_reached_0
     total_threshold_reached
     last_date_this_campaign_returned
     campaignOriginalDetails
 */
router.get('/get_campagins',function(req, res) {
    bonusHelper.get_campagins(req,res)
} );


/**
 *   json with the well known structure should be in the req.body
     id should be an integer as requested in the spec (double will return an error msg).
     Headers:
        Content-Type : application/json
 */
router.post('/add_campaign', function(req, res) { //http://localhost:3000/bonus/add_campaign
    bonusHelper.add_campaign(req,res);
});


/**
 * Simply as it sounds, gets a campaign id
 */
router.get('/delete_campaign', function(req, res) { //http://localhost:3000/bonus/delete_campaign
    bonusHelper.delete_campaign(req,res);
});

/**
 *  With this requst you can restart campaign_id=123 thresholds
    You can check the effect with get_users_map
 */
router.get('/restart_campaign', function(req, res) { //http://localhost:3000/bonus/restart_campaign
    bonusHelper.restart_campaign(req,res);
});


/**
 * With this request you can edit campaign_id=123 and set it's target_name a name u choose

 */
router.get('/edit_campaign_name', function(req, res) { //http://localhost:3000/bonus/edit_campaign_name
    bonusHelper.edit_campaign_name(req,res);
});

/**
 * This request returns the updated status fof each user and his thresholds.
 */
router.get('/get_users_map', function(req, res) { //http://localhost:3000/bonus/get_users_map
    bonusHelper.get_users_map(req,res);

});

module.exports = router;
