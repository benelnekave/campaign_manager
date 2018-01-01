const errorLog = require('../util/logger').errorlog;
const successLog = require('../util/logger').successlog;
const debugLog = require('../util/logger').debuglog;
var brain = require('./campaignAPILogic.js');
var dataLoader = require('../dataRepository/campaignDAO.js');
const CampaignModel = require('../models/campaignModel.js');


var usersDetailsStatusMap = brain.getUsersMap();
var campaignModelsList = brain.getCampaignModelsList();
var dbinstance= brain.getUpdatedDB()

// Id2ThresholdsMap handling
var Id2ThresholdsMap = dataLoader.fillId2ThresholdsMapAndGet(dbinstance);

// empty constractor
function BonusAPILogic(){}

/**
 * #############################    Extra ​ ​Points       #############################
 * #############################    Extra ​ ​Points       #############################
 * These functions are usually implemented in the DAO but we have an in-memmory DAO and I thought it's a good practice NOT to harm the db. only this api is using this functionality for now
 *
 */
BonusAPILogic.restartExistingCampaignThresholds = function(campaignId)
{
    var msg = 'Sorry, this campain id ('+campaignId +') doesnt exists';
    var restarted=false;
    for(var key in usersDetailsStatusMap)
    {
        if( usersDetailsStatusMap.hasOwnProperty(key) ) {
            var singleUserDetails = usersDetailsStatusMap[key];
            if(singleUserDetails.hasOwnProperty(campaignId)){
                singleUserDetails[campaignId].max_per_user = Id2ThresholdsMap[campaignId].max_per_user;
                singleUserDetails[campaignId].max_total = Id2ThresholdsMap[campaignId].max_total;
                campaignModelsList[campaignId].total_threshold_reached = false;
                msg = 'Campain ('+campaignId +') has been restarted its thresholds for user:'+ key;
                successLog.debug(msg);
                restarted = true;
            }

        }
    }
    if(restarted)
    {
        msg = 'Campain ('+campaignId +') has been restarted its thresholds for all users';
        successLog.info(msg);
        return msg;
    }

    successLog.warn(msg);
    return msg;
}



BonusAPILogic.addCampaign = function(campaign)
{
    var msg = 'Sorry, this campain id ('+campaign.id +') already exists';
   for(var i ; i< dbinstance.length;i++)
   {
       if(dbinstance[i].id == campaign.id) {
            successLog.warn(msg);
           return msg;
       }
   }
    dbinstance.push(campaign);
    Id2ThresholdsMap = dataLoader.fillId2ThresholdsMapAndGet(dbinstance);
    var campaignModel = new CampaignModel();
    campaignModel.campaignOriginalDetails = campaign;
    campaignModelsList[campaign.id] = campaignModel;
    msg = 'Campaign ('+campaign.id +') was successfully added';
    successLog.info(msg);
    return msg;
}

BonusAPILogic.deleteCampaign = function(campaignId)
{
    var deleted=true;
    var msg='CampaignId '+campaignId+' was not found and there for, not deleted!';
    for(var i=0; i<dbinstance.length; i++)
    {
        if(dbinstance[i].id == campaignId)
        {
            dbinstance.splice(i,1); //delete from attay
            // delete from usersDetailsStatusMap is needed as well
            delete campaignModelsList[campaignId];
            for(var i; i<usersDetailsStatusMap.length;i++)
            {
                var singleUserDetails = usersDetailsStatusMap[i];
                if(singleUserDetails.hasOwnProperty(campaignId)) {
                    delete singleUserDetails[campaignId];
                    deleted=true;
                }
            }
        }
    }
    if(deleted) {
        msg = 'CampaignId '+campaignId+' has been deleted succefully!';
        successLog.info(msg);
        return msg;
    }
    successLog.warn(msg);
    return msg;

}

/**
 * basically, I designed it to deal with any change in the campaign property with updatedCampaignInListAndUsersList
 * @param campaignId
 * @param targetName
 */

BonusAPILogic.edit_campaign_name = function(campaignId,targetName)
{
    var msg = 'Sorry, this campain id ('+campaignId +') doesnt exist';
    var exist = false;
    for(var i=0; i<dbinstance.length; i++)
    {
        if(dbinstance[i].id == campaignId)
        {
            dbinstance[i].name = targetName;
            Id2ThresholdsMap = dataLoader.fillId2ThresholdsMapAndGet(dbinstance);
            exist = true;
        }
    }
    if(exist){
        updatedCampaignInListAndUsersList('name',targetName,campaignId);
        msg = 'Campagin ('+campaignId +') was successfully updated with name: '+ targetName;
        successLog.info(msg );
        return msg;
    }

    successLog.warn(msg);
    return msg;

}

function updatedCampaignInListAndUsersList(fieldName,value,campaignId)
{
    for(var key in usersDetailsStatusMap) {
        if (usersDetailsStatusMap.hasOwnProperty(key)) {

            usersDetailsStatusMap[key][campaignId][fieldName]=value;
        }
    }
    campaignModelsList[campaignId].campaignOriginalDetails[fieldName]=value;
}

module.exports = BonusAPILogic;