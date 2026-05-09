const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('/Users/aditi/Downloads/Invoice_No_395_Dt_06122024 Original for Recipient.pdf');

pdf(dataBuffer).then(function(data) {
    console.log(data.text);
});
