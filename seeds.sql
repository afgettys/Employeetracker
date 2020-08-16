SELECT * FROM employee;
SELECT * FROM department;
SELECT * FROM role;

INSERT INTO employee (first_name, last_name, role_id, manager_id) values ('Leslie', 'Knope', 1, NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id) values ('Tom', 'Haverford', 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) values ('April', 'Ludgate', 3, 9);
INSERT INTO employee (first_name, last_name, role_id, manager_id) values ('Andy', 'Dwyer', 4, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id) values ('Ann', 'Perkins', 5, NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id) values ('Ben', 'Wyatt', 6, NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id) values ('Chris', 'Traeger', 7, 6);


INSERT INTO department (name) values ("TI");
INSERT INTO department (name) values ("International Affairs");
INSERT INTO department (name) values ("Sales");
INSERT INTO department (name) values ("Operations");

INSERT INTO role (title, salary, department_id) values ("Software Engineer", 150000.00,1);
INSERT INTO role (title, salary, department_id) values ("Legal Director",18000.00,2);
INSERT INTO role (title, salary, department_id) values ("Sales Analyst",70000.00,3);
INSERT INTO role (title, salary, department_id) values ("DevOps I",130000.00,1);
INSERT INTO role (title, salary, department_id) values ("National Sales Coordinator",175000.00,3);
INSERT INTO role (title, salary, department_id) values ("Project Manager",80000.00,4);
INSERT INTO role (title, salary, department_id) values ("Executive Assistant", 60000.00,4);

