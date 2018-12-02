
This project was programmed with Express-Node.js web application framework.
Please follow the instractions:
1. 	In cmd-windows/bash-linux shell navigate to campaign_manager folder you downloaded from github.
2. 	Make sure you have installed: 
	express, 
	npm, 
	tap, 
	winston, 
	body-parser,
	npm i request
	.
3. 	Make sure that campaigns.json is found under dataRepository folder and field with the well known 
	stracture explained in the pdf.
	I didn't check json's validity nor 'unwanted' fields because this file is basiclly instead of a db,
	which I assumed has correct json fields.
	Used a lot of try catch though to deal with all kinds of errors and keep the app running.
4. 	On MacOS or Linux, run the app with this command from the root directory:
	$ DEBUG=myapp:* npm start
	
	On Windows, use this command:
	set DEBUG=myapp:* & npm start
5. 	To use tap testing go the the root directory and write: 
	use npm test -- --cov                                    for lineCoverage
 	use npm test -- --cov --coverage-report=lcov             for line Coverage and lcov files creation = very cool
	API testing are intefration rests which check all of the api.
	** ALL of the tests are based on the file was givven in this github repo link. campaign.json
8. 	Enjoy the APIs

APIs:
	will be called with url:											http://localhost:3000/
								if you are interested in changing it, please do it in the www file in bin folder
	main:
	/api/campaigns?user_id=123 :										http://localhost:3000/api/campaigns?user_id=2
	GET
							This is the api was asked as the API ​URL.
							It was well explained in the pdf file.
				
				
	bonus:
	* All of the getters (APIs) return a json.
	
	/bonus/get_users_map :												http://localhost:3000/bonus/get_users_map
	GET
							This request returns the updated status of each user and his thresholds.
				
				
	/bonus/edit_campaign_name?campaign_id=123&target_name=moses :		http://localhost:3000/bonus/edit_campaign_name?campaign_id=123&target_name=benz
	GET
							With this request you can edit campaign_id=123 and set it's target_name to moses
	
	
	/bonus/restart_campaign?campaign_id=123 :							http://localhost:3000/bonus/restart_campaign?campaign_id=2
	GET
							With this requst you can restart campaign_id=123 thresholds
							You can check the effect with get_users_map
							
							
	/bonus/delete_campaign?campaign_id=123								http://localhost:3000/bonus/delete_campaign?campaign_id=11
	GET
							Simply as it sounds
	
	
	/bonus/get_campagins 												http://localhost:3000/bonus/get_campagins
	GET			
							This request will return the campaignModelList which holds some back office
							information on each campaign:
							num_of_users_got_it
							num_of_per_user_reached_0
							total_threshold_reached
							last_date_this_campaign_returned
							campaignOriginalDetails
							
							
	/bonus/add_campaign : 												http://localhost:3000/bonus/add_campaign
	POST	
		json with the well known stracture should be in the req.body
		id should be an integer as requested in the spec (double will return an error msg).
		Headers:
			Content-Type : application/json
	
		
	
	
Important notes:
* I have some 'should do's with good explanations.
1. 	I wanted to experience both json stracture and Class stracture implementation of an object.
	Naturally I would have created an objects which holds a db row coulumns as fields and populate it in the DAO.
	I didn't know what is the node.js best practice for this kind of programming, json is already stractured like an object.
	So I used the db object as a json all along the way.
	In order to expirence some Class as I'm used to from other languages, I created the campaignClass with a prototype.
	campaignClass is in the bonus part.
2. 	I used tap for testing. it's very cool and give you a lot of 'out of the box' features like test coverage
3.	I used winston for logging.

	
	
	I tested the api with post-man which is equvilent to curl. curl -X GET 'http://localhost:3000/
	
	I hope this document is not overwhelming.
	To best understand the objects stracture, I prepared an objects examples and created a UML.


	
