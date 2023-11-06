import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const XLSX = require('xlsx');
const fs = require('fs');

export function export_to_excel(jsonData, sheetTitle){
  // Create a new workbook
  const wb = XLSX.utils.book_new();
  
  for (let i=0;i<sheetTitle.length;i++){
      // Convert the JSON data to a worksheet
      const ws = XLSX.utils.json_to_sheet(jsonData[i]);

      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(wb, ws, sheetTitle[i]);
  }

  // Write the workbook to a file
  XLSX.writeFile(wb, 'ocr_data_preview.xlsx');
  
  console.log('Excel file created!');
  
}

// var jsonData = [[
//   {
//     no_gr: '5001797087',
//     goods_receipt_date: '04.10.2023',
//     no_ref_document_aka_delivery_notes: '111/13435/09/23',
//     nama_vendor: 'Surya Biru Murni Acetylene, PT',
//     no_po: '8500228025'
//   },
//   {
//     no_gr: '5001797083',
//     goods_receipt_date: '04.10.2023',
//     no_ref_document_aka_delivery_notes: '111/13433/09/23',
//     nama_vendor: 'Surya Biru Murni Acetylene, PT',
//     no_po: '8500228025'
//   }
// ],[
//   {
//     material_code: '00010',
//     quantity: '700.00',
//     qty_desc: 'BT',
//     ref_part_no: 'G00000000000037406',
//     unit_price: '287,650',
//     ext_price: '201,355,000',
//     material_name: 'ARGON:GAS MIX;AR BALANCE,CO2 23%;150BAR'
//   },
//   {
//     material_code: '00020',
//     quantity: '500.00',
//     qty_desc: 'BT',
//     ref_part_no: 'G00000000000037405',
//     unit_price: '72,100',
//     ext_price: '36,050,000',
//     material_name: 'OXYGEN: GAS; 150BAR; 99. 5%; COLORLESS'
//   },
//   {
//       material_code: '00030',
//       quantity: '320.00',
//       qty_desc: 'BT',
//       ref_part_no: 'G00000000000037411',
//       unit_price: '300,000',
//       ext_price: '96,000,000',
//       material_name: 'ACETYLENE: GAS; 21BAR; 50KG; 74-86-2'
//   }
// ],[
//   {
//     material_name: '3710 MG Gas Acetylene',
//     quantity: '10',
//     qty_units: 'Tog',
//     unit_price: '300.000',
//     price_amount: '3.000.000'
//   },
//   {
//     material_name: '1010 MG Gas Oxygen',
//     quantity: '20',
//     qty_units: 'Tbg',
//     unit_price: '72.100',
//     price_amount: '1.442.000'
//   },
//   {
//     material_name: '7930 MG Gas Argon Mix',
//     quantity: '327',
//     qty_units: 'Tbg',
//     unit_price: '287.650',
//     price_amount: '9.204.800'
//   }
// ]]

// var sheetTitle = ["gr_records","po_material_records","invoice_material_records"]

// export_to_excel(jsonData, sheetTitle)