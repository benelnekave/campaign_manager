var tap = require('tap');
var brain = require('../logic/campaignAPILogic');
var http = require('http');
var request = require('request');
var bonusAPILogic = require('../logic/bonusAPILogic.js');
// ******* INTEGRATION TESTS *******
// BASED ON campaigns.json which came with this poject

// thought about using node-rest-client but it was time consuming to change all the tests


var postData = {
    "id":105,
    "name":"Benz new campaign",
    "thresholds": {

        "max_per_user": 3
    },
    "data":{}
};
bonusAPILogic.addCampaign(postData);
tap.equal(brain.getCampaignModelsList().hasOwnProperty("105"), true);
tap.equal(Object.keys(brain.getCampaignModelsList()).length, 4);

bonusAPILogic.edit_campaign_name(101,'BenzCampaign');
console.log('brain.getCampaignModelsList()[101].campaignOriginalDetails.name = :'+brain.getCampaignModelsList()[101].campaignOriginalDetails.name);
tap.equal(brain.getCampaignModelsList()[101].campaignOriginalDetails.name,'BenzCampaign');

bonusAPILogic.deleteCampaign(105);
tap.equal(brain.getCampaignModelsList().hasOwnProperty("105"), false);


/*

// **************  ADD CAMPAIGN  **************

var addCampaignRes = '';
var clientServerOptions = {
    uri: add_campaignUrl,
    body: JSON.stringify(postData),
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
}
var numOfExistingCampaigns;
request(clientServerOptions, function (error, response) {
    numOfExistingCampaigns = brain.getUpdatedDB().length;
    console.log('POST response:');
    console.log(error,response.body);
    addCampaignRes= response.body;
    console.log('Here is the brain.getCampaignModelsList(): '+brain.getCampaignModelsList());
    tap.equal(brain.getCampaignModelsList().hasOwnProperty("105"), true);
});


 // check if it was successfully added
//tap.equal(JSON.parse(addCampaignRes).explanation,'Campaign (105) was successfully added');

http.get(get_campaginsUrl, function(res){
    var body = '';

    res.on('data', function(chunk){
        body += chunk;
    });

    res.on('end', function(){
        get_campaginsResult = JSON.parse(body);
        console.log("Got a response: ", get_campaginsResult);
        tap.equal(Object.keys(get_campaginsResult).length, numOfExistingCampaigns+1);
    });
}).on('error', function(e){
    console.log("Got an error: ", e);
});

*/


/*
const get_campaginsUrl = 'http://localhost:3000/bonus/get_campagins'; //curl -X GET 'http://localhost:3000/bonus/get_campagins'
var get_campaginsResult = '';



var add_campaignUrl = 'http://localhost:3000/bonus/add_campaign'; //POST

*/
