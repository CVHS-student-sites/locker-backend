import express from 'express';
import multer from 'multer';
import csvParser from 'csv-parser';
import {Readable} from 'stream';

const app = express();
const port = 3000;

// Set up multer to handle file uploads
const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({storage: storage});

app.post('/upload', upload.single('csvFile'), (req, res) => {
    // Access the uploaded file buffer
    const fileBuffer = req.file.buffer.toString('utf8');

    // Parse the CSV data
    const parsedData = [];
    Readable.from(fileBuffer) // Use Readable.from to create a readable stream
        .pipe(csvParser({
            columns: true,
            bom: true,
        }))
        .on('data', (row) => {
            parsedData.push(row);
        })
        .on('end', () => {
            // At this point, parsedData contains the parsed CSV rows
            // You can now do something with the data, such as inserting it into a database

            // For demonstration purposes, let's just send it back as a JSON response
            res.json({data: parsedData});
        });
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
