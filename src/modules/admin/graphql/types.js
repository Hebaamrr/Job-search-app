import { GraphQLBoolean, GraphQLID, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";

export const getuser= new GraphQLObjectType({
    name:"oneUser",
    fields:{
        _id:{type: GraphQLID},
        firstName:{type:GraphQLString},
        lastName:{type:GraphQLString},
        email:{type: GraphQLString},
        mobileNumber:{type:GraphQLString},
        role:{type:GraphQLString},
        gender:{type:GraphQLString},
        isConfirmed:{type:GraphQLBoolean},
        DOB:{type:GraphQLString}
    }
})

export const getCompany=new GraphQLObjectType({
    name:"getcompanies",
    fields:{
        _id:{type: GraphQLID},
        companyName:{type:GraphQLString},
        address:{type:GraphQLString},
        companyEmail:{type: GraphQLString},
        HRs:{type: new GraphQLList(GraphQLID)},
        approvedByAdmin:{type:GraphQLBoolean}
    }
})
