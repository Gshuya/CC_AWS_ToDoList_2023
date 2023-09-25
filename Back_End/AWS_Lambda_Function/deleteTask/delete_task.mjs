import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand,QueryCommand } from "@aws-sdk/lib-dynamodb";
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const tableName = process.env.TABLE;

export const deleteTaskHandler = async (event) => {
  if (event.requestContext.http.method !== 'POST') {
    throw new Error(`deleTask Method only accept DELETE method, you tried: ${event.requestContext.http.method}`);
  }
  // All log statements are written to CloudWatch
  console.info('received:', event);
  
  const body = JSON.parse(event.body);
  const id = body.id;
  const task = body.task;
  
  const checkCommand = new QueryCommand({
        TableName: tableName,
        KeyConditionExpression:"id = :email AND task = :task",
        ExpressionAttributeValues: {
          ":email": id,
          ":task" : task
        }
     });
    
  const checkdata = await docClient.send(checkCommand);
  const checkitem = checkdata.Items;
    
  if (checkitem.length === 0) {
      const errormessage ={
          statusCode: "200",
          body: JSON.stringify("Can't find this task")};
      return errormessage;
  }

  const command = new DeleteCommand({
    TableName: tableName,
    Key: {
      id: id,
      task: task,
    },
  });

  const response = await docClient.send(command);
  console.log(response);
  return response;
};
