//https://dev.to/aryanshmahato/setup-node-express-with-typescript-3bho
require('dotenv').config()
import express, { Request, Response, NextFunction } from "express";
import path from 'path';
import morgan from "morgan";
import cors from "cors";
import Person from "./models/person"

const app = express()
app.use(cors())

// https://create-react-app.dev/docs/deployment/
// serve static files
app.use(express.static(path.join(__dirname, '../build_client')));

// the use of json parser gives us access to request.body
app.use(express.json())

app.get('/', function (_: Request, res: Response) {
    res.sendFile(path.join(__dirname, '../build_client', 'index.html'));
});

app.use(morgan(function (tokens, req: Request, res: Response) {
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
app.get("/api/persons/:id", (req: Request, res: Response, next: NextFunction) => {
    Person.findById(req.params.id).then(person => {
        if (person) {
            res.json(person)
        } else {
            res.status(404).end()
        }
    }).catch(error => next(error))
})

app.delete('/api/persons/:id', (req: Request, res: Response, next: NextFunction) => {
    Person.findByIdAndRemove(req.params.id)
        .then(person => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

app.get("/api/persons", (req: Request, res: Response) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
})

app.post("/api/persons", (req: Request, res: Response, next: NextFunction) => {

    if (!req.body.name || !req.body.number) {
        return res.status(400).json({
            error: 'name or number missing'
        })
    } else {
        const person = new Person({
            name: req.body.name,
            number: req.body.number
        })
        person.save({ validateBeforeSave: true }).then(savedPerson => {
            res.json(savedPerson)
        }).catch(e => next(e))
    }
})


app.put('/api/persons/:id', (req: Request, res: Response, next: NextFunction) => {
    const person = { name: req.body.name, number: req.body.number }
    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => {
            res.json(updatedPerson)
        })
        .catch(error => next(error))
})

app.get("/info", (_: Request, res: Response) => {
    Person.find({}).then(persons => res.send(`PhoneBook has info for ${persons.length} people`))
})


const unknownEndpoint = (_: Request, res: Response) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error: Error, _: Request, response: Response, next: NextFunction) => {

    if (error.name === 'CastError') {
        response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        response.status(400).json({ "error": (error as any).errors['number']?.message || (error as any).errors["name"]?.message })
    }


    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log('Server Started at Port, 3001')
})