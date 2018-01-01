var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');

//Here we are configuring express to use body-parser as middle-ware.
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var brain = require('../logic/campaignAPILogic.js');
var bonusAPILogic = require('../logic/bonusAPILogic.js');

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
router.get('/get_campagins', function(req, res, next) { //http://localhost:3000/bonus/get_campagins
    var ans={};
    try {
        ans = brain.getCampaignModelsList();
    }
    catch (err)
    {
        errorLog.error('Errors in brain.getCampaignModelsList() . Trace: '+ err.stack);
    }
    res.send(ans);
});


/**
 *   json with the well known structure should be in the req.body
     id should be an integer as requested in the spec (double will return an error msg).
     Headers:
        Content-Type : application/json
 */
router.post('/add_campaign', function(req, res, next) { //http://localhost:3000/bonus/add_campaign
    var ans={};
    var campaign = req.body;
    if (!Number.isInteger(parseInt(campaign.id)))
    {
        errorLog.error('Bad Request, id is not an integer: ' + campaign.id);
        res.send('This campaign id is an integer');
        return;
    }
    try {
        ans = bonusAPILogic.addCampaign(campaign);
    }
    catch (err)
    {
        errorLog.error('Errors in brain.addCampaign() . Trace: '+ err.stack);
    }
    res.send(ans);
});


/**
 * Simply as it sounds, gets a campaign id
 */
router.get('/delete_campaign', function(req, res, next) { //http://localhost:3000/bonus/delete_campaign
    var ans={};
    var campaign_id = req.query.campaign_id; // $_GET["campaign_id"]
    try {
        ans = bonusAPILogic.deleteCampaign(campaign_id);

    }
    catch (err)
    {
        errorLog.error('Errors in brain.deleteCampaign(campaign_id) . Trace: '+ err.stack);
    }
    res.send(ans);
});

/**
 *  With this requst you can restart campaign_id=123 thresholds
    You can check the effect with get_users_map
 */
router.get('/restart_campaign', function(req, res, next) { //http://localhost:3000/bonus/restart_campaign
    var ans={};
    var campaign_id = req.query.campaign_id; // $_GET["campaign_id"]
    try {
        ans = bonusAPILogic.restartExistingCampaignThresholds(campaign_id);
    }
    catch (err)
    {
        errorLog.error('Errors in brain.getCampaignModelsList() . Trace: '+ err.stack);
    }
    res.send(ans);
});


/**
 * With this request you can edit campaign_id=123 and set it's target_name a name u choose

 */
router.get('/edit_campaign_name', function(req, res, next) { //http://localhost:3000/bonus/edit_campaign_name
    var ans={};
    try
    {
        var campaign_id = req.query.campaign_id; // $_GET["campaign_id"]
        var target_name = req.query.target_name; // $_GET["target_name"] - name souldn't be empty. it's doesn't make sense
        if(campaign_id == '' || target_name =='' )
        {
            errorLog.error('At least one of the parameters is empty.  ');
            res.send('At least one of the parameters is empty.');
            return;
        }
        ans = bonusAPILogic.edit_campaign_name(campaign_id,target_name);
    }
    catch (err)
    {
        errorLog.error('Errors in brain.edit_campaign_name() . Trace: '+ err.stack);
    }
    res.send(ans);
});

/**
 * This request returns the updated status fof each user and his thresholds.
 */
router.get('/get_users_map', function(req, res, next) { //http://localhost:3000/bonus/get_users_map

    var ans={};
    try
    {
        ans = brain.getUsersMap();
    }
    catch (err)
    {
        errorLog.error('Errors in brain.get_users_map() . Trace: '+ err.stack);
    }
    res.send(ans);
});



module.exports = router;
