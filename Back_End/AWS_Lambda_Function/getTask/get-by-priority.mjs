// get tasks by priority for an user

// Create a DocumentClient that represents the query to add an item
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

// Get the DynamoDB table name from environment variables
const tableName = process.env.TABLE;
const usertable = process.env.userTABLE;


export const getByPriorityHandler = async (event) => {
  if (event.requestContext.http.method !== 'GET') {
    throw new Error(`getItems only accept GET method, you tried: ${event.requestContext.http.method}`);
  }
  // All log statements are written to CloudWatch
  console.info('received:', event);
 
  // Get id from pathParameters from APIGateway 
  //const body = JSON.parse(decodeURIComponent(event.queryStringParameters.body));
  console.log(event.queryStringParameters.id);
  console.log(event.queryStringParameters.password);
  const email = event.queryStringParameters.id;
  const password = event.queryStringParameters.password;
  const Vpriority = event.queryStringParameters.priority; 
  
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
  const checkitem = checkdata.Items;
    
  if (checkitem.length === 0) {
      const errormessage ={
          statusCode: "200",
          body: JSON.stringify("Authentication error")};
      return errormessage;
  }
  
  // Get the items from the table
 
  const command = new QueryCommand({
    TableName: tableName,
    KeyConditionExpression:"id = :idValue",
    FilterExpression: "priority = :priorityValue",
    ExpressionAttributeValues: {
      ":idValue": email,
      ":priorityValue": Vpriority,
    },
    ConsistentRead: true,
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
  
  console.log(item)
  
  // All log statements are written to CloudWatch
  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
}