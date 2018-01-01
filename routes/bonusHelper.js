const errorLog = require('../util/logger').errorlog;
const successLog = require('../util/logger').successlog;
const debugLog = require('../util/logger').debuglog;

var brain = require('../logic/campaignAPILogic.js');
var bonusAPILogic = require('../logic/bonusAPILogic.js');
function BonusHelper(){}

// This file is created to simplify bonus.js

BonusHelper.get_campagins=  function(req, res) { //http://localhost:3000/bonus/get_campagins
    successLog.info('######### New get_campagins API CALL  #########');

    var ans={};
        try {
            ans = brain.getCampaignModelsList();
        }
        catch (err)
        {
            errorLog.error('Errors in brain.getCampaignModelsList() . Trace: '+ err.stack);
        }
        res.send(ans);
};

BonusHelper.add_campaign = function(req, res) { //http://localhost:3000/bonus/add_campaign

    var ans={};
    var campaign = req.body;
    successLog.info('######### New add_campaign API CALL with json: '+campaign+" #########");

    if (!isInt(campaign.id))
    {
        errorLog.error('Bad Request, id is not an integer: ' + campaign.id);
        res.send('This campaign id is not an integer');
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
};


BonusHelper.delete_campaign = function (req,res) {
    var ans={};
    var campaign_id = req.query.campaign_id; // $_GET["campaign_id"]
    if (!isInt(campaign_id))
    {
        errorLog.error('Bad Request, id is not an integer: ' + campaign_id);
        res.send('This campaign id is not an integer');
        return;
    }
    successLog.info('######### New delete_campaign API CALL for campaign_id: '+campaign_id+" #########");

    try {
        ans = bonusAPILogic.deleteCampaign(campaign_id);

    }
    catch (err)
    {
        errorLog.error('Errors in brain.deleteCampaign(campaign_id) . Trace: '+ err.stack);
    }
    res.send(ans);
}

BonusHelper.restart_campaign =  function (req,res) {
    var ans={};
    var campaign_id = req.query.campaign_id; // $_GET["campaign_id"]
    successLog.info('######### New restart_campaign API CALL for campaign_id: '+campaign_id+" #########");

    try {
        ans = bonusAPILogic.restartExistingCampaignThresholds(campaign_id);
    }
    catch (err)
    {
        errorLog.error('Errors in brain.getCampaignModelsList() . Trace: '+ err.stack);
    }
    res.send(ans);
}

BonusHelper.edit_campaign_name = function(req,res)
{
    var ans={};
    try
    {
        var campaign_id = req.query.campaign_id; // $_GET["campaign_id"]
        if (!isInt(campaign_id))
        {
            errorLog.error('Bad Request, id is not an integer: ' + campaign_id);
            res.send('This campaign id is not an integer');
            return;
        }
        var target_name = req.query.target_name; // $_GET["target_name"] - name souldn't be empty. it's doesn't make sense
        successLog.info('######### New edit_campaign_name API CALL with campaignId: '+campaign_id+' and name: '+target_name + ' #########');

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
}

BonusHelper.get_users_map = function(req,res)
{
    successLog.info('######### New get_users_map API CALL  #########');

    var ans={};
    try
    {
        ans = brain.getUsersMap();
        if(Object.keys(ans).length == 0 )
            ans = 'The users map is empty because there were no request /api/campaigns yet';
    }
    catch (err)
    {
        errorLog.error('Errors in brain.get_users_map() . Trace: '+ err.stack);
    }
    res.send(ans);
}


function isInt(value) {
    if (isNaN(value)) {
        return false;
    }
    var x = parseFloat(value);
    return (x | 0) === x;
}
module.exports = BonusHelper;