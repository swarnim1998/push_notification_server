
const Express = require('express')
const Aws = require('./aws-config')
const sns = new Aws.SNS()
const moment = require('moment')
const NotificationSchema = require('./models/demo')

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
   console.log(process.env.DB_NAME)
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
        TargetArn: "arn:aws:sns:ap-south-1:631170167195:Tft-tech:456c101b-d82a-421b-b0d1-929356a5112a"
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

const stepFunction = async (data) =>{ 
 const stepFunctions = new Aws.StepFunctions()
 const payload = {
    stateMachineArn: "arn:aws:states:ap-south-1:631170167195:stateMachine:HelloWorld",
    input: JSON.stringify({
      timeStamp: data.timestamp,
      lambdaName: 'publish_message',
      receiver: data.receiver,
      message: data.msg
    }),
  }
 return stepFunctions.startExecution(payload).promise()
}

const pushNotification =async () =>{
  const Notifications = await NotificationSchema.find({deleted: false})
  const NotificationPromise = Notifications.map((item)=>{
     return stepFunction(item);
  })
  await Promise.all(NotificationPromise)
  await NotificationSchema.updateMany({}, {$set: {deleted: true}})
}

module.exports ={
    createTopic,
    subscribeTopic,
    publishMessage,
    createEndpoint,
    createEvents,
    createEventTarget,
    stepFunction,
    pushNotification
}