
// Create a DocumentClient that represents the query to add an item
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand,QueryCommand } from '@aws-sdk/lib-dynamodb';
const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);


// Get the DynamoDB table name from environment variables
const tableName = process.env.TABLE;


export const putUserItemHandler = async (event) => {
    if (event.requestContext.http.method !== 'POST') {
        throw new Error(`postMethod only accepts POST method, you tried: ${event.requestContext.http.method} method.`);
    }
    // All log statements are written to CloudWatch
    console.info('received:', event);
   
    // Get id and name from the body of the request
    const body = JSON.parse(event.body);
    console.info('body:', body);
    const email = body.Email;
    console.info('email:', email);
    const password = body.Password;
    console.info('password:', password);
    
    const checkCommand = new QueryCommand({
        TableName: tableName,
        KeyConditionExpression:"id = :email",
        ExpressionAttributeValues: {
          ":email": email,
        }
     });
    
    const checkdata = await ddbDocClient.send(checkCommand);
    const checkitem = checkdata.Items;
    
    if (checkitem.length != 0) {
        const usermessage ={
            statusCode: "200",
            body: JSON.stringify("User already exists")};
        return usermessage;
    }

    // Creates a new item, or replaces an old item with a new item
    
    var params = {
        TableName : tableName,
        Item: { id :email, password:password}
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
    console.log(response);
    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
};