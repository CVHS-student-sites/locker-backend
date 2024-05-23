import {SendEmailCommand, SESClient} from "@aws-sdk/client-ses";
import path from 'path';
import {fileURLToPath} from 'url';
import fs from 'fs';
import handlebars from 'handlebars';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);


const sesClient = new SESClient({
    region: 'us-west-1', credentials: {
        accessKeyId: process.env.ACCESSKEYID, secretAccessKey: process.env.SECRETACCESSKEY
    }
});


async function generateVerificationEmail(link) {
    const templatePath = `${__dirname}/verify.html`;
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const template = handlebars.compile(templateSource);
    const data = {
        link: link
    };
    return template(data);
}

export async function sendVerificationEmail(email, link) {
    console.log(`SES Called: ${email}`);
    let htmlContent = await generateVerificationEmail(link);
    const params = {
        Destination: {
            ToAddresses: [email]
        }, Message: {
            Body: {
                Html: {
                    Data: htmlContent
                }
            }, Subject: {
                Data: 'Locker Verify'
            }
        }, Source: 'CV Locker <locker_verify@cvapps.net>'
    };
    try {
        let result = await sesClient.send(new SendEmailCommand(params));
        console.log(`Email Sent: ${email} - Code: ${result}`);
    } catch (err) {
        throw err;
    }
}

async function generateLockerEmail(content) {
    const templatePath = `${__dirname}/locker.html`;
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const template = handlebars.compile(templateSource);

    const data = {
        number: content.lockerNumber,
        building: content.location.Building,
        floor: content.location.Floor,
        level: content.location.Level
    };
    return template(data);
}

export async function sendLockerEmail(email, data) {
    let htmlContent = await generateLockerEmail(data);
    const params = {
        Destination: {
            ToAddresses: [email]
        }, Message: {
            Body: {
                Html: {
                    Data: htmlContent
                }
            }, Subject: {
                Data: 'Selected Locker Location'
            }
        }, Source: 'CV Locker <locker_verify@cvapps.net>'
    };
    try {
        await sesClient.send(new SendEmailCommand(params));
    } catch (err) {
        throw err;
    }
}