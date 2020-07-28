"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//https://dev.to/aryanshmahato/setup-node-express-with-typescript-3bho
require('dotenv').config();
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var morgan_1 = __importDefault(require("morgan"));
var cors_1 = __importDefault(require("cors"));
var mongoose_1 = __importDefault(require("mongoose"));
var Person = require("./models/person");
var app = express_1.default();
app.use(cors_1.default());
// the use of json parser gives us access to request.body
app.use(express_1.default.json());
// https://create-react-app.dev/docs/deployment/
// serve static files
app.use(express_1.default.static(path_1.default.join(__dirname, '../build_client')));
app.get('/', function (req, res) {
    res.sendFile(path_1.default.join(__dirname, '../build_client', 'index.html'));
});
app.use(morgan_1.default(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        JSON.stringify(req.body)
    ].join(' ');
}));
app.get("/api/persons/:id", function (req, res) {
    Person.findById(req.params.id).then(function (person) {
        res.json(person);
    });
});
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
app.get("/api/persons", function (req, res) {
    Person.find({}).then(function (persons) {
        console.log(persons);
        res.json(persons);
        mongoose_1.default.connection.close();
    });
});
app.post("/api/persons", function (req, res) {
    if (!req.body.name || !req.body.number) {
        return res.status(400).json({
            error: 'name or number missing'
        });
    }
    else {
        var person = new Person({
            name: req.body.name,
            number: req.body.number
        });
        person.save().then(function (savedPerson) {
            res.json(savedPerson);
        });
    }
});
// app.get("/info", (req: Request, res: Response) => {
//     return res.send(`PhoneBook has info for ${persons.length} people
// ${new Date()}`)
// })
var PORT = process.env.PORT;
app.listen(PORT, function () {
    console.log('Server Started at Port, 3001');
});
