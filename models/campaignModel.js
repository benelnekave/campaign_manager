/**
 * could be done with es6 style with class, by I decided to use to good old js typing because I wanted to try something new :)
 *
 example to ES6:
 class CampaignBonusModel{

 constructor(name){
    this.num_of_users_got_it = num_of_users_got_it ;
 }

 * @constructor
 */
function CampaignBonusModel(){

    this.num_of_users_got_it = 0;
    this.num_of_per_user_reached_0 = 0;
    this.total_threshold_reached = false;
    this.last_date_this_campaign_returned = '';
    this.campaignOriginalDetails ={};
}
CampaignBonusModel.prototype = {
    getNum_of_users_got_it: function(){
        return this.num_of_users_got_it;
    },
    getNum_of_per_user_reached_0: function(){
        return this.num_of_per_user_reached_0;
    },
    getTotal_threshold_reached: function(){
        return this.total_threshold_reached;
    },
    getLast_date_this_campaign_returned: function(){
        return this.last_date_this_campaign_returned;
    },
    getCampaignDetails:function() {
        return this.campaignOriginalDetails;
    }

};

module.exports = CampaignBonusModel;