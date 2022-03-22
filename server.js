const cTable = require('console.table');
const inquirer = require('inquirer');
const db = require('./db/connection');
const validator = require('validator');
const validate = require('./utils/validate');
const {startingPoint} = require('./functions');

// Start server after db connection
// db.connect function runs startingPoint();
// db.query vs db.promise().query?
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    startingPoint();
});








// if statements // while loop
// last questions = exit program? while 'exist_program' = fase un program again
// once enquiruer starts asking it will not wait, if asking questions & expecting something to happen
// beak up inquirier qiestions into smaller chunks, call different functions
// once code exeuction finishes it will return bac to original while loo
// lots of .thens
// different trees/baths depending on how user responds
// then once all completed, user will bereturned to original while loop (start of function)
// console.log
//console.table
//console.err
//




// try this for update functions
    // function ({ first_name, last_name, manager }) {
    // connection.query("INSERT INTO employee (first_name, last_name, manager) 
    //      VALUES ?", ('first_name', 'last_name', 'manager'), function (err, result) {
    //     if (err) throw err;

    //try this for managers

    // const getManagers = () => {
    //     return new Promise((resolve, reject) => {
    //         connection.query(`SELECT CONCAT(b.first_name, " ", b.last_name) AS Name 
    //         FROM employee a LEFT JOIN employee b
    //         ON a.manager_id = b.id
    //         WHERE a.manager_id IS NOT NULL;`, (err, res) => {
    //             if (err) reject(err);
    //             resolve(res);
    //         });
    //     });
    // }

    // async functions*** look that up
    //const viewEmployeesByManager = async () => {
    //     let choices = await employeeDB_CRUD.getManagers();
    //     console.log(choices);
    //     return new Promise( (resolve, reject) => {
    //         inquirer.prompt([
    //             {
    //                 name: "manager",
    //                 type: "list",
    //                 message: "Please select a department: ",
    //                 choices: choices
    //             }
    //         ]).then( ({ manager }) => {
    //             console.log(manager);
    //             resolve();
    //         });
    //     });
    // }