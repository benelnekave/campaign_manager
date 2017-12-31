var express = require('express');
var router = express.Router();
var brain = require('../logic/brain.js');
var logger = require('../util/logger.js');
const errorLog = require('../util/logger').errorlog;
const successLog = require('../util/logger').successlog;
const debugLog = require('../util/logger').debuglog;



/**
 * Req should consist user_id only in the GET url. example: http://localhost:3000/api/campaigns?user_id=3
 */
router.get('/campaigns', function(req, res, next) {
    try {

        var user_id = req.query.user_id; // $_GET["user_id"]
        successLog.info('######### New API CALL for user_id: '+user_id+" #########");
        debugLog.debug('user_id '+ user_id + ' was just sent to /api/campaigns');
        if (isNaN(user_id)) {
            errorLog.error('Bad Request with, user_id is not numeric: ' + user_id);
            res.send('This user_id is not a number');
            return;
        }

        var ans = brain.handleSingleUser(user_id);
        // winston.log('Success Message and variables:' +ans);//'apiCall succedded with ans : ' + ans);
        successLog.info('Success Message and variables: '+JSON.stringify(ans));
        res.send(ans);

    }
    catch ( err)
    {
        errorLog.error('Something broke!: ' + err.stack);
        res.status(500).send('Something broke! Please contact this API manager');
    }

});



module.exports = router;
