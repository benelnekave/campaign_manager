const errorLog = require('../util/logger').errorlog;
const successLog = require('../util/logger').successlog;
const debugLog = require('../util/logger').debuglog;

var id2ThresholdsMap={};
var db = {};

function CampaignDAO(){} //empty constractor

/**
 * Loads the campaigns.json into db variable
 */
CampaignDAO.init = function() {
    try {
        var fs = require('fs');
        var path = require('path');
        db = JSON.parse(fs.readFileSync('dataRepository/campaigns.json', 'utf8'));
        successLog.info('The db instance from campaigns.json is :'+ JSON.stringify(db));
        fillId2ThresholdsMap();
    }
    catch( err) {
        errorLog.error('Bad file reading in campaignDAO. trace: '+err.stack);
    }
}

/**
 * Fills id2ThresholdsMap with key: campaign id. value: Thresholds.
 * If one of the thresholds doesn't exist, we put 'infinity' in it's value.
 *
 */
function fillId2ThresholdsMap() {
    try {
        for (var i = 0; i < db.length; i++) {
            var singleCampaign = db[i];

            id2ThresholdsMap[singleCampaign.id] = {};
            if (singleCampaign.thresholds.hasOwnProperty('max_per_user')) {
                id2ThresholdsMap[singleCampaign.id].max_per_user = singleCampaign.thresholds.max_per_user;
            }
            else {
                id2ThresholdsMap[singleCampaign.id].max_per_user = 'infinity';
            }
            if (singleCampaign.thresholds.hasOwnProperty('max_total')) {
                id2ThresholdsMap[singleCampaign.id].max_total = singleCampaign.thresholds.max_total;
            }
            else {
                id2ThresholdsMap[singleCampaign.id].max_total = 'infinity';
            }
        }
        debugLog.debug('id2ThresholdsMap: ' + id2ThresholdsMap);
    }
    catch (err)
    {
        errorLog.error('Error while trying to fill Id2ThresholdsMap. trace:'+err.stack);
    }
}


CampaignDAO.get_db = function()
{
    return db;
}


CampaignDAO.getId2ThresholdsMap=function()
{
    return id2ThresholdsMap;
}



module.exports = CampaignDAO;