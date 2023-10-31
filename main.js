// mjs module adjustments
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// importing dependencies
import { convertPDFToImages } from "./pdfConvert.js"
import { perform_ocr_for_tax,perform_ocr_for_po,perform_ocr_for_gr,perform_ocr_for_dn,perform_ocr_for_invoice } from "./ocrScan.js"
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// initial variables
const app = express();
const port = 3000;
const currentModuleFileUrl = import.meta.url;
const currentModuleDir = dirname(fileURLToPath(currentModuleFileUrl));

app.set('view engine', 'ejs');

// show port used for web hosting
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// Set up the file storage destination and file name
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads'); // Create an 'uploads' folder in your project directory
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

// Create a multer instance with the storage configuration
const upload = multer({ storage });

// Serve static files from the 'uploads' folder
app.use('/uploads', express.static('uploads'));

// Serve your index.html file as the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(currentModuleDir, 'index.html'));
});

// Set up a route for uploading files
app.post('/upload', upload.single('file'), (req, res) => {
    res.sendFile(path.join(currentModuleDir, 'validate.html'));
});

// route for performing ocr and showing output raw
// app.get('/validate', async (req, res) => {
//     const pdfFilePath = './uploads/pdf_sample.pdf'; // Path to the PDF file
//     const outputDirectory = './converted_images'; // Directory where the images will be saved

//     // file conversion mechanism
//     if (!fs.existsSync(outputDirectory)) {
//     fs.mkdirSync(outputDirectory);
//     }
//     convertPDFToImages(pdfFilePath, outputDirectory)
//     .then(() => {
//         console.log('PDF conversion completed.\n');
//     })
//     .catch((error) => {
//         console.error('Error converting PDF:', error);
//     });

//     // ocr mechanism
//     var invoice_number = await perform_ocr_for_invoice("./converted_images/page_1.jpg")
//     var taxData = await perform_ocr_for_tax("./converted_images/page_2.jpg")
//     var po_number = await perform_ocr_for_po("./converted_images/page_7.jpg")
//     var grData = [await perform_ocr_for_gr("./converted_images/page_4.jpg"), await perform_ocr_for_gr("./converted_images/page_6.jpg")]
//     var dnData = [await perform_ocr_for_dn("./converted_images/page_3.jpg"), await perform_ocr_for_dn("./converted_images/page_5.jpg")]
    
//     var ocrResults = {
//         "invoice": invoice_number,
//         "faktur_pajak": taxData,
//         "goods_receipt": grData,
//         "delivery_notes": dnData,
//         "purchase_order": po_number
//     }

//     // printing out the result to console
//     console.log("OCR Results")
//     console.log(ocrResults)

//     // sending the files to the browser
//     // res.sendFile(path.join(currentModuleDir, 'check.html'));
//     // res.send(ocrResults)

//     const jsonString = JSON.stringify(ocrResults)
//     const jsonDataElement = document.getElementById("ocrResult");
//     jsonDataElement.textContent = jsonString;

//     res.sendFile(path.join(currentModuleDir, 'validate.html'));
// })

// showing ocr result in beauty forms
app.get('/validate', async (req, res) => {
    const pdfFilePath = './uploads/pdf_sample.pdf'; // Path to the PDF file
    const outputDirectory = './converted_images'; // Directory where the images will be saved

    // file conversion mechanism
    if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory);
    }
    convertPDFToImages(pdfFilePath, outputDirectory)
    .then(() => {
        console.log('PDF conversion completed.\n');
    })
    .catch((error) => {
        console.error('Error converting PDF:', error);
    });

    // ocr mechanism
    var invoice_number = await perform_ocr_for_invoice("./converted_images/page_1.jpg")
    var taxData = await perform_ocr_for_tax("./converted_images/page_2.jpg")
    var po_number = [await perform_ocr_for_po("./converted_images/page_7.jpg"), await perform_ocr_for_po("./converted_images/page_8.jpg")]
    var grData = [await perform_ocr_for_gr("./converted_images/page_4.jpg"), await perform_ocr_for_gr("./converted_images/page_6.jpg")]
    var dnData = [await perform_ocr_for_dn("./converted_images/page_3.jpg"), await perform_ocr_for_dn("./converted_images/page_5.jpg")]
    
    // Alternate Data Types for PO Materials
    // const arrayMaterial = [
    //     po_number[0].materials[0],
    //     po_number[0].materials[1], 
    //     po_number[1][0]
    // ]
    const arrayMaterial = [
        JSON.stringify(po_number[0].materials[0]),
        JSON.stringify(po_number[0].materials[1]), 
        JSON.stringify(po_number[1][0])
    ]
    po_number[0].materials = arrayMaterial

    var ocrResults = {
        "invoice": invoice_number,
        "faktur_pajak": taxData,
        "goods_receipt": grData,
        "delivery_notes": dnData,
        "purchase_order": po_number[0]
    }

    // printing out the result to console
    console.log("OCR Results:")
    console.log(ocrResults)

    // sending the files to the browser
    // res.send(ocrResults)

    res.render('check', { ocrResults }); // Render the 'index.ejs' template
  });