import dotenv from "dotenv";
dotenv.config();
import express from "express";
import morgan from "morgan";
import cors from "cors";
import errorMiddleware from "../middleware/error-middleware.js";
import routes from "../routes/index.js";
import ui from "swagger-ui-express";
import yaml from "yaml";
import fs from "fs";
import path from "path";


const filePath = path.join(process.cwd(), "QuicktixApi.yaml");
const file = fs.readFileSync(filePath, 'utf-8');
const fileku = yaml.parse(file);

export const web = express();
web.use(cors());
web.use(morgan("dev"));
web.use(express.json());
web.use(express.urlencoded({extended: false}));
web.set('view engine', 'ejs');
web.use(routes);
web.use('/api-docs', ui.serve, ui.setup(fileku))

web.use(errorMiddleware);

export default web;
