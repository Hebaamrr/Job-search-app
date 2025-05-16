import * as T from "./types.js";
import * as R from "./resolve.js"
import { GraphQLList } from "graphql";

export const userQuery={
    getUsers:{
     type:new GraphQLList(T.getuser),
     resolve: R.getUsers
    } 
 }

 export const companyQuery={
    getCompanies:{
        type:new GraphQLList(T.getCompany),
        resolve:R.getCompany
    }
 }
