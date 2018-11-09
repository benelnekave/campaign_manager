var express = require('express');
var router = express.Router();
var brain = require('../logic/campaignAPILogic.js');
const errorLog = require('../util/logger').errorlog;
const successLog = require('../util/logger').successlog;
const debugLog = require('../util/logger').debuglog;



/**
 *  Req should consider user_id param in the GET url. example: http://localhost:3000/api/campaigns?user_id=3
 *  This is the api was asked as the API ​URL.
    It was well explained in the pdf file.
 */
router.get('/campaigns', function(req, res) {
    try {
//for snir
        var user_id = req.query.user_id; // $_GET["user_id"]
        successLog.info('######### New campaings API CALL for user_id: '+user_id+" #########");
        debugLog.debug('user_id '+ user_id + ' was just sent to /api/campaigns');
        if (!isInt(user_id)) {
            errorLog.error('Bad Request, user_id is not an integer: ' + user_id);
            res.send('This user_id is not an integer');
            return;
        }

        var ans = brain.handleSingleUser(user_id);
        successLog.info('Success Message and variables: '+JSON.stringify(ans));
        res.send(ans);

    }
    catch ( err)
    {
        errorLog.error('Something broke!: ' + err.stack);
        res.status(500).send('Something broke! Please contact this API manager');
    }

});

//I know that's the second time I wrote this code but it is very short
function isInt(value) {
    if (isNaN(value)) {
        return false;
    }
    var x = parseFloat(value);
    return (x | 0) === x;
}

module.exports = router;
