const cTable = require('console.table');
const inquirer = require('inquirer');
const db = require('./db/connection');
const validator = require('validator');
// const validate = require('../utils/validate');

// Start server after db connection
// db.connect function runs startingPoint();

db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    startingPoint();
});

const validate = {
    validateString(str) {
      return str !== '' || 'Please enter a valid response!';
    },
    validateSalary(num) {
      if (validator.isDecimal(num)) return true;
      return 'Please enter a valid salary!';
    },
    isSame(str1, str2) {
      if (str1 === str2) return true;
    }
  };

function startingPoint() {
    inquirer.prompt({
        type: "list",
        name: "choices",
        message: "what do you want to do?",
        choices: [
            { name: "View all departments", value: "dept_list" },
            { name: "View all roles", value: "role_list" },
            { name: "View all employees", value: "employee_data" },
            { name: "Add a department", value: "add_dept" },
            { name: "Add a role", value: "add_role" },
            { name: "Add an employee", value: "add_employee" },
            { name: "Update an employee role", value: "update_emp_role" },
            { name: "Update employee managers", value: "update_emp_mgr" },
            { name: "View employees by manager", value: "view_by_mgr" },
            { name: "View employees by department", value: "view_by_dept" },
            { name: "Delete a department", value: "delete_dept" },
            { name: "Delete a role", value: "delete_role" },
            { name: "Delete an employee", value: "delete_employee" },
            { name: "View combined salaries of all employees in a department", value: "view_salaries" },
            { name: "Exit" }
        ]
    }).then((answers) => {
        const {choices} = answers;
                console.log(answers);

            if (choices === "dept_list") {
                viewDepts()
            }

            if (choices === "role_list") {
                viewRoles()
            }

            if (choices === "employee_data") {
                viewEmployees()
            }

            if (choices === "add_dept") {
                addNewDept()
            }

            if (choices === "add_role") {
                addNewRole()
            }

            if (choices === "add_employee") {
                addNewEmployee()
            }
      });
}


// function to view departments
const viewDepts = () => {
    const sql = `SELECT department.id AS id, department.name AS department FROM department`;
    db.query(sql, (err, res) => {
        if(err) throw err; 
        console.log("")
        console.table(res);
        startingPoint();
    });
};

// function to view all roles
const viewRoles = () => {
    const sql =   `SELECT role.id, role.title, role.salary, department.name AS department
                  FROM role
                  JOIN department ON role.department_id = department.id`;
    db.query(sql, (err, res) => {
        if(err) throw err; 
        console.table(res);
        startingPoint();
    });
};

// function to view all employees
const viewEmployees = () => {
    const sql =   `SELECT employee.id, employee.first_name, employee.last_name, role.title, 
                    department.name AS 'department', role.salary, employee.manager_id AS 'manager id'
                    FROM employee, role, department 
                    WHERE department.id = role.department_id 
                    AND role.id = employee.role_id
                    ORDER BY employee.id ASC`;
    db.query(sql, (err, res) => {
        if(err) throw err; 
        console.table(res);
        startingPoint();
    });
};

// function to add a new department
const addNewDept = () => {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'addedDept',
          message: 'What is the name of your new Department?',
        }
      ])
      .then((answer) => {
            const sql =    `INSERT INTO department (name) VALUES (?)`;
            const params = [answer.addedDept];
            db.query(sql, params, (err, res) => {
                if(err) throw err; 
                console.table(res);
                viewDepts();
            });
      });
};


// function to add a new employee
const addNewEmployee = () => {
    inquirer.prompt([
      {
        type: 'input',
        name: 'firstName',
        message: "What is the employee's first name?",
        validate: addFirstName => {
          if (addFirstName) {
              return true;
          } else {
              console.log('Please enter a first name');
              return false;
          }
        }
      },
      {
        type: 'input',
        name: 'lastName',
        message: "What is the employee's last name?",
        validate: addLastName => {
          if (addLastName) {
              return true;
          } else {
              console.log('Please enter a last name');
              return false;
          }
        }
      }
    ])
      .then(answer => {
      const newEmpData = [answer.firstName, answer.lastName]
      const roleSql = `SELECT role.id, role.title FROM role`;
      db.query(roleSql, (err, res) => {
        if(err) throw err; 
        // console.table(res);
        const roles = res.map(({ id, title }) => ({ name: title, value: id }));
        inquirer.prompt([
              {
                type: 'list',
                name: 'role',
                message: "What is the employee's role?",
                choices: roles
              }
            ])
              .then(roleChoice => {
                const role = roleChoice.role;
                newEmpData.push(role);
                const managerSql =  `SELECT * FROM employee`;
                db.query(managerSql, (err, res) => {
                    if(err) throw err; 
                  const managers = res.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
                  inquirer.prompt([
                    {
                      type: 'list',
                      name: 'manager',
                      message: "Who is the employee's manager?",
                      choices: managers
                    }
                  ])
                    .then(managerChoice => {
                      const manager = managerChoice.manager;
                      newEmpData.push(manager);
                      const sql =   `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                    VALUES (?, ?, ?, ?)`;
                      db.query(sql, newEmpData, (err, res) => {
                        if(err) throw err; 
                        console.log("Employee has been added!");
                        console.table(res);
                        viewEmployees();
                });
              });
            });
          });
       });
    });
};


// function to add a new role
const addNewRole = () => {
    const deptSql = `SELECT * FROM department`;
    db.query(deptSql, (err, res) => {
        if(err) throw err; 

        let departmentArray = [];
        res.forEach((department) => {departmentArray.push(department.name);});
        departmentArray.push('Create Department');

        inquirer
            .prompt([
                {
                type: 'input',
                name: 'deptRole',
                message: 'Which department is this new role located?',
                choices: departmentArray
                }
            ])
            .then((answer) => {
                if (answer.deptRole === 'Create Department') {
                    this.addNewDept();
                  } else {
                    roleData(answer);
                  }
                });

                const roleData = (departmentData) => {
                    inquirer
                      .prompt([
                        {
                          type: 'input',
                          name: 'newRole',
                          message: 'What is the name of your new role?',
                          validate: validate.validateString
                        },
                        {
                          type: 'input',
                          name: 'newSalary',
                          message: 'What is the salary of this new role?',
                          validate: validate.validateSalary
                        }
                      ])
                      .then((answer) => {
                        const addedRole = answer.newRole;
                        const departmentId;
            
                        res.forEach((department) => {
                          if (departmentData.departmentName === department.name) {
                              departmentId = department.id;
                            }
                        });
                        
                       
                        const sql =   `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
                        const newRoleData = [answer.newRole, answer.newSalary, departmentId];
                        departmentArray.push(newRoleData);

                        db.query(sql, newRoleData, (err, res) => {
                            if(err) throw err; 
                            console.log("New role, "  +  newRoleData + " has been added");
                            console.table(res);
                            viewRoles();
                        });
                      });
                };
    });
};


// if statements // while loop
// last questions = exit program? while 'exist_program' = fase un program again
// onc enquiruer starts asking it will not wait, if asking questions & expecting something to happen
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

    //try thi =s for managers

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

    // const viewEmployeesByManager = async () => {
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