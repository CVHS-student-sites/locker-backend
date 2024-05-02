import {SendEmailCommand, SESClient} from "@aws-sdk/client-ses";
import fs from 'fs';
import handlebars from 'handlebars';


// todo keys must be in env
const sesClient = new SESClient({
    region: 'us-west-1', credentials: {
        accessKeyId: 'AKIA36WKJYY3L2AFDBEQ', secretAccessKey: '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'
    }
});


async function generateEmail() {
    try{
        const templatePath = `${__dirname}/verify.html`;

        const templateSource = fs.readFileSync(templatePath, 'utf8');

        const template = handlebars.compile(templateSource);

        const data = {
            name: 'John Doe', verificationCode: '123456'
        };

        return template(data);
    }catch(error){
        console.log(error);
    }

}

export async function sendEmail(email, subject, body) {

    let htmlContent = await generateEmail();

    const params = {
        Destination: {
            ToAddresses: [email]
        }, Message: {
            Body: {
                Html: {
                    Data: htmlContent
                }
            }, Subject: {
                Data: subject
            }
        }, Source: 'CV Locker <locker_verifiy@cvapps.net>'
    };

    try {
        await sesClient.send(new SendEmailCommand(params));
    } catch (err) {
        throw err;
    }
}