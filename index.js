const inquirer = require("inquirer");
const db = require("./db/connection");
const util = require("util")

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
    }else {db.end()} // closes app
   })
}

async function viewDepartments() {
    const departments = await db.query("SELECT * FROM department")
    console.table(departments)
    app() 
}

async function viewRoles(){
    const roles = await db.query("SELECT roles.job_title, roles.salary, department.dept_name FROM roles JOIN department ON roles.department_id = department.id")
    console.table(roles);
    app();
}

async function viewEmployees(){
    const sql = `SELECT employees.id, employees.first_name AS "first name", employees.last_name AS "last name", roles.job_title, department.dept_name AS department, roles.salary, concat(manager.first_name, " ", manager.last_name) AS manager FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN department ON roles.department_id = department.id LEFT JOIN employees manager ON manager.id = employees.manager_id`
    const employees = await db.query(sql);
    console.table(employees);
    app();
}

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
//to add a department
// async function addDepartment() {
//     const department = await inquirer.prompt([
//         {
//             type: 'input',
//             name: 'dept_name',
//             message: "Please enter the department name:",
//         },
//     ])
//     await db.query("INSERT INTO department SET ?", department.name); 
// }

function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'dept_name',
            message: "Please enter the department name:",
        },
    ])
    .then(res => {
        const departmentName = res.dept_name; // extracting department name from response
        return db.query("INSERT INTO department SET ?", { dept_name: departmentName });
    })
    .then(() => {
        console.log("Department added successfully!");
        app();
    })
    .catch(error => {
        console.error("Error adding department:", error);
        app();
    });
}
app();