# javascriptOCR

This is a small project used to show the implementation of Javascript OCR package in a node.js website environment  

The project ingest a pdf file based data which consist of various documents eg.
- Purchase Order
- Goods Receipt
- Invoice
- Tax Details
- Delivery Notes

The logic work as follows:
- pdf file converted into multiple .jpg files
- ocr are executed on each .jpg page
- regex is used to identify specific pattern to extract the necessary information
- the extracted information finally displayed in the form of html table and excel file

Ps. For confidential purposes, the file samples are not included in the repository 