import { connectionDB } from "./DB/connectionDB.js";
import userRouter from "./modules/users/user.controller.js";
import { globalErrorHandler } from "./utils/index.js";
import { createHandler } from 'graphql-http/lib/use/express';
import schema from "./modules/graphql.schema.js"
import adminRouter from "./modules/admin/admin.controller.js";
import companyRouter from "./modules/companies/company.controller.js";
import jobRouter from "./modules/jobs/job.controller.js";
import cors from "cors"

const bootstrap = (app, express) => {
 app.use(cors())
  app.use(express.json());
  connectionDB()
  app.use('/users',userRouter)
  app.use('/admin',adminRouter)
  app.use('/company',companyRouter)
  app.use('/job',jobRouter)

  app.use("/graphql", createHandler({ schema }));
 
  app.use("*", (request, response, next) => {
    return next(new Error(`Invalid URL using ${request.originalUrl}`));
  });

     //error handling middleware
     app.use(globalErrorHandler)
};
export default bootstrap;
