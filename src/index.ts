//https://dev.to/aryanshmahato/setup-node-express-with-typescript-3bho
import express, { Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";

const app = express()
app.use(cors())

// the use of json parser gives us access to request.body
app.use(express.json())
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


interface Person {
    name: string
    number: string
    id?: string
}

let persons: Person[] = [{
    name: "Arto Hellas",
    number: "040-123456",
    id: "1"
}, {
    name: "Ada Lovelace",
    number: "39-44-532353",
    id: "2"
},
{
    name: "Dam Abramov",
    number: "12-43-23423",
    id: "3"
}
]

app.get("/api/persons/:id", (req: Request, res: Response) => {
    const person = persons.find(person => person.id === req.params.id)
    if (person) {
        return res.json(person);
    } else {
        return res.status(404).end()
    }
})

app.delete("/api/persons/:id", (req: Request, res: Response) => {
    const indexOfPersonToDelete = persons.findIndex(person => person.id === req.params.id)
    if (indexOfPersonToDelete > -1) {
        persons.splice(indexOfPersonToDelete, 1)
        return res.status(204).end()
    }
    else {
        return res.status(404).end()
    }
})

app.get("/api/persons", (req: Request, res: Response) => {
    return res.json(persons);
})

app.post("/api/persons", (req: Request, res: Response) => {
    if (!req.body.name || !req.body.number) {
        return res.status(400).json({
            error: 'name or number missing'
        })
    } else if (persons.find(person => person.name === req.body.name)) {
        return res.status(400).json({
            error: `A person with the name ${req.body.name} already exists in our database`
        })
    } else {
        const newPerson = { ...req.body, id: Math.floor(1000 * Math.random()) + "" }
        persons.push(newPerson)
        return res.json(newPerson)
    }
})

app.get("/info", (req: Request, res: Response) => {
    return res.send(`PhoneBook has info for ${persons.length} people
                
${new Date()}`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log('Server Started at Port, 3001')
})