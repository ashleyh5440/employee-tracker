INSERT INTO department(dept_name) 
VALUES
("Marketing"),
("Design"),
("IT"),
("Editing");

INSERT INTO roles(job_title, salary, department_id)
VALUES
("Writer", 50000, 4),
("Designer", 55000, 2),
("Developer", 60000, 3),
("Brand Manager", 60000, 1);

INSERT INTO employees(first_name, last_name, role_id, manager_id) 
VALUES
("Nani", "Akbar", 3, NULL),
("Roman", "Jeferson", 5, 1),
("Kai", "Williams", 2, 1),
("Josh", "Lee", 6, 1),
("Jean", "Black", 1, NULL),
("Simon", "Smith", 4, 1);
