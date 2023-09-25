
// Create a DocumentClient that represents the query to add an item
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);


// Get the DynamoDB table name from environment variables
const tableName = process.env.TABLE;
const usertable = process.env.userTABLE;


export const putItemHandler = async (event) => {
    if (event.requestContext.http.method !== 'POST') {
        throw new Error(`postMethod only accepts POST method, you tried: ${event.requestContext.http.method} method.`);
    }
    // All log statements are written to CloudWatch
    console.info('received:', event);
    
    // Get id and name from the body of the request
    const body = JSON.parse(event.body);
    const user = body.id;
    //const idtask = body.idtask;
    const task = body.task;
    const priority = body.priority;
    const password =body.password;
    
    const checkCommand = new QueryCommand({
        TableName: usertable,
        KeyConditionExpression:"id = :email",
        FilterExpression:"password = :pass",
        ExpressionAttributeValues: {
          ":email": user,
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

    // Creates a new item, or replaces an old item with a new item
    
    var params = {
        TableName : tableName,
        Item: { id : user, task: task, priority: priority}
    };

    try {
        const data = await ddbDocClient.send(new PutCommand(params));
        console.log("Success - item added or updated", data);
      } catch (err) {
        console.log("Error", err.stack);
      }

    const response = {
        statusCode: "200",
        body: JSON.stringify(body),
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers' : 'Content-Type',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Methods': '*'
        }
    };

    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
};