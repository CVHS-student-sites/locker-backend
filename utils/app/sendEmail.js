import {SendEmailCommand, SESClient} from "@aws-sdk/client-ses";

// todo keys must be in env
const sesClient = new SESClient({
    region: 'us-east-1',
    credentials: {
        accessKeyId: 'AKIAWJNVNSJEO4DETXUH',
        secretAccessKey: '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'
    }
});

export async function sendEmail(email, subject, body) {
    const params = {
        Destination: {
            ToAddresses: [email]
        },
        Message: {
            Body: {
                Text: {
                    Data: body
                }
            },
            Subject: {
                Data: subject
            }
        },
        Source: 'CV Locker <locker_verifiy@cvapps.net>'
    };

    try {
        await sesClient.send(new SendEmailCommand(params));
    } catch (err) {
        throw err;
    }
}