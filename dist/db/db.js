"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testDBConnection = exports.disconnectMongoDB = exports.connectMongoDB = exports.client = void 0;
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const username = process.env.MONGO_DB_USERNAME;
const password = process.env.MONGO_DB_PASSWORD;
if (!username || !password) {
    console.error("Missing MONGO_DB_USERNAME or MONGO_DB_PASSWORD environment variables.");
    process.exit(1);
}
const uri = `mongodb+srv://${username}:${password}@cluster0.5ipsrzy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
exports.client = new mongodb_1.MongoClient(uri, {
    serverApi: {
        version: mongodb_1.ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});
const connectMongoDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.client.connect();
        console.log("Connected to MongoDB");
    }
    catch (error) {
        console.error(`Error connecting to MongoDB: ${error}`);
        throw error;
    }
});
exports.connectMongoDB = connectMongoDB;
const disconnectMongoDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.client.close();
        console.log("Disconnected from MongoDB");
    }
    catch (error) {
        console.error(`Error disconnecting from MongoDB: ${error}`);
        throw error;
    }
});
exports.disconnectMongoDB = disconnectMongoDB;
const testDBConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        yield exports.client.connect();
        // Send a ping to confirm a successful connection
        yield exports.client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    finally {
        // Ensures that the client will close when you finish/error
        yield exports.client.close();
    }
});
exports.testDBConnection = testDBConnection;
