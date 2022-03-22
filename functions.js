const inquirer = require('inquirer');
const db = require('./db/connection');
const validator = require('validator');
const validate = require('./utils/validate');


// function to intialize the server
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
            { name: "Exit" }
        ]
    }).then(async(answers) => {
        const {choices} = answers;
                console.log(answers);

            if (choices === "dept_list") {
              await viewDepts()
            }

            if (choices === "role_list") {
              await viewRoles()
            }

            if (choices === "employee_data") {
                await viewEmployees()
            }

            if (choices === "add_dept") {
              await addNewDept()
            }

            if (choices === "add_role") {
              await addNewRole()
            }

            if (choices === "add_employee") {
                await addNewEmployee()
            }

            if (choices === "update_emp_role") {
                await updateEmpRole()
            }
     
      })
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
                console.log("New department, "  +  params + ", has been added");
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
        if(err) {
            throw err;
        };
        let departmentArray = [];
        res.forEach((department) => {departmentArray.push( 
          {
            name: department.name,
            value: department.id
          }
        );});

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
                        },
                        {
                          type: 'list',
                          name: 'newDept',
                          message: 'What department is the role in?',
                          choices: departmentArray
                        }
                      ])
                      .then((answer) => {
                        console.log(answer)

                        const addedRole = answer.newRole;
                        const sql =   `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
                        const newRoleData = [addedRole, answer.newSalary, answer.newDept];

                        db.query(sql, newRoleData, (err, res) => {
                            if(err) throw err; 
                            console.log("New role, "  +  addedRole + ", has been added");
                            startingPoint();
                        });
                      });
        });
    };


// Update an Employee's Role
const updateEmpRole = () => {
    let sql =       `SELECT employee.id, employee.first_name, employee.last_name, role.id AS "role_id"
                    FROM employee, role, department WHERE department.id = role.department_id AND role.id = employee.role_id`;
    db.query(sql, (error, emplData) => {
      if (error) throw error;
      let employeeNamesArray = [];
      emplData.forEach((employee) => {employeeNamesArray.push(`${employee.first_name} ${employee.last_name}`);});

      let sql =     `SELECT role.id, role.title FROM role`;
      db.query(sql, (error, response) => {
        if (error) throw error;
        let rolesArray = [];
        response.forEach((role) => {rolesArray.push(role.title);});

        inquirer
          .prompt([
            {
              name: 'chosenEmployee',
              type: 'list',
              message: 'Which employee has a new role?',
              choices: employeeNamesArray
            },
            {
              name: 'chosenRole',
              type: 'list',
              message: 'What is their new role?',
              choices: rolesArray
            }
          ])
          .then((answer) => {
            let newTitleId, employeeId;
            console.log(response);
            response.forEach((role) => {
              if (answer.chosenRole === role.title) {
                newTitleId = role.id;
              }
            });

            emplData.forEach((employee) => {
              if (
                answer.chosenEmployee ===
                `${employee.first_name} ${employee.last_name}`
              ) {
                employeeId = employee.id;
              }
            });
            console.log("this is the new", employeeId)
            console.log("this is the new", newTitleId)
            let sqls =    `UPDATE employee SET employee.role_id = ? WHERE employee.id = ?`;
            db.query(
              sqls,
              [newTitleId, employeeId],
              (error) => {
                if (error) throw error;
                console.log("Role has been updated");
                startingPoint();
              }
            );
          });
      });
    });
  };

module.exports = {
    startingPoint
};