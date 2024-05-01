import {SendEmailCommand, SESClient} from "@aws-sdk/client-ses";

// todo keys must be in env
const sesClient = new SESClient({
    region: 'us-west-1',
    credentials: {
        accessKeyId: 'AKIA36WKJYY3L2AFDBEQ',
        secretAccessKey: '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'
    }
});

export async function sendEmail(email, subject, body) {

    let htmlContent = `
    <p>Click the link to register your account</p>
    <h1>${body}</h1>
    `

    const params = {
        Destination: {
            ToAddresses: [email]
        },
        Message: {
            Body: {
                Html: {
                    Data: htmlContent
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