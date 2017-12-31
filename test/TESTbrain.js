
// use npm test -- --cov                                    for lineCoverage
// use npm test -- --cov --coverage-report=lcov             for line Coverage details


var tap = require('tap');
var brain = require('../logic/brain');

// ############# Test handleSingleUser ############
for( var i = 0; i<4;i++)
{

    var returnAns = brain.handleSingleUser(1);
}

tap.equal(returnAns.length ,2); //check per user : should be 2


for( var i = 0; i<4;i++)
{

    var returnAns = brain.handleSingleUser(2); //check total. should be 1
}
tap.equal(returnAns.length ,1);


for( var i = 0; i<11;i++)
{

    var returnAns = brain.handleSingleUser(3); //check total should be 0
}
tap.equal(returnAns.length ,0);




