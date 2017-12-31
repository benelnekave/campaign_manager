var totalCalls=0;
const errorLog = require('../util/logger').errorlog;
const successLog = require('../util/logger').successlog;
const debugLog = require('../util/logger').debuglog;

//Initing the dataLoader
var dataLoader = require('../dataRepository/campaignDAO.js');
dataLoader.init();


var dbinstance= dataLoader.get_db();
var Id2ThresholdsMap = dataLoader.getId2ThresholdsMap();
var usersMap = {}; // {user_id1 : {id1: max_per_User=,id2: ... },user_id2 : {id1: max_per_User}}

// empty constractor
function Brain(){}


/**
 *
 * @param user_id
 * @returns {Array} - The answer to the API request
 */
Brain.handleSingleUser=function(user_id){
    successLog.info('About to handle user_id: '+user_id);
    totalCalls ++;
    successLog.info('NUM OF TOTAL CALLS : '+ totalCalls);
    if(!usersMap.hasOwnProperty(user_id)) {
        successLog.info('This is the first time user_id:'+user_id+ ' is calling this API');
        usersMap[user_id] = clone(Id2ThresholdsMap); // insert the campagin id2PerUserMap to usersMap. we deep copy the object in order to avoid changing the data for future causes
    }

    var campaignMapAns = [];
    try {
        for (var i = 0; i < dbinstance.length; i++) {
            var maxPerUserApprove = false;
            var maxTotalApprove = false;
            var singleCampaign = dbinstance[i];
            if (usersMap[user_id][singleCampaign.id].max_per_user != 'infinity') {
                if (usersMap[user_id][singleCampaign.id].max_per_user > 0) {
                    usersMap[user_id][singleCampaign.id].max_per_user--; //Here we update the
                    debugLog.debug('usersMap[user_id] new stat:' + JSON.stringify(usersMap[user_id]));
                    maxPerUserApprove = true;
                }
            }
            else //don't worry about perUser Count
            {
                maxPerUserApprove = true;
            }

            if (Id2ThresholdsMap[singleCampaign.id].max_total !== 'infinity') {
                if (Id2ThresholdsMap[singleCampaign.id].max_total >= totalCalls) {
                    maxTotalApprove = true;
                }
            }
            else //don't worry about max_total Count
            {
                maxTotalApprove = true;
            }

            if (maxPerUserApprove && maxTotalApprove)
                campaignMapAns.push(singleCampaign);

        }
    }
    catch (err)
    {
        errorLog.error('Error while iterating over the db. Trace: '+ err.stack);
    }

    return campaignMapAns;
};


// In order to deep copy a json array
function clone(arr) {
    try {
        debugLog.debug('About to clone :' + arr);
        return JSON.parse(JSON.stringify(arr));
    }
    catch (err)
    {
        errorLog.error('Error while cloning. trace: '+err.stack);
    }
}

module.exports = Brain;