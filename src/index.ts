//https://dev.to/aryanshmahato/setup-node-express-with-typescript-3bho
require('dotenv').config()
import express, { Request, Response } from "express";
import path from 'path';
import morgan from "morgan";
import cors from "cors";

import Person from "./models/person"

const app = express()
app.use(cors())

// the use of json parser gives us access to request.body
app.use(express.json())


// https://create-react-app.dev/docs/deployment/
// serve static files
app.use(express.static(path.join(__dirname, '../build_client')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../build_client', 'index.html'));
});

app.use(morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        JSON.stringify(req.body)
    ].join(' ')
}))


// TODO https://medium.com/@tomanagle/strongly-typed-models-with-mongoose-and-typescript-7bc2f7197722
// add types to the db response
app.get("/api/persons/:id", (req: Request, res: Response) => {
    Person.findById(req.params.id).then(person => {
        res.json(person)
    })

})




// app.delete("/api/persons/:id", (req: Request, res: Response) => {
//     const indexOfPersonToDelete = persons.findIndex(person => person.id === req.params.id)
//     if (indexOfPersonToDelete > -1) {
//         persons.splice(indexOfPersonToDelete, 1)
//         return res.status(204).end()
//     }
//     else {
//         return res.status(404).end()
//     }
// })

app.get("/api/persons", (req: Request, res: Response) => {
    Person.find({}).then(persons => {
        console.log(persons)
        res.json(persons)
    })
})

app.post("/api/persons", (req: Request, res: Response) => {

    if (!req.body.name || !req.body.number) {
        return res.status(400).json({
            error: 'name or number missing'
        })
    } else {
        const person = new Person({
            name: req.body.name,
            number: req.body.number
        })
        person.save().then(savedPerson => {
            res.json(savedPerson)
        })
    }
})

// app.get("/info", (req: Request, res: Response) => {
//     return res.send(`PhoneBook has info for ${persons.length} people

// ${new Date()}`)
// })

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log('Server Started at Port, 3001')
})