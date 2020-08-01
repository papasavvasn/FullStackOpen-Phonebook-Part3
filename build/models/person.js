"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// with this tsconfig all the folders should be inside the src folder
require('dotenv').config();
var mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.set('useFindAndModify', false);
var url = process.env.MONGODB_URI;
console.log("url is", url);
mongoose_1.default.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(function (result) {
    console.log('connected to MongoDB');
})
    .catch(function (error) {
    console.log('error connecting to MongoDB:', error.message);
});
var personSchema = new mongoose_1.default.Schema({
    name: String,
    number: String,
});
// TODO why is transform not working?
personSchema.set('toJSON', {
    transform: function (document, returnedObject) {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});
exports.default = mongoose_1.default.model('Person', personSchema);
