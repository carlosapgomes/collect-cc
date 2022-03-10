// This file insert users from a csv file containing
// name,profBoardName,licenceNumber

const path = require('path');
const csvjson = require('csvjson');
const fs = require('fs');
const { DateTime } = require('luxon');
const sqlite3 = require('sqlite3').verbose();

const toLowercaseAndNormalForm = (str)=> {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

const filename = process.argv[2];
if (!filename){
  console.log('missing argument (file name)');
  console.log('Usage: copy team file to this folder and execute:');
  console.log('node ./bulkInsertUsers filename.csv');
  console.log('first line of filename.csv must be: `name,profBoardName,licenceNumber`');
  console.log('and the rest of the file should follow this same format');
  process.exit(1);
}

const data = fs.readFileSync(path.join(__dirname, filename), { encoding : 'utf8'});
var options = {
  delimiter : ',', 
};
const team = csvjson.toObject(data, options);

const now = DateTime.utc().toFormat('yyyy-LL-dd HH:mm:ss.SSS ZZ');
console.log(now);
const db = new sqlite3.Database('../collect.sqlite');
team.forEach(u => {
  console.log(u);
  if (( typeof u.name !== 'undefined' ) && 
    (typeof u.licenceNumber !== 'undefined') &&
    (typeof u.profBoardName !== 'undefined')){
    const userNameParts = u.name.split(' ');
    let username;
    if (userNameParts.length > 1){
      username = toLowercaseAndNormalForm(userNameParts[0] + 
        '.' + userNameParts[userNameParts.length - 1] );
    }else{
      username = u.name + Math.random().toString(16).substr(2, 8);
    }
    console.log(`inserting: ${u.name} - 
      ${u.licenceNumber} - 
      ${username} -
      ${u.profBoardName}`);
    db.run(`INSERT INTO users(
    name,
    email,
    phone,
    username,
    password,
    isAdmin,
    isListingEnabled,
    isLoginEnabled,
    changePassword,
    profBoardName,
    licenceNumber,
    createdAt,
    updatedAt)
    VALUES(
    '${u.name}',
    '',
    '',
    '${username}',
    'password',
    0,
    1,
    0,
    0,
    '${u.profBoardName}',
    '${u.licenceNumber}',
    '${now}',
    '${now}')`, function(err) {
      if (err) {
        return console.log(err.message);
      }
    });
  }
});
db.close();




