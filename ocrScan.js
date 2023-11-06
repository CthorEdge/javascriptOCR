// mjs module adjustments
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// importing dependencies
const T = require("tesseract.js");

// function to perform OCR scanning
async function performOCR(directoryName) {
    console.log("Executing OCR Mechanism")
    console.log("=======================")

    const recognized = await T.recognize(directoryName, 'eng').then(function(out) {return out.data.text})
    
    // showing ocr result to console
    
    console.log(recognized)

    return recognized
}

// function to extract po informations
export async function perform_ocr_for_po(poDirectory){
    // performing ocr process
    var recognizedText = await performOCR(poDirectory)

    // Regex Implementation
    const pattern1 = /PURCHASE ORDER No : ([\S| ]*)[\n\S ]*Date : (\S.*) Company\nDelivery date\/week : ([\d|.]*) [\S \n]*Vendor Number : (\d*)/gm
    const result = pattern1.exec(recognizedText)

    // Regex for Identifying Existing Material List 
    const pattern2 = /(\d{5}) — (\d*.\d{2}) (\S*) (G\d*) ([\d,]*) ([\d,]*)\n([\S ]*)/gm
    const result2 = [... recognizedText.matchAll(pattern2)]

    // Iterating Material List to Fit JSON Format
    const arrayMaterial = []
    for(let i=0; i<result2.length; i++){

        const jsonMaterial = {
            "material_code": result2[i][1],
            "quantity" : result2[i][2],
            "qty_desc": result2[i][3],
            "ref_part_no":result2[i][4],
            "unit_price":result2[i][5],
            "ext_price": result2[i][6],
            "material_name": result2[i][7]
        }
        arrayMaterial.push(jsonMaterial)
    }

    // Alternate Return Based on Existing PO Header
    if (result==null){
        console.log(arrayMaterial)
        console.log("==================")
        console.log("OCR Results for PO\n")
        
        return arrayMaterial
    }
    else{
        const jsonRes = {
            "po_number":result[1],
            "po_date": result[2],
            "po_delivery_date":result[3],
            "vendor_number":result[4],
            "materials": arrayMaterial
        }
        console.log(jsonRes)
        console.log("==================")
        console.log("OCR Results for PO\n")
        
        return jsonRes
    }
}

// function to extract gr informations
export async function perform_ocr_for_gr(grDirectory){
    // performing ocr process
    var recognizedText = await performOCR(grDirectory)

    // Regex Implementation
    const pattern = /No. (\d*)[\n\S ]*Goods receipt date : (\d.*)[\n\S ]*Ref[ |.]*Document: ([\d\/]*)[\n\S ]*Name : ([\S ]*)\nPO : (\d*)/
    const result = pattern.exec(recognizedText)

    // Regex for Identifying Existing Material List 
    const pattern2 = /(\d{4}) (\S*) ([\S ]*)\n[\S]* ([\d.]*) (\S*)/gm
    const result2 = [... recognizedText.matchAll(pattern2)]

    // Iterating Material List to Fit JSON Format
    const arrayMaterial = []
    for(let i=0; i<result2.length; i++){

        const jsonMaterial = {
            "material_code": result2[i][1],
            "ref_part_no" : result2[i][2],
            "material_name": result2[i][3],
            "qty":result2[i][4],
            "qty_desc":result2[i][5]
        }
        arrayMaterial.push(jsonMaterial)
    }

    if (result==null){
        return null
    }

    // converting to json format
    const jsonRes = {
        "no_gr":result[1],
        "goods_receipt_date": result[2],
        "no_ref_document_aka_delivery_notes":result[3],
        "nama_vendor":result[4],
        "no_po":result[5],
        "materials":arrayMaterial
    }

    console.log(jsonRes)
    console.log("==================")
    console.log("OCR Results for GR\n")

    return jsonRes
}

// function to extract tax informations
export async function perform_ocr_for_tax(taxDirectory){
    // performing ocr process
    var recognizedText = await performOCR(taxDirectory)

    // Regex Implementation
    // const pattern = /Faktur Pajak : ([\d|.|-]*)\nPengusaha Kena Pajak\nNama : (\S.*)\nAlamat : (\S.*)\nNPWP :(\S*)\nPembeli Barang Kena Pajak \/ Penerima Jasa Kena Pajak\nNama : (\S.*)\nAlamat : ([\S. ]*\n{1}[\S. ]*)\nNPWP : (\S*)/
    const pattern = /Faktur Pajak : ([\d|.|-]*)\nPengusaha Kena Pajak\nNama : (\S.*)\nAlamat : (\S.*)\nNPWP :(\S*)\nPembeli Barang Kena Pajak \/ Penerima Jasa Kena Pajak\nNama : (\S.*)\nAlamat : ([\S. ]*\n{1}[\S. ]*)\nNPWP : (\S*)[\n\S ]*Dasar Pengenaan Pajak (\d.*)\nTotal PPN (\d.*)/gm
    const result = pattern.exec(recognizedText)

    // converting to json format
    const jsonRes = 
            {
                "no_faktur_pajak":result[1],
                "nama_pengusaha_kena_pajak":result[2],
                "alamat_pengusaha_kena_pajak":result[3],
                "npwp_pengusaha_kena_pajak":result[4],
                "nama_pembeli_kena_pajak":result[5],
                "alamat_pembeli_kena_pajak":result[6],
                "npwp_pembeli_kena_pajak":result[7],
                "dasar_pengenaan_pajak":result[8],
                "total_ppn":result[9]
            }

    console.log(jsonRes)
    console.log("===================")
    console.log("OCR Results for Tax\n")

    return jsonRes
}

// function to extract delivery note informations
export async function perform_ocr_for_dn(dnDirectory){
    // performing ocr process
    var recognizedText = await performOCR(dnDirectory)

    // Regex Implementation
    const pattern = /(\d*\/\d*\/\d{2}\/\d{2})/;
    const result = pattern.exec(recognizedText)

    // error handling for unreadable dn values
    if(result==null){
        return null
    } else {
        console.log(result[1])
        console.log("==================")
        console.log("OCR Results for DN\n")

        return result[1]    
    }
}

// function to extract delivery note informations
export async function perform_ocr_for_invoice(invoiceDirectory){
    // performing ocr process
    var recognizedText = await performOCR(invoiceDirectory)

    // Regex Implementation
    const pattern = /PT. SANGGAR SARANA BAJA ([\d|.]*)[ \S\n]*Subtotal (\d.*)[\n\S]* PPN [\d]*% [\d.]*% (\d.*)/gm;
    const result = pattern.exec(recognizedText)

    // Regex for Identifying Existing Material List 
    const pattern2 = /\d (\d{4} [a-zA-Z ]*) (\d*) ?([\S]*) ([\d.]*) \d{2} PPN 11% ([\d.]*)/gm
    const result2 = [... recognizedText.matchAll(pattern2)]

    // Iterating Material List to Fit JSON Format
    const arrayMaterial = []
    for(let i=0; i<result2.length; i++){

        const jsonMaterial = {
            "material_name": result2[i][1],
            "quantity" : result2[i][2],
            "qty_units": result2[i][3],
            "unit_price":result2[i][4],
            "price_amount":result2[i][5]
        }
        arrayMaterial.push(jsonMaterial)
    }

    // converting to json format
    const jsonRes = {
        "invoice_number":result[1],
        "subtotal":result[2],
        "ppn":result[3],
        "invoice_materials":arrayMaterial
    }

    console.log(jsonRes)
    console.log("=======================")
    console.log("OCR Results for Invoice\n")

    return jsonRes
}

// CODE IMPLEMENTATION FOR DEVELOPMENT

// const dirName = "./converted_images/page_4.jpg"

// var result = await performOCR(dirName)
// var result = await perform_ocr_for_gr(dirName)
// var result = await perform_ocr_for_tax(dirName)
// var result = await perform_ocr_for_po(dirName)
// var result = await perform_ocr_for_invoice(dirName)

// console.log(result)
// console.log(result.faktur_pajak[0].no_faktur_pajak)
// console.log(typeof(result))