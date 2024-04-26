import {SESClient, SendEmailCommand} from "@aws-sdk/client-ses";

// todo keys must be in env
const sesClient = new SESClient({
    region: 'us-east-1',
    credentials: {
        accessKeyId: 'AKIAWJNVNSJEO4DETXUH',
        secretAccessKey: 'zZAuWoEhCdm5DXs7TkNNGRsN40RbpWh44GgiXzyh'
    }
});

// Define your email parameters
const params = {
    Destination: {
        ToAddresses: ['birdpump@gmail.com'] // Change this to the recipient's email address
    },
    Message: {
        Body: {

            Text: {
                Data: 'press this code to continue' // Change this to your email body
            }
        },
        Subject: {
            Data: 'CV Locker - Verify account' // Change this to your email subject
        }
    },
    Source: 'Locker@cvapps.net'
};

// Send the email
try {
    const data = await sesClient.send(new SendEmailCommand(params));
    console.log('Email sent:', data);
} catch (err) {
    console.error('Error sending email:', err);
}
