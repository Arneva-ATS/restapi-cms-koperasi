"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const apiRoutes_1 = __importDefault(require("./routes/apiRoutes"));
require('dotenv').config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
// Set Port Server
const PORT = process.env.PORT;
if (!PORT) {
    console.log(`No port value specified...`);
}
// Use the apiRouter with the base path /api
app.use('/v1/rki-cms', apiRoutes_1.default);
app.get('/', (req, res) => {
    res.send('Welcome to the Arneva REST API!');
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
// Listen Port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
