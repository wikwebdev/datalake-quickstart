/**
 * S3 lambda file for creating a webhook that automatically writes the data input into a S3 Bucket for analysis
 */

// Import the AWS SDK and create an S3 client
import AWS from 'aws-sdk';
const s3 = new AWS.S3();

function getDateSting () {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
}

function makeId(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

const headers = {
    // "Access-Control-Allow-Headers" : "Content-Type",
    // "Access-Control-Allow-Origin": "your-url",
    // "Access-Control-Allow-Methods": "OPTIONS,POST"
}

// Your Lambda handler function
export const handler = async (event) => {

    const scope = event.queryStringParameters?.scope;
    if (!scope) {
        return {
            statusCode: 400,
            headers,
            body: 'bad request missing required parameters'
        }
    }

    let body = ''

    if (event["httpMethod"] === "OPTIONS") {
        return {
            statusCode: 200,
            headers,
            body: 'Hello from lambda'
        }
    }

    // Parse the JSON object from the incoming HTTP request
    const requestBody = event.body

    try {

        // Get the "message" property from the parsed JSON object
        // const message = { 'ducks': 'are great!'};

        // Specify the S3 bucket name and the desired .json file key
        const name = new Date()/1
        const bucketName = 'wwd-data-mesh';
        const fileKey = `${scope}/${getDateSting()}/${name}-${makeId(10)}.json`; // needs to be randomized or incremented

        // Create the S3 upload parameters
        const uploadParams = {
            Bucket: bucketName,
            Key: fileKey,
            Body: requestBody,
            ContentType: 'application/json',
        };


        // Upload the "message" property as a .json file to the specified S3 bucket
        const uploadResult = await s3.upload(uploadParams).promise();

        // Check if the upload was successful
        if (!uploadResult || !uploadResult.Location) throw Error()
        // Return a successful response
        return {
            headers,
            statusCode: 200,
            body: 'Successful!'
        }
    } catch (err) {
        console.error('Error uploading message to S3:', err);
        // Return an error response
        return {
            headers,
            statusCode: 500,
            body: err.message,
        };
    }
}
