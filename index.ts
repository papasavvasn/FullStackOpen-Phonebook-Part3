//https://dev.to/aryanshmahato/setup-node-express-with-typescript-3bho

import express, { Request, Response } from "express";
const app = express()


const persons = [{
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
}, {
    name: "Ada Lovelace",
    number: "39-44-532353",
    id: 2
},
{
    name: "Dam Abramov",
    number: "12-43-23423",
    id: 3
}
]

app.get("/api/persons", (req: Request, res: Response) => {
    res.json(persons);
})

app.listen(3001, () => {
    console.log('Server Started at Port, 3001')
})