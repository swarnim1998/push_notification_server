const { APIGateway } = require('aws-sdk')
const Express = require('express')
const App = Express()
const Serverless = require('serverless-http')
const Router = Express.Router()
const bodyParser = require('body-parser')
const {createEventTarget, createEndpoint, publishMessage, 
      subscribeTopic, createEvents, stepFunction, pushNotification} = require('./services')
const moment = require('moment')
const db = require('./database')
const NotificationSchema = require('./models/demo')


require('dotenv').config()

App.use(bodyParser.urlencoded({ extended: false }))
App.use(bodyParser.json())



Router.get('/subscribe',async (req,res)=>{
    
    await subscribeTopic() 
    res.json({
        "hello": "world"
    })
})


Router.get('/endpoint',async (req,res)=>{
    
    await createEndpoint() 
    res.json({
        "endpoint": "created"
    })
})

Router.get('/publish', async (req, res)=>{
    await publishMessage() 
    res.json({
        "Message": "Published"
    })
})

Router.get('/createEvents', async (req, res)=>{
  await createEvents() 
  res.json({
      "Event": "Created"
  })
})

Router.get('/createEventTarget', async (req, res)=>{
  await createEventTarget() 
  res.json({
      "Target": "Created"
  })
})


Router.get('/app',async (req, res)=>{

//    await NotificationSchema.insertMany({timestamp: Moment.utc().toString(), msg: "Hello world", receiver: "swarnim"})
const time = moment().add(7, 'minutes').toString()
console.log("+++++", time)
    res.json({
        "hello": "world"
    })
})

Router.get('/step', async (req, res)=>{
    await stepFunction()
    res.json({
        "step": "world"
    })
})
//inserts push notification information in db
Router.get('/insertNotification',async (req,res)=>{
       const data = {timestamp: moment().add(3, "minutes").toISOString(), 
                     msg: "Message successfully posted", 
                     receiver: "arn:aws:sns:ap-south-1:631170167195:Tft-tech",
                     deleted: false }
       await NotificationSchema.insertMany(data)
    res.json({
        "Notification": "inserted"
    })
})

// push notification on endpoints
Router.get('/pushNotification', async (req, res)=>{
   await pushNotification() 
   res.json({
    "Notification": "pushed"
})
})
// Router.listen(5001, ()=>{
//     console.log("server connected successfully")
//  })
 
App.use('/.netlify/functions/api', Router)

module.exports = App
module.exports.handler = Serverless(App)