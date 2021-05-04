
const Express = require('express')
const Aws = require('./aws-config')
const sns = new Aws.SNS()


// create topic 
const createTopic = (name) => {
    var createTopicPromise = sns.createTopic({Name: name}).promise()
    createTopicPromise.then((data)=>{

    })
}
      

// subscribe the topic and after that aws sent a POST confirmation request to the Endpoint
const subscribeTopic=()=>{
    var params = {
        Protocol: 'HTTPS', /* required */
        TopicArn: 'arn:aws:sns:ap-south-1:631170167195:Tft-tech', /* required */
        Endpoint: 'https://608bc12bd74071000769674b--vibrant-mahavira-bbae16.netlify.app/',
        ReturnSubscriptionArn: true
      };

      sns.subscribe(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
      });
}


// register device endpoint 
const createEndpoint=()=>{
    var params = {
        PlatformApplicationArn: 'arn:aws:sns:ap-south-1:631170167195:app/GCM/Notifications_demo', /* required */
        Token: 'e4mIF-nCKfapY7SMlgK1Fn:APA91bEVOAiSBGJNynmUxybsVrOlpD8aLJ3B68L8LjL-clK3cWkZJgFTaIGGtovE6AnuEqwKZitwvY-uEop4A7m-fgixaDOF6k6c-joni9mZNrMPODGN967RZqj22LqfsxrOVGtpFWma', /* required */
      };
      sns.createPlatformEndpoint(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
      });
}

// publish messages to direct endpoint or from the topic
const publishMessage=()=>{
    var params = {
        Message: "Message Succefully published",
        TargetArn: "arn:aws:sns:ap-south-1:631170167195:endpoint/GCM/Notifications_demo/13ac0839-090c-338a-aa4a-dc41053fa7e3"
    }
    sns.publish(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
      });
}

const createEvents =() =>{
    const iam_role_arn = "arn:aws:iam::631170167195:role/Cloudwatch_events"
    var cwevents = new Aws.CloudWatchEvents();

 var params = {
   Name: 'demo_event_1',
   RoleArn: iam_role_arn,
   ScheduleExpression: 'rate(5 minutes)',
   State: 'ENABLED'
 };

 cwevents.putRule(params, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Success", data.RuleArn);
  }
 });
}

const createEventTarget=()=>{
    var cwevents = new Aws.CloudWatchEvents();
var params = {
  Rule: 'demo_event_1',
  Targets: [
    {
      Arn: 'arn:aws:lambda:ap-south-1:631170167195:function:publish_message',
      Id: 'myCloudWatchEventsTarget',
    }
  ]
};

cwevents.putTargets(params, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Success", data);
  }
});
}
module.exports ={
    createTopic,
    subscribeTopic,
    publishMessage,
    createEndpoint,
    createEvents,
    createEventTarget
}