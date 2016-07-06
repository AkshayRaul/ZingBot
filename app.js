var Botkit = require('botkit');
//var os = require('os');
var unirest = require('unirest');

var express = require('express');
var app     = express();

app.set('port', (process.env.PORT || 5000));

//For avoidong Heroku $PORT error
app.get('/', function(request, response) {
    var result = 'App is running'
    response.send(result);
}).listen(app.get('port'), function() {
    console.log('App is running, server is listening on port ', app.get('port'));
});
var controller = Botkit.slackbot({
    debug: true
});

var bot = controller.spawn({
//Enter your bot token /api key from slack and paste it in the quotes
    token: ''
}).startRTM();

controller.hears(['Hi Zing','Zing','Hey','Wassup','Hello','Whats Up','help'],'direct_message,direct_mention,mention',function (bot,message) {
     
      bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: 'robot_face',
    }, function(err, res) {
        if (err) {
            bot.botkit.log('Failed to add emoji reaction :(', err);
        }
    });
    controller.storage.users.get(message.user, function(err, user) {
        if (user && user.name) {
            bot.reply(message, 'Hello ' + user.name + '!!'+"\nI am Zing!Your Stock Assitant!To get Stock Listings type:'Stock'or'Search by stock'or'Get me stock names'or'What are the stocks'or'Stock listings'");
            bot.reply(message,"To search a stock enter Scode,just type :Scode or get Scode or Search by Scode");
        } else {
        //another way to reply,commented for now
         //   bot.reply(message, 'Hello.What is your name?');
           /* controller.hears(['call me (.*)', 'my name is (.*)','(.*)'], 'direct_message,direct_mention,mention', function(bot, message) {
    var name = message.match[1];
    controller.storage.users.get(message.user, function(err, user) {
        if (!user) {
            user = {
                id: message.user,
            };
        }
        user.name = name;
        controller.storage.users.save(user, function(err, id) {
            bot.reply(message, 'Got it. I will call you ' + user.name + ' from now on.');
        });
    });
    convo.stop();
    
});*/ 
  bot.startConversation(message,function(err,convo) {
      convo.ask('Hello!What is your name?',function (response,convo) {
         var name = response.text;

     if (!user) {
            user = {
                id: response.user,
            };
        }
        user.name = name;
        controller.storage.users.save(user, function(err, id) {
            bot.reply(message, 'Got it. I will call you ' + user.name + ' from now on.');
        });
    convo.stop();

});
  });
        }
    });
    
});

controller.hears(['call me (.*)', 'my name is (.*)'], 'direct_message,direct_mention,mention', function(bot, message) {
    var name = message.match[1];
    controller.storage.users.get(message.user, function(err, user) {
        if (!user) {
            user = {
                id: message.user,
            };
        }
        user.name = name;
        controller.storage.users.save(user, function(err, id) {
            bot.reply(message, 'Got it. I will call you ' + user.name + ' from now on.');
        });
    });
});/*
controller.hears(['(.*)'], 'direct_message,direct_mention,mention', function(bot, message) {
    var name = message.match[1];
    bot.reply(message,"Sorry ,I Did not understand!Type help for assistance!");
});*/
controller.hears(['Stock','Search by stock','Get me stock names','What are the stocks','Stock listings'], 'direct_message,direct_mention,mention', function(bot,message) {

  // start a conversation to handle this response.
  bot.startConversation(message,function(err,convo) {

    convo.say('Hello!');
   convo.ask('Enter stock name?',function (response,convo) {
var r=[response.text];
if(response.text=="stop"||response.text=="NeverMind"||response.text=="OK"||response.text=="End")
{
    convo.stop();
}
console.log(r);

//go to https://market.mashape.com/nviror/mutual-funds-nav-india ,register urself and get ur X-Mashape-Key and enter in the header with key name "X-Mashape-Key"
 unirest.post("https://mutualfundsnav.p.mashape.com/")
                                .header("X-Mashape-Key", "Your key here")
                                .header("Content-Type", "application/json")
                                .header("Accept", "application/json")
                                .send({"search":response.text})
                                .end(function (result) {
                                console.log(result.status, result.headers, result.body);
                                print(result.body);
});

 convo.stop();
   });
   
 function print(body){
     if(body==null||body==""||body==0){
         bot.reply(message,"Stock not found :sad_smiley:");
     }else if(body== 'Sorry! We can\'t process your request.\n')
     {
         bot.reply(message,'Sorry! We can\'t process your request at the moment');
    }
     else if(body.error)
                        {console.log("Error Stock");
                            bot.reply(message,"I am having trouble in retreiving stock...try again");
                        }else{
for(var i=0;i<body.length;i++){
   bot.reply(message,"SCode:"+body[i][0]+" "+body[i][1]+" "+body[i][2]);
    bot.reply(message,body[i][3]); 
  //  bot.reply(message,"hey");
    console.log("SCode:"+body[i][0]+" "+body[i][1]+" "+body[i][2]);
    console.log(body[i][3]); 
 }}
  }
   
 

});
});
controller.hears(['Search Scode','Scode','Search by Scode'], 'direct_message,direct_mention,mention', function(bot,message) {

  // start a conversation to handle this response.
  bot.startConversation(message,function(err,convo) {

    convo.say('Hello!');
   convo.ask('Enter Scode?',function (response,convo) {
var r=[response.text];
if(response.text=="stop"||response.text=="NeverMind"||response.text=="OK"||response.text=="End")
{
    convo.stop();
}

console.log(r);
 unirest.post("https://mutualfundsnav.p.mashape.com/")
                                   .header("X-Mashape-Key", "Your mashape key here")
                                    .header("Content-Type", "application/json")
                                    .header("Accept", "application/json")
                                    .send({"scodes":[response.text]})
                                    .end(function (result) {
                                    console.log(result.status, result.headers, result.body);
                                    printsc(result.body,response.text);
});

 convo.stop();
   });
   
 
   function printsc(body,resp){
                        var rs=resp;
                        console.log(body);
                       
                        if(body==null||body==""||body==0){
                            bot.reply(message,"Stock not found !");
                        }else if( body== 'Sorry! We can\'t process your request.\n')
                        {
                            bot.reply(message,'Sorry! We can\'t process your request.');
                        }
                        else if(body.error)
                        {
                            console.log("Error Scode");
                            bot.reply(message,"Trouble in retreiving stock...try again");
                        }
                        else{
                    //  var obj=JSON.parse(body);   
                    var keys = Object.keys( body );
                  //  console.log(body.keys[0].fund);
                for(var x in body)
                {
                    bot.reply(message,"Scode:"+x+"\nFund:"+body[x].fund+"\nDate:"+body[x].date+"\nNAV:"+body[x].nav+"\nChange Value"+body[x].change.value+"\tChange Percentage"+body[x].change.percent+"\nRepurchase Value:"+body[x].repurchase+"\nCategory:"+body[x].category+"\nFund type:"+body[x].fund_type+"\nAMC:"+body[x].amc);
                     console.log(message,"Scode:"+x+"\n"+body[x].fund+"\n"+body[x].date+"\n"+body[x].nav+"\n"+body[x].change.value+"\n"+body[x].change.value.percent+"\n"+body[x].repurchase+"\n"+body[x].category+"\n"+body[x].fund_type+"\n"+body[x].amc);
                }
                
            }
                                    }
  });
 

});

/* Method to ask explicitly for Scode or Stock.Doesnt work ,takes useless 1st 3 strings before asking
controller.hears(['Search stock'], 'direct_message,direct_mention,mention', function(bot, message) {

    controller.storage.users.get(message.user, function(err, user) {
        if (user && user.name) {
            bot.reply(message, 'Your name is ' + user.name);
        } else {
            bot.startConversation(message, function(err, convo) {
                if (!err) {
           //         convo.say('I do not know your name yet!');
                    convo.ask('What do you want to search by :SCode or Stock?', function(response, convo) {
                     convo.ask('', [
                            {
                                pattern: 'Stock',
                                callback: function(response, convo) {
                                    // since no further messages are queued after this,
                                    // the conversation will end naturally with status == 'completed'
                                convo.say("Stock");
                                convo.ask('Enter Stock name?', function(response, convo) {
                                unirest.post("https://mutualfundsnav.p.mashape.com/")
                                .header("X-Mashape-Key", "your key here")
                                .header("Content-Type", "application/json")
                                .header("Accept", "application/json")
                                .send({"search":response.text})
                                .end(function (result) {
                                console.log(result.status, result.headers, result.body);
                                print(result.body);
                                    });
                                    convo.stop();
                                });
                                    
                                }
                            },
                            {
                                pattern: 'Scode',
                                callback: function(response, convo) {
                                    // stop the conversation. this will cause it to end with status == 'stopped'
                                convo.say("Scode");
                                convo.ask('Enter Stock name?', function(response, convo) {
                                    unirest.post("https://mutualfundsnav.p.mashape.com/")
                                    .header("X-Mashape-Key", "your key here")
                                    .header("Content-Type", "application/json")
                                    .header("Accept", "application/json")
                                    .send({"scodes":response.text})
                                    .end(function (result) {
                                    console.log(result.status, result.headers, result.body);
                                    printsc(result.body,response.text);
                                    });

                                    convo.stop();                                    
                    });
                                   
                                }
                            },
                            {
                                default: true,
                                callback: function(response, convo) {
                                    convo.repeat();
                                    convo.next();
                                }
                            }
                        ]);

                     

                                    function print(body){
                                        if(body==null||body==""||body==0){
                                            bot.reply(message,"Stock not found :sad_face:");
                                        }else{
                                    for(var i=0;i<body.length;i++){
                                    bot.reply(message,"SCode:"+body[i][0]+" "+body[i][1]+" "+body[i][2]);
                                        bot.reply(message,body[i][3]); 
                                    //  bot.reply(message,"hey");
                                        console.log("SCode:"+body[i][0]+" "+body[i][1]+" "+body[i][2]);
                                        console.log(body[i][3]); 
                                    }}
                                    }
                                   function printsc(body,resp){
                        var rs=resp;
                        console.log(body);
                        console.log("sdadasdsadsadsdsadsaddssaassssa");
                        if(body==null||body==""||body0){
                            bot.reply(message,"Stock not found :sad_face:");
                        }else{
                    //  var obj=JSON.parse(body);
                    var keys = Object.keys( body );
                  //  console.log(body.keys[0].fund);
                for(var x in body)
                {
                    bot.reply(message,"Scode:"+x+"\nFund:"+body[x].fund+"\nDate:"+body[x].date+"\nNAV:"+body[x].nav+"\nChange Value"+body[x].change.value+"\tChange Percentage"+body[x].change.percent+"\nRepurchase Value:"+body[x].repurchase+"\nCategory:"+body[x].category+"\nFund type:"+body[x].fund_type+"\nAMC:"+body[x].amc);
                     console.log(message,"Scode:"+x+"\n"+body[x].fund+"\n"+body[x].date+"\n"+body[x].nav+"\n"+body[x].change.value+"\n"+body[x].change.value.percent+"\n"+body[x].repurchase+"\n"+body[x].category+"\n"+body[x].fund_type+"\n"+body[x].amc);
                }
                
            }
                                    }
                        convo.next();

                    });
                }
            });
        }
    });
});
*/
