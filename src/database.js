const Database = require('mongoose')
require('dotenv').config()

Database.connect(process.env.DB_URL + process.env.DB_NAME + '?retryWrites=true&w=majority', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
Database.connection.on('error', console.error.bind(console))

module.exports = Database