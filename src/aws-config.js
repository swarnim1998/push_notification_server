const Aws = require('aws-sdk')

Aws.config.update({
    region: 'ap-south-1',
    accessKeyId: 'AKIAZF5FMOGN2C6KOMEZ',
    secretAccessKey: '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'
})
// const SNS = new Aws.SNS()
module.exports = Aws