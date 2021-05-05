const Aws = require('aws-sdk')
require('dotenv').config()

// console.log("+++++++++", process.env.DB_NAME)
Aws.config.update({
    region: process.env.region,
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey
})
// const SNS = new Aws.SNS()
module.exports = Aws