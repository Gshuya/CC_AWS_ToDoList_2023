// get all tasks of an user

// Create a DocumentClient that represents the query to add an item
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

// Get the DynamoDB table name from environment variables
const tableName = process.env.TABLE;
const usertable = process.env.UserTABLE;

export const getAllItemsHandler = async (event) => {
  
  if (event.requestContext.http.method !== 'GET') {
    throw new Error(`getAllItems only accept GET method, you tried: ${event.requestContext.http.method}`);
  }
  // All log statements are written to CloudWatch
  console.info('received:', event);
  
  // Get id from pathParameters from APIGateway 
  const email = event.queryStringParameters.id;
  const password = event.queryStringParameters.password;
  
  console.log(email);
  console.log(password);
  
  const checkCommand = new QueryCommand({
        TableName: usertable,
        KeyConditionExpression:"id = :email",
        FilterExpression:"password = :pass",
        ExpressionAttributeValues: {
          ":email": email,
          ":pass" : password
        }
     });
    
  const checkdata = await ddbDocClient.send(checkCommand);
  console.log(checkdata) ;
  const checkitem = checkdata.Items;
  console.log(checkitem) ;
  
  if (checkitem.length === 0) {
      const errormessage ={
          statusCode: "200",
          body: JSON.stringify("Authentication error")};
      return errormessage;
  }
    
  

  // Get the items from the table
 
  const command = new QueryCommand({
    TableName: tableName,
    KeyConditionExpression:
      "id = :idValue",
    ExpressionAttributeValues: {
      ":idValue": email,
    }
  });


  try {
    const data = await ddbDocClient.send(command);
    var item = data.Items;
   
  } catch (err) {
    console.log("Error", err);
  }
  
  const response = {
    statusCode: "200",
    body: JSON.stringify(item)
  };
  
  console.log(item);
  
  // All log statements are written to CloudWatch
  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  
  return response;
};