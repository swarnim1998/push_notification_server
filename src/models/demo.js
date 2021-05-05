const db = require('../database')

const NotificationSchema = db.Schema({
    timestamp: {type: Date},
    msg: {type: String},
    receiver: {type: String},
    deleted: {type: Boolean}
})

module.exports = db.model('NotificationTable', NotificationSchema)