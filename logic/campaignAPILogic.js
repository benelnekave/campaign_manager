// For time zone:
var timeOptions = {
    timeZone: "Asia/Jerusalem",
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric'
};
var formatter = new Intl.DateTimeFormat([], timeOptions);


var totalCalls=0;
const errorLog = require('../util/logger').errorlog;
const successLog = require('../util/logger').successlog;
const debugLog = require('../util/logger').debuglog;
var dataLoader = require('../dataRepository/campaignDAO.js');

const CampaignModel = require('../models/campaignModel.js');

//Initing the dataLoader
dataLoader.init();
var dbinstance= dataLoader.get_db();

// Id2ThresholdsMap handling
var Id2ThresholdsMap = dataLoader.fillId2ThresholdsMapAndGet(dbinstance); //thresholds and name

var campaignModelsList = {};
campaignModelsInit();


var usersDetailsStatusMap = {}; // {user_id1 : {id1: max_per_User=,id2: ... },user_id2 : {id1: max_per_User}}
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
    var campaignModel ;

    var firstVisit = false;
    if(!usersDetailsStatusMap.hasOwnProperty(user_id)) {
        firstVisit = true;
        successLog.info('This is the first time user_id:'+user_id+ ' is calling this API');
        var usersMapFirstkey = Object.keys(usersDetailsStatusMap)[0];
        var mapOfPrevUser = usersDetailsStatusMap[usersMapFirstkey];
        usersDetailsStatusMap[user_id] = clone(Id2ThresholdsMap); // insert the campagin id2PerUserMap to usersDetailsStatusMap. we deep copy the object in order to avoid changing the data for future causes
        updateTotalCounterInUser(user_id,mapOfPrevUser);
    }

    var campaignMapAns = [];
    try {
        for (var i = 0; i < dbinstance.length; i++)
        {
            var singleCampaign = dbinstance[i];
            if(!campaignModelsList.hasOwnProperty(singleCampaign.id)) {
                campaignModel = new CampaignModel();
            }
            else
            {
                campaignModel = campaignModelsList[singleCampaign.id];
            }
            var maxPerUserApprove = false;
            var maxTotalApprove = false;
            if (usersDetailsStatusMap[user_id][singleCampaign.id].max_per_user != 'infinity') {
                usersDetailsStatusMap[user_id][singleCampaign.id].max_per_user--; //Here we update the  max_per_user. we always do that in order to give  campaignModel.num_of_per_user_reached_0 max 1 ans per user
                if (usersDetailsStatusMap[user_id][singleCampaign.id].max_per_user >= 0) {

                    debugLog.debug('usersDetailsStatusMap[user_id] new stat:' + JSON.stringify(usersDetailsStatusMap[user_id]));
                    maxPerUserApprove = true;
                }
                else
                {
                    if(usersDetailsStatusMap[user_id][singleCampaign.id].max_per_user == -1) {
                        campaignModel.num_of_per_user_reached_0 ++;
                    }
                }
            }
            else //don't worry about perUser Count
            {
                maxPerUserApprove = true;
            }

            if (usersDetailsStatusMap[user_id][singleCampaign.id].max_total !== 'infinity') {
                if (usersDetailsStatusMap[user_id][singleCampaign.id].max_total > 0) {
                    usersDetailsStatusMap[user_id][singleCampaign.id].max_total --;
                    maxTotalApprove = true;
                }
                else
                {
                    campaignModel.total_threshold_reached = true;
                }
            }
            else //don't worry about max_total Count
            {
                maxTotalApprove = true;
            }

            if (maxPerUserApprove && maxTotalApprove) {
                campaignMapAns.push(singleCampaign);
                campaignModel.campaignOriginalDetails=singleCampaign;
                updateAllTotalCounters(user_id);
                if(firstVisit)
                    campaignModel.num_of_users_got_it ++;


                campaignModel.last_date_this_campaign_returned = formatter.format(new Date());
                campaignModelsList[campaignModel.campaignOriginalDetails.id]=campaignModel;
            }

        }
    }
    catch (err)
    {
        errorLog.error('Error while iterating over the dbInstance. Trace: '+ err.stack);
    }
    return campaignMapAns;
};


function campaignModelsInit(){
    for (var i = 0; i < dbinstance.length; i++)
    {
        var campaignModel = new CampaignModel();
        campaignModel.usersDetailsStatusMap = dbinstance[i];
        campaignModelsList[dbinstance[i].id] = campaignModel;
    }
}



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

function updateTotalCounterInUser(user_id,prevUserDetailsMap) {
    if (totalCalls > 1)
    {
        for(var key in usersDetailsStatusMap[user_id]) {
            if (usersDetailsStatusMap[user_id].hasOwnProperty(key)) {

                usersDetailsStatusMap[user_id][key].max_total = prevUserDetailsMap[key].max_total;
            }
        }
    }
}

function updateAllTotalCounters(updatedUser_id)
{
    for(var userId in usersDetailsStatusMap) {
        if (usersDetailsStatusMap.hasOwnProperty(userId)) {
            for(var campaign_id in usersDetailsStatusMap[userId])
            {
                if (usersDetailsStatusMap[userId].hasOwnProperty(campaign_id)) {
                    usersDetailsStatusMap[userId][campaign_id].max_total = usersDetailsStatusMap[updatedUser_id][campaign_id].max_total;
                }
            }

        }
    }
}

Brain.getCampaignModelsList= function(){

    return campaignModelsList;
}


Brain.getUsersMap = function()
{
    return usersDetailsStatusMap;
}


Brain.getUpdatedDB = function()
{
    return dbinstance;
}

//var usersDetailsStatusMap = {}; // usersDetailsStatusMap[user_id][singleCampaign.id].max_total
module.exports = Brain;