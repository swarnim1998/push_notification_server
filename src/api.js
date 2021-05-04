const { APIGateway } = require('aws-sdk')
const Express = require('express')
const App = Express()
const Serverless = require('serverless-http')
const Router = Express.Router()
const bodyParser = require('body-parser')
const {createEventTarget, createEndpoint, publishMessage, subscribeTopic, createEvents} = require('./services')
App.use(bodyParser.urlencoded({ extended: false }))
App.use(bodyParser.json())


// App.get('/subscribe',async (req,res)=>{
    
//     await subscribeTopic() 
//     res.json({
//         "hello": "world"
//     })
// })


// App.get('/endpoint',async (req,res)=>{
    
//     await createEndpoint() 
//     res.json({
//         "endpoint": "created"
//     })
// })

// App.get('/publish', async (req, res)=>{
//     await publishMessage() 
//     res.json({
//         "Message": "Published"
//     })
// })

// App.get('/createEvents', async (req, res)=>{
//   await createEvents() 
//   res.json({
//       "Event": "Created"
//   })
// })
// App.listen(5000, ()=>{
//    console.log("server connected successfully")
// })

// App.get('/createEventTarget', async (req, res)=>{
//   await createEventTarget() 
//   res.json({
//       "Target": "Created"
//   })
// })

// App.listen(5001, ()=>{
//    console.log("server connected successfully")
// })

Router.get('/app', (req, res)=>{
    res.json({
        "hello": "world"
    })
})

App.use('/.netlify/functions/api', Router)

module.exports = App
module.exports.handler = Serverless(App)