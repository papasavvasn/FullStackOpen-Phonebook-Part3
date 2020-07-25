//https://dev.to/aryanshmahato/setup-node-express-with-typescript-3bho

import express, { Request, Response } from "express";
const app = express()

// the use of json parser gives us access to request.body
app.use(express.json())


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
        res.json(person);
    } else {
        res.status(404).end()
    }
})

app.delete("/api/persons/:id", (req: Request, res: Response) => {
    const indexOfPersonToDelete = persons.findIndex(person => person.id === req.params.id)
    if (indexOfPersonToDelete > -1) {
        persons.splice(indexOfPersonToDelete, 1)
        res.status(204).end()
    }
    else {
        res.status(404).end()
    }
})

app.get("/api/persons", (req: Request, res: Response) => {
    res.json(persons);
})

app.post("/api/persons", (req: Request, res: Response) => {
    const newPerson = { ...req.body, id: Math.floor(1000 * Math.random()) }
    persons.push(newPerson)
    res.json(newPerson)
})

app.get("/info", (req: Request, res: Response) => {
    res.send(`PhoneBook has info for ${persons.length} people
                
${new Date()}`)
})

app.listen(3001, () => {
    console.log('Server Started at Port, 3001')
})