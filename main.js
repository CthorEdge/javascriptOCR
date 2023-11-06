// mjs module adjustments
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// importing dependencies
import { convertPDFToImages } from "./pdfConvert.js"
import { perform_ocr_for_tax,perform_ocr_for_po,perform_ocr_for_gr,perform_ocr_for_dn,perform_ocr_for_invoice } from "./ocrScan.js"
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { export_to_excel } from "./excel.js"
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// initial variables
const app = express();
const port = 3000;
const currentModuleFileUrl = import.meta.url;
const currentModuleDir = dirname(fileURLToPath(currentModuleFileUrl));

var ocrResults = {}

app.set('view engine', 'ejs');

// show port used for web hosting
app.listen(port, () => {
    console.log(`\nServer is running on http://localhost:${port}\n`);
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
    await convertPDFToImages(pdfFilePath, outputDirectory)
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

    res.render('check', { ocrResults }); // Render the 'check.ejs' template
  });

app.get('/convertFile', async (req, res) => {
    const pdfFilePath = './uploads/pdf_sample.pdf'; // Path to the PDF file
    const outputDirectory = './converted_images'; // Directory where the images will be saved

    // file conversion mechanism
    if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory);
    }
    await convertPDFToImages(pdfFilePath, outputDirectory)
    .then(() => {
        console.log('PDF conversion completed.\n');
    })
    .catch((error) => {
        console.error('Error converting PDF:', error);
    });

    res.render('convertFile'); // Render the 'check.ejs' template

})

app.get('/showtable', async (req, res) => {
    // ocr mechanism
    var invoice_number = await perform_ocr_for_invoice("./converted_images/page_1.jpg")
    var taxData = await perform_ocr_for_tax("./converted_images/page_2.jpg")
    var po_number = [await perform_ocr_for_po("./converted_images/page_7.jpg"), await perform_ocr_for_po("./converted_images/page_8.jpg")]
    var grData = [await perform_ocr_for_gr("./converted_images/page_4.jpg"), await perform_ocr_for_gr("./converted_images/page_6.jpg")]
    var dnData = [await perform_ocr_for_dn("./converted_images/page_3.jpg"), await perform_ocr_for_dn("./converted_images/page_5.jpg")]
    
    // Alternate Data Types for PO & GR Materials
    const arrayMaterial = [
        po_number[0].materials[0],
        po_number[0].materials[1], 
        po_number[1][0]
    ]
    po_number[0].materials = arrayMaterial

    const arrayMaterialGr = [
        grData[0].materials[0],
        grData[1].materials[0],
        grData[1].materials[1]
    ]
    grData[0].materials = arrayMaterialGr

    ocrResults = {
        "invoice": invoice_number,
        "faktur_pajak": taxData,
        "goods_receipt": grData[0],
        "delivery_notes": dnData,
        "purchase_order": po_number[0]
    }

    var htmlGr = ""
    for (let i=0;i<ocrResults.goods_receipt.materials.length;i++){
        htmlGr = htmlGr.concat(
            `<tr>
                <td> ${ocrResults.goods_receipt.no_gr} </td>
                <td> ${ocrResults.goods_receipt.no_po} </td>
                <td> ${ocrResults.goods_receipt.no_ref_document_aka_delivery_notes} </td>
                <td> ${ocrResults.goods_receipt.goods_receipt_date} </td>
                <td> ${ocrResults.goods_receipt.nama_vendor} </td>
                <td> ${ocrResults.goods_receipt.materials[i].material_code} </td>
                <td> ${ocrResults.goods_receipt.materials[i].ref_part_no} </td>
                <td> ${ocrResults.goods_receipt.materials[i].material_name} </td>
                <td> ${ocrResults.goods_receipt.materials[i].qty} </td>
                <td> ${ocrResults.goods_receipt.materials[i].qty_desc} </td>
            </tr>`
        )
    }

    var html2 = ""
    for (let j=0;j<ocrResults.purchase_order.materials.length;j++){
        html2 = html2.concat(
            `<tr>
                <td> ${ocrResults.purchase_order.po_number} </td>
                <td> ${ocrResults.purchase_order.po_date} </td>
                <td> ${ocrResults.purchase_order.po_delivery_date} </td>
                <td> ${ocrResults.purchase_order.vendor_number} </td>
                <td> ${ocrResults.purchase_order.materials[j].material_code} </td>
                <td> ${ocrResults.purchase_order.materials[j].ref_part_no} </td>
                <td> ${ocrResults.purchase_order.materials[j].material_name} </td>
                <td> ${ocrResults.purchase_order.materials[j].unit_price} </td>
                <td> ${ocrResults.purchase_order.materials[j].quantity} </td>
                <td> ${ocrResults.purchase_order.materials[j].qty_desc} </td>
                <td> ${ocrResults.purchase_order.materials[j].ext_price} </td>
            </tr>`
        )
    }

    var html3 = ""
    for (let k=0;k<ocrResults.delivery_notes.length;k++){
        html3 = html3.concat(
            `<tr>
                <td> ${ocrResults.delivery_notes[k]} </td>
            </tr>`
        )
    }
    
    var htmlInvoice = ""
    for (let l=0;l<ocrResults.invoice.invoice_materials.length;l++){
        htmlInvoice = htmlInvoice.concat(
            `<tr>
                <td> ${ocrResults.invoice.invoice_number} </td>
                <td> ${ocrResults.invoice.subtotal} </td>
                <td> ${ocrResults.invoice.ppn} </td>
                <td> ${ocrResults.invoice.invoice_materials[l].material_name} </td>
                <td> ${ocrResults.invoice.invoice_materials[l].quantity} </td>
                <td> ${ocrResults.invoice.invoice_materials[l].qty_units} </td>
                <td> ${ocrResults.invoice.invoice_materials[l].unit_price} </td>
                <td> ${ocrResults.invoice.invoice_materials[l].price_amount} </td>
            </tr>`
        )
    }

    var htmlTax = (
        `<tr>
            <td> ${ocrResults.faktur_pajak.no_faktur_pajak} </td>
            <td> ${ocrResults.faktur_pajak.nama_pengusaha_kena_pajak} </td>
            <td> ${ocrResults.faktur_pajak.alamat_pengusaha_kena_pajak} </td>
            <td> ${ocrResults.faktur_pajak.npwp_pengusaha_kena_pajak} </td>
            <td> ${ocrResults.faktur_pajak.nama_pembeli_kena_pajak} </td>
            <td> ${ocrResults.faktur_pajak.alamat_pembeli_kena_pajak} </td>
            <td> ${ocrResults.faktur_pajak.npwp_pembeli_kena_pajak} </td>
            <td> ${ocrResults.faktur_pajak.dasar_pengenaan_pajak} </td>
            <td> ${ocrResults.faktur_pajak.total_ppn} </td>
        </tr>`
    )

    const jsonRes = {
        template1 : htmlGr,
        template2 : html2,
        template3 : html3,
        template4 : htmlInvoice,
        template5 : htmlTax
    }

    // printing out the html template to console
    console.log("OCR Results:")
    console.log(ocrResults)

    // sending the data to website 
    res.render('showTable', { jsonRes }); // Render the 'index.ejs' template
  });


app.get('/extractExcel', (req, res) => {

    const invoiceArray = []
    for (let l=0;l<ocrResults.invoice.invoice_materials.length;l++){
        var jsonMaterial = {
            invoice_number : ocrResults.invoice.invoice_number,
            subtotal : ocrResults.invoice.subtotal,
            ppn : ocrResults.invoice.ppn,
            material_name : ocrResults.invoice.invoice_materials[l].material_name,
            quantity : ocrResults.invoice.invoice_materials[l].quantity,
            qty_units : ocrResults.invoice.invoice_materials[l].qty_units,
            unit_price : ocrResults.invoice.invoice_materials[l].unit_price,
            price_amount : ocrResults.invoice.invoice_materials[l].price_amount 
        }
        invoiceArray.push(jsonMaterial)
    }

    const poArray = []
    for (let l=0;l<ocrResults.purchase_order.materials.length;l++){
        var jsonMaterial = {
            po_number : ocrResults.purchase_order.po_number,
            po_date : ocrResults.purchase_order.po_date,
            po_delivery_date : ocrResults.purchase_order.po_delivery_date,
            vendor_number : ocrResults.purchase_order.vendor_number,
            material_code : ocrResults.purchase_order.materials[l].material_code,
            material_name : ocrResults.purchase_order.materials[l].material_name,
            quantity : ocrResults.purchase_order.materials[l].quantity,
            qty_desc : ocrResults.purchase_order.materials[l].qty_desc,
            ref_part_no : ocrResults.purchase_order.materials[l].ref_part_no,
            unit_price : ocrResults.purchase_order.materials[l].unit_price,
            ext_price : ocrResults.purchase_order.materials[l].ext_price
        }
        poArray.push(jsonMaterial)
    }

    const grArray = []
    for (let l=0;l<ocrResults.goods_receipt.materials.length;l++){
        var jsonMaterial = {
            gr_number : ocrResults.goods_receipt.no_gr,
            po_number : ocrResults.goods_receipt.no_po,
            ref_document_number : ocrResults.goods_receipt.no_ref_document_aka_delivery_notes,
            gr_date : ocrResults.goods_receipt.goods_receipt_date,
            vendor_name : ocrResults.goods_receipt.nama_vendor,
            material_code : ocrResults.goods_receipt.materials[l].material_code,
            ref_part_no : ocrResults.goods_receipt.materials[l].ref_part_no,
            material_name : ocrResults.goods_receipt.materials[l].material_name,
            quantity : ocrResults.goods_receipt.materials[l].qty,
            qty_description : ocrResults.goods_receipt.materials[l].qty_desc
        }
        grArray.push(jsonMaterial)
    }

    // sending the data to excel file
    export_to_excel([
        invoiceArray,
        grArray,
        poArray
    ], ["invoice_material_records","gr_records","po_material_records"])

    res.send("Excel Successfully Exported!")
})
