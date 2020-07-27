const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://user1:${password}@cluster0.h4jl3.mongodb.net/phoneBookDb?retryWrites=true`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

const name = process.argv[3]

const number = process.argv[4]

if (name || number) {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    })

    person.save().then(result => {
        console.log('person saved!')
        mongoose.connection.close()
    })

} else if (!name && !number) {
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person)
        })
        mongoose.connection.close()
    })
} 
