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

//need to have multiple if/else statements
//if "view departments", show table with department names and ids
//if "view all roles", show job title, role id, the department, and salary 
//if "view all employees", show table with employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
//if "add a department", user enters new department name
//if "add a role", user enters name, salary, and department for new role
//if "add employee", user enters employee’s first name, last name, role, and manager
//if "update", user selects which employee
  .then((answers) => {
    if(answers.prompt === "View all departments"){
        viewDepartments()
    }else if(answers.prompt === "View all roles"){
        viewRoles()
    }else if(answers.prompt === "View all employees"){
        viewEmployees()
    }else if(answers.promt === "Add a department"){

    }else if(answers.prompt === "Add a role"){
        
    }else if(answers.prompt === "Add an employee"){
       
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
    const sql = `SELECT employees.id, employees.first_name AS "first name", employees.last_name 
                    AS "last name", roles.job_title, department.dept_name AS department, roles.salary, 
                    concat(manager.first_name, " ", manager.last_name) AS manager
                    FROM employees
                    LEFT JOIN roles
                    ON employees.role_id = roles.id
                    LEFT JOIN department
                    ON roles.department_id = department.id
                    LEFT JOIN employees manager
                    ON manager.id = employees.manager_id`
    const employees = await db.query(sql);
    console.table(employees);
    app();
}
app();