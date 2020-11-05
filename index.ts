"use strict";
// @ts-ignore
import express from 'express';
// @ts-ignore
import bodyParser from 'body-parser';
// @ts-ignore
import hbs from 'express-hbs';
import path from 'path';
// @ts-ignore
import cookieParser from "cookie-parser";
import {registerHelpers} from './utils/handlebar-util.js';
import {overrideMiddleware} from "./utils/method-override.js";
import {routes} from "./routes/routes.js";

const app = express();

app.engine('hbs', hbs.express4());
app.set('views', path.resolve('views'));
app.set('view engine', 'hbs');
registerHelpers(hbs);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());

//Public dictionary
app.use(express.static(path.resolve('public')));

app.use(overrideMiddleware);
app.use('/', routes);

const hostname = '127.0.0.1';
const port = 3001;

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
