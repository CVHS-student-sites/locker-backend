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


async function generateEmail(link) {

    const templatePath = `${__dirname}/verify.html`;

    const templateSource = fs.readFileSync(templatePath, 'utf8');

    const template = handlebars.compile(templateSource);

    const data = {
        link: link
    };

    return template(data);
}

export async function sendEmail(email, link) {

    let htmlContent = await generateEmail(link);

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
        await sesClient.send(new SendEmailCommand(params));
    } catch (err) {
        throw err;
    }
}