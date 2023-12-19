const inquirer = require("inquirer");
const db = require("./db/connection");
const util = require("util");
const { log } = require("console");

db.query = util.promisify(db.query);

//questions for user
function app() {
inquirer
  .prompt([
      {
        type: 'list',
        name: 'prompt',
        message: "What would you like to do?",
        choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee role", "Quit"]
      },
  ])
  .then((answers) => {
    if(answers.prompt === "View all departments"){
        viewDepartments()
    }else if(answers.prompt === "View all roles"){
        viewRoles()
    }else if(answers.prompt === "View all employees"){
        viewEmployees()
    }else if(answers.prompt === "Add a department"){
        addDepartment()
    }else if(answers.prompt === "Add a role"){
        addRole()
    }else if(answers.prompt === "Add an employee"){
       addEmployee()
    }else if(answers.prompt === "Update an employee role"){
        updateRole()
    }else {db.end()} // closes app
   })
}

//function to view all departments
async function viewDepartments() {
    const departments = await db.query("SELECT * FROM department")
    console.table(departments)
    app() 
}

//function to view all roles
async function viewRoles(){
    const roles = await db.query("SELECT roles.job_title, roles.salary, department.dept_name FROM roles JOIN department ON roles.department_id = department.id")
    console.table(roles);
    app();
}

//function to view all employees
async function viewEmployees(){
    const sql = `SELECT employees.id, employees.first_name AS "first name", employees.last_name AS "last name", roles.job_title, department.dept_name AS department, roles.salary, concat(manager.first_name, " ", manager.last_name) AS manager FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN department ON roles.department_id = department.id LEFT JOIN employees manager ON manager.id = employees.manager_id`
    const employees = await db.query(sql);
    console.table(employees);
    app();
}

//function to add a department
async function addDepartment() {
    try {
        const response = await inquirer.prompt([
            {
                type: 'input',
                name: 'dept_name',
                message: "Please enter the department name:",
            },
        ]);

        const departmentName = response.dept_name;
        
        await db.query("INSERT INTO department SET ?", { dept_name: departmentName });

        console.log("Department added successfully!");
    } catch (error) {
        console.error("Error adding department:", error);
    } finally {
        app();
    }
}

//function to add a role
async function addRole() {
   const rows = await db.query("SELECT * FROM department")

   const departmentChoices = await rows.map(({ id, dept_name }) => ({
    name: dept_name,
    value: id
  }));
    try {
        const response = await inquirer.prompt([
            {
                type: 'input',
                name: 'role_name',
                message: "Please enter the role name:",
            },
            {
                type: 'list',
                name: 'salary',
                message: "Please enter the salary for the role:",
                choices: ["50000", "55000", "60000", "65000"]
            },
            {
                type: 'list',
                name: 'department',
                message: "Please enter the department for the role:",
                choices: departmentChoices
            },
        ]);
        
    const { role_name, salary, department } = response;

    await db.query("INSERT INTO roles SET ?", { job_title: role_name, salary: salary, department_id: department }); //have to use map?

    console.log("New role added successfully!");
    } catch (error) {
        console.error("Error adding new role:", error);
    } finally {
        app();
    }
}

//function to add an employee
async function addEmployee(){
    const roles = await db.query("SELECT id as value, job_title as name FROM roles") //makes a name value array of job title + id
    let managers = await db.query("SELECT id as value, concat (employees.first_name, ' ', employees.last_name) as name FROM employees")
    managers = [{
        name: "No manager",
        value: null
    }, ...managers]
    const answers = await inquirer.prompt ([
        { type: 'input',
        name: 'first_name',
        message: "Please enter the employee's first name.",
        },
        { type: 'input',
        name: 'last_name',
        message: "Please enter the employee's last name.",
        },
        { type: 'list',
        name: 'role_id',
        message: "What is the employee's role?",
        choices: roles },
        { type: 'list',
        name: 'manager_id',
        message: "Who is the employee's manager?",
        choices: managers }, 
    ])
    app();
}

//function to update a role
async function updateRole() {
    try {
        // Get a list of employees to choose from
        const employees = await db.query("SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employees");
        console.log(employees);

        // employee to update 
        const employeeToUpdate = await inquirer.prompt([
            {
                type: 'list',
                name: 'employee_id',
                message: "Select the employee whose role you want to update:",
                choices: employees.map(employee => ({
                    name: employee.name,
                    value: employee.id
                }))
            }
        ]);
        console.log(employees);

        //user enters new role
        const newRole = await inquirer.prompt([
            {
                type: 'input',
                name: 'new_role',
                message: "Enter the new role for the employee:"
            }
        ]);

        let roleId = await db.query(`SELECT id FROM roles WHERE job_title = "${newRole.new_role}";`);
        console.log(roleId)
        // updates role in database
        await db.query("UPDATE employees SET role_id = ? WHERE id = ?", [roleId.id, employeeToUpdate.employee_id]);

        console.log("Employee role updated successfully!");
    } catch (error) {
        console.error("Error updating employee role:", error);
    } finally {
        app();
    }
}
app();