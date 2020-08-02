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
var person_1 = __importDefault(require("./models/person"));
var app = express_1.default();
app.use(cors_1.default());
// https://create-react-app.dev/docs/deployment/
// serve static files
app.use(express_1.default.static(path_1.default.join(__dirname, '../build_client')));
// the use of json parser gives us access to request.body
app.use(express_1.default.json());
app.get('/', function (_, res) {
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
// TODO https://medium.com/@tomanagle/strongly-typed-models-with-mongoose-and-typescript-7bc2f7197722
// add types to the db response
app.get("/api/persons/:id", function (req, res, next) {
    person_1.default.findById(req.params.id).then(function (person) {
        if (person) {
            res.json(person);
        }
        else {
            res.status(404).end();
        }
    }).catch(function (error) { return next(error); });
});
app.delete('/api/persons/:id', function (req, res, next) {
    person_1.default.findByIdAndRemove(req.params.id)
        .then(function (person) {
        res.status(204).end();
    })
        .catch(function (error) { return next(error); });
});
app.get("/api/persons", function (req, res) {
    person_1.default.find({}).then(function (persons) {
        res.json(persons);
    });
});
app.post("/api/persons", function (req, res, next) {
    if (!req.body.name || !req.body.number) {
        return res.status(400).json({
            error: 'name or number missing'
        });
    }
    else {
        var person = new person_1.default({
            name: req.body.name,
            number: req.body.number
        });
        person.save({ validateBeforeSave: true }).then(function (savedPerson) {
            res.json(savedPerson);
        }).catch(function (e) { return next(e); });
    }
});
app.put('/api/persons/:id', function (req, res, next) {
    var person = { name: req.body.name, number: req.body.number };
    person_1.default.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(function (updatedPerson) {
        res.json(updatedPerson);
    })
        .catch(function (error) { return next(error); });
});
app.get("/info", function (_, res) {
    person_1.default.find({}).then(function (persons) { return res.send("PhoneBook has info for " + persons.length + " people"); });
});
var unknownEndpoint = function (_, res) {
    res.status(404).send({ error: 'unknown endpoint' });
};
// handler of requests with unknown endpoint
app.use(unknownEndpoint);
var errorHandler = function (error, _, response, next) {
    var _a, _b;
    if (error.name === 'CastError') {
        response.status(400).send({ error: 'malformatted id' });
    }
    else if (error.name === 'ValidationError') {
        response.status(400).json({ "error": ((_a = error.errors['number']) === null || _a === void 0 ? void 0 : _a.message) || ((_b = error.errors["name"]) === null || _b === void 0 ? void 0 : _b.message) });
    }
    next(error);
};
app.use(errorHandler);
var PORT = process.env.PORT;
app.listen(PORT, function () {
    console.log('Server Started at Port, 3001');
});
