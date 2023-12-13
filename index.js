const inquirer = require("inquirer");
const express = require("express");

//questions for user
inquirer
  .prompt([
      {
        type: 'list',
        name: 'prompt',
        message: "What would you like to do?",
        choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee role"]
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

    }else if(answers.prompt === "View all roles"){

    }else if(answers.prompt === "View all employees"){

    }else if(answers.promt === "Add a department"){
        inquirer
    .prompt([
        {
            type: 'input',
            name: 'new department',
            message: "What is the department name?",
        },
  ])
    }else if(answers.prompt === "Add a role"){
        inquirer
        .prompt([
            {
                type: 'input',
                name: 'role name',
                message: "What is the name of this new role?",
            },
            {
                type: 'input',
                name: 'salary',
                message: "What is the salary for this new role?",
            },
            {
                type: 'input',
                name: 'department',
                message: "What department will this new role be under?",
            }
      ])
    }else if(answers.prompt === "Add an employee"){
        inquirer
        .prompt([
            {
                type: 'input',
                name: 'first name',
                message: "Please enter the employee's first name.",
            },
            {
                type: 'input',
                name: 'last name',
                message: "Please enter the employee's last name.",
            },
            {
                type: 'input',
                name: 'role',
                message: "Please enter the employee's role.",
            },
            {
                type: 'input',
                name: 'manager',
                message: "Please enter the employee's manager.",
            }
      ])
    }else(answers.prompt === "Update an employee role"){

    }
   })