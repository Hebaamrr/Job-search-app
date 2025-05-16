import {GraphQLSchema,GraphQLObjectType, GraphQLString} from 'graphql';
import { companyQuery, userQuery } from './admin/graphql/fields.js';


const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: "Query",
      fields: {
       ...userQuery,
       ...companyQuery
      },
    }),
  });

  export default schema