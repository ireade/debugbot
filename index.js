var Botkit = require("botkit");

var token = process.env.SLACK_TOKEN
if (!token) {
  console.error('SLACK_TOKEN is required!')
  process.exit(1)
}

var controller = Botkit.slackbot({
  debug: false
});

controller.spawn({
  token: token
}).startRTM(function(err,bot,payload) {
  if (err) {
    throw new Error(err);
  }
});












/* **********************

 BUG REPORT FUNCTIONS

********************** */

var bugReport_introduction = function(bot, message, convo) {

  convo.ask("Have you got a bug to report? Say `yes` if you have.",function(response,convo) {

    if ( response.text.indexOf('yes') > -1 | response.text.indexOf('Yes') > -1 ) {

      convo.sayFirst("Okay, let's get started!");
      convo.next();

    } else {

      bot.reply(message, "Okay, bye! :wave:")
      convo.stop();
    }

  });

}



/* **********************
 BUG REPORT FUNCTIONS - STEP ONE
********************** */
var bugReport_stepOne = function(bot, message, convo) {

  var question = "First of all, is the site down? Say `yes` if it is.";
  convo.ask(question,function(response,convo) {

    if ( response.text.indexOf('yes') > -1 | response.text.indexOf('Yes') > -1 ) {
      bugReport_stepOne_handleSiteDown(bot, response);
      convo.stop();

    } else {

      bot.reply(message, "Phew!");
      convo.next();
    }

  });
}
var bugReport_stepOne_handleSiteDown = function(bot, message) {
  bot.startConversation(message,function(err,convo) {

    var question = "Ok. Can you go to this site http://www.downforeveryoneorjustme.com/ and check if the site is down for everyone or just you? Say `yes` if it's down for everyone.";

    convo.ask(question,function(response,convo) {

      if ( response.text.indexOf('yes') > -1 | response.text.indexOf('Yes') > -1 ) {

        bot.reply(message, "Okay. I will let Ire know about this. In the mean time, please drop a screenshot of what you see when you go to the site."); 

      } else {
        bot.reply(message, "Phew! Looks like you'll just have to wait it out then. Let me know if you have anything else to report.");
      }

      convo.stop();

    });

  
  })
}







/* **********************
 BUG REPORT FUNCTIONS - STEP TWO
********************** */
var bugReport_stepTwo = function(bot, message, convo) {

  var question = "So is the problem you're experiencing to do with the frontend of the site, or Wordpress?";

  convo.ask(question,function(response, convo) {
      convo.sayFirst("Okay.");
      convo.next();
  });

}



/* **********************
 BUG REPORT FUNCTIONS - STEP THREE
********************** */
var bugReport_stepThree = function(bot, message, convo) {

  var question = "Next, in one or two sentences can you describe the problem you're having? For example, _The quiz results aren't showing properly_";

  convo.ask(question,function(response, convo) {
      convo.next();
  });

}

/* **********************
 BUG REPORT FUNCTIONS - STEP FOUR
********************** */
var bugReport_stepFour = function(bot, message, convo) {

  var question = "Okay. What was the behaviour you expected to happen? For example, _The title of the result is supposed to display the personality the user got_";

  convo.ask(question,function(response, convo) {
    convo.next();
  });

}


/* **********************
 BUG REPORT FUNCTIONS - STEP FIVE
********************** */
var bugReport_stepFive = function(bot, message, convo) {

  var question = "And what actually happened? For example, _When results are displaying like %%personality%% instead of the actual result_";

  convo.ask(question,function(response, convo) {
    convo.next();
  });

}

/* **********************
 BUG REPORT FUNCTIONS - STEP SIX
********************** */
var bugReport_stepSix = function(bot, message, convo) {

  var question = "Have you been able to replicate this problem? i.e. is anyone else experiencing this besides you? Say `yes` if someone else has also seen this problem.";

  convo.ask(question,function(response, convo) {
    if ( !(response.text.indexOf('yes') > -1 | response.text.indexOf('Yes') > -1) ) {
  
      convo.sayFirst("Okay. Try checking with someone else if they have experienced the problem.");
    }

    convo.next();
  });

}


/* **********************
 BUG REPORT FUNCTIONS - STEP SEVEN
********************** */
var bugReport_stepSeven = function(bot, message, convo) {

  var question = "Next, can you drop some screenshots showing the problem you're having? When you're done, say `finished`";

  convo.ask(question,function(response, convo) {
    
      if ( response.text.indexOf('finished') > -1 | response.text.indexOf('Finished') > -1 ) {

        convo.sayFirst("Thank you.");
        convo.next();

      } 

  });

}



/* **********************
 BUG REPORT FUNCTIONS - STEP EIGHT
********************** */
var bugReport_stepEight = function(bot, message, convo) {

  convo.ask("Okay a few final housekeeping questions. First, what browser are you using?",function(response, convo) {
      convo.next();
  });

  convo.ask("Are you currently experiencing any internet connection troubles?",function(response, convo) {
      convo.next();
  });

}




/* **********************
 BUG REPORT FUNCTIONS - CLOSING
********************** */
var bugReport_closing = function(bot, message, convo) {
  convo.ask("Okay we're done! I will let Ire know about the issues you're having and she'll get back to you soon. :wave::skin-tone-6: ",function(response, convo) {
      convo.stop();
  });
}







/* **********************

  CONTROLLER LISTENERS

********************** */

var urgentBug = false;


controller.on("direct_mention", function(bot, message) {

  var intro = "Hi there! I'm here to help with bugs. I'll ask you a series of questions, and all you have to do is respond.";

  bot.reply(message, intro);

  bot.startConversation(message,function(err,convo) {

    bugReport_introduction(bot, message, convo);

    bugReport_stepOne(bot, message, convo);

    bugReport_stepTwo(bot, message, convo);

    bugReport_stepThree(bot, message, convo);

    bugReport_stepFour(bot, message, convo);

    bugReport_stepFive(bot, message, convo);

    bugReport_stepSix(bot, message, convo);

    bugReport_stepSeven(bot, message, convo);

    bugReport_stepEight(bot, message, convo);

    bugReport_closing(bot, message, convo);



  })
    
});







controller.on("user_channel_join", function(bot, message) {
  var reply = "Welcome <@"+message.user+">! If you're experiencing any bugs no the site, I'm the one to talk to. Just @ me to start a conversation.";
  bot.reply(message, reply);
})

controller.on("user_group_join", function(bot, message) {
  var reply = "Welcome <@"+message.user+">! If you're experiencing any bugs no the site, I'm the one to talk to. Just @ me to start a conversation.";
  bot.reply(message, reply);
})