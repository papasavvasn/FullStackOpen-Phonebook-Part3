"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//https://dev.to/aryanshmahato/setup-node-express-with-typescript-3bho
var express_1 = __importDefault(require("express"));
var morgan_1 = __importDefault(require("morgan"));
var cors_1 = __importDefault(require("cors"));
var app = express_1.default();
app.use(cors_1.default());
// the use of json parser gives us access to request.body
app.use(express_1.default.json());
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
var persons = [{
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
];
app.get("/api/persons/:id", function (req, res) {
    var person = persons.find(function (person) { return person.id === req.params.id; });
    if (person) {
        return res.json(person);
    }
    else {
        return res.status(404).end();
    }
});
app.delete("/api/persons/:id", function (req, res) {
    var indexOfPersonToDelete = persons.findIndex(function (person) { return person.id === req.params.id; });
    if (indexOfPersonToDelete > -1) {
        persons.splice(indexOfPersonToDelete, 1);
        return res.status(204).end();
    }
    else {
        return res.status(404).end();
    }
});
app.get("/api/persons", function (req, res) {
    return res.json(persons);
});
app.post("/api/persons", function (req, res) {
    if (!req.body.name || !req.body.number) {
        return res.status(400).json({
            error: 'name or number missing'
        });
    }
    else if (persons.find(function (person) { return person.name === req.body.name; })) {
        return res.status(400).json({
            error: "A person with the name " + req.body.name + " already exists in our database"
        });
    }
    else {
        var newPerson = __assign(__assign({}, req.body), { id: Math.floor(1000 * Math.random()) });
        persons.push(newPerson);
        return res.json(newPerson);
    }
});
app.get("/info", function (req, res) {
    return res.send("PhoneBook has info for " + persons.length + " people\n                \n" + new Date());
});
var PORT = process.env.PORT || 3001;
app.listen(PORT, function () {
    console.log('Server Started at Port, 3001');
});
