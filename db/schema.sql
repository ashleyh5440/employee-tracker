DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

--department table
CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    dept_name VARCHAR(30) NOT NULL,
);

-- employee table
CREATE TABLE employees (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NULL,
    role_id INT NOT NULL,
    manager_id INT NOT NULL,
);

-- roles table
CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT,
    job_title VARCHAR(30) NOT NULL,
    salary INT NOT NULL,
    department_id INT NOT NULL,
);