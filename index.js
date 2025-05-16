import dotenv from "dotenv"
import path from 'path'
dotenv.config({path:path.resolve('./config/.env')})
import express from "express"
import { cronjob } from "./src/utils/cron.js"

import bootstrap from "./src/app.controller.js"
const app = express()
const port = process.env.PORT
cronjob()

bootstrap(app,express)
app.listen(port, () => console.log(`Server running on port ${port}`))