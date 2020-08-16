const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password123",
  database: "employee_db",
});

connection.connect(function (err) {
  if (err) {
    return console.error("error:" + err.message);
  } else console.log("Employee Tracker");
});

function init() {
  inquirer
    .prompt({
      name: "choices",
      type: "list",
      message: "Please select task",
      choices: ["Add", "View", "Update", "Exit"],
    })
    .then((answer) => {
      if (answer.choices === "Add") {
        add();
      } else if (answer.choices === "View") {
        view();
      } else if (answer.choices === "Update") {
        update();
      } else {
        console.log("Exiting");
        return process.exit(0);
      }
    });
}

function add() {
  inquirer
    .prompt({
      name: "choices",
      type: "list",
      message: "Please select what to add:",
      choices: ["Department", "Role", "Employee", "Manager"],
    })
    .then((answer) => {
      if (answer.choices === "Department") {
        addDepartment();
      } else if (answer.choices === "Role") {
        addRole();
      } else if (answer.choices === "Employee") {
        addEmployee();
      } else {
        addManager();
      }
    });
}

function view() {
  inquirer
    .prompt({
      name: "choices",
      type: "list",
      message: "please select what you would like to view",
      choices: ["Departments", "Roles", "Employees", "Employees by Manager"],
    })
    .then((answer) => {
      if (answer.choices === "Departments") {
        viewDepartments();
      } else if (answer.choices === "Roles") {
        viewRoles();
      } else if (answer.choices === "Employees") {
        viewEmployees();
      } else {
        viewEmployeesByManager();
      }
    });
}

function update() {
  inquirer
    .prompt({
      name: "choices",
      type: "list",
      message: "Please select what to update:",
      choices: ["Employee Role", "Employee Manager"],
    })
    .then((answer) => {
      if (answer.choices === "Employee Role") {
        updateRole();
      } else {
        updateManager();
      }
    });
}
function addDepartment() {
  inquirer
    .prompt({
      name: "department",
      type: "input",
      message: "Please input department to be added:",
    })
    .then((answer) => {
      const query = `INSERT INTO department (name) VALUES ("${answer.department}")`;
      connection.query(query, (err, res) => {
        if (err) throw err;
        init();
      });
    });
}
function addRole() {
  const query = "SELECT * FROM department";
  let departments = [];
  connection.query(query, (err, res) => {
    if (err) throw err;
    for (i = 0; i < res.length; i++) {
      departments.push(res[i].name);
    }

    inquirer
      .prompt([
        {
          name: "role",
          type: "input",
          message: "Please input a role:",
        },
        {
          name: "salary",
          type: "input",
          message: "Please input role's salary:",
        },
        {
          name: "department",
          type: "list",
          message: "Please select department:",
          choices: departments,
        },
      ])
      .then((answer) => {
        const depQuery = `SELECT * FROM department WHERE name = "${answer.department}"`;
        connection.query(depQuery, (err, result) => {
          if (err) throw err;
          let depID = parseInt(result[0].id);

          const query = `INSERT INTO roles (title, salary, department_id) VALUES ("${
            answer.role
          }", "${parseInt(answer.salary)}", "${depID}")`;
          connection.query(query, (err, res) => {
            if (err) throw err;
            init();
          });
        });
      });
  });
}

function addEmployee() {
  const roleQuery = "SELECT * FROM roles";
  let roles = [];
  connection.query(roleQuery, (err, result) => {
    if (err) throw err;
    for (i = 0; i < result.length; i++) {
      roles.push({ name: result[i].title, value: result[i].id });
    }

    const managerQuery = "SELECT * FROM employee";
    let managers = [];
    connection.query(managerQuery, (err, res) => {
      if (err) throw err;

      for (i = 0; i < res.length; i++) {
        managers.push({
          name: res[i].first_name + " " + res[i].last_name,
          value: res[i].id,
        });
      }

      inquirer
        .prompt([
          {
            name: "first",
            type: "input",
            message: "Please inform employee first name",
          },
          {
            name: "last",
            type: "input",
            message: "Please inform employee last name",
          },
          {
            name: "role",
            type: "list",
            message: "Please select employee's role",
            choices: roles,
          },
          {
            name: "manager",
            type: "list",
            message: "Please select employee's manager",
            choices: managers,
          },
        ])
        .then((answer) => {


              const query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${answer.first}", "${answer.last}", "${answer.role}", "${answer.manager}")`;
              connection.query(query, (event, r) => {
                if (event) throw event;
                init();
              });
          
          ;
        });
    });
  });
}

function viewDepartments() {
  const query = "SELECT * FROM department";
  connection.query(query, (err, res) => {
    if (err) throw err;
    let depTable = [];
    res.forEach((dep) =>
      depTable.push({
        id: dep.id,
        name: dep.name,
      })
    );
    console.log();
    console.table(depTable);
    init();
  });
}

function viewRoles() {
  const query = "SELECT * FROM roles";
  connection.query(query, (err, res) => {
    if (err) throw err;
    let roleTable = [];
    res.forEach((role) =>
      roleTable.push({
        id: role.id,
        title: role.title,
        salary: role.salary,
        "dep id": role.department_id,
      })
    );
    console.log();
    console.table(roleTable);
    init();
  });
}

function viewEmployees() {
  const query = `
    SELECT e1.id, e1.first_name, e1.last_name, role.title, department.name department, role.salary, CONCAT(e2.first_name, " ", e2.last_name) manager FROM employee e1
    LEFT JOIN role ON e1.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee e2 ON e2.id = e1.manager_id;
    `;
  connection.query(query, (err, res) => {
    if (err) throw err;
    let empTable = [];
    res.forEach((emp) =>
      empTable.push({
        id: emp.id,
        "first name": emp.first_name,
        "last name": emp.last_name,
        role: emp.title,
        salary: emp.salary,
        manager: emp.manager,
      })
    );
    console.log();
    console.table(empTable);
    init();
  });
}

function viewEmployeesByManager() {
  const query = `
  SELECT CONCAT(e1.first_name, " ", e1.last_name) manager, e2.id, e2.first_name, e2.last_name, role.title, department.name department, role.salary FROM employee e2
  INNER JOIN employee e1 ON e1.id = e2.manager_id
  LEFT JOIN role ON e2.role_id = role.id
  LEFT JOIN department ON role.department_id = department.id
  ORDER BY manager ASC;
  `;
  connection.query(query, (err, res) => {
    if (err) throw err;
    let empTable = [];
    res.forEach((emp) =>
      empTable.push({
        id: emp.id,
        "first name": emp.first_name,
        "last name": emp.last_name,
        role: emp.title,
        salary: emp.salary,
        manager: emp.manager,
      })
    );
    console.log();
    console.table(empTable);
    init();
  });
}
function updateRole() {
  const empQuery = "SELECT * FROM employee";
  let employees = [];
  connection.query(empQuery, (err, res) => {
    if (err) throw err;
    for (i = 0; i < res.length; i++) {
      employees.push(res[i].first_name + " " + res[i].last_name);
    }

    const roleQuery = "SELECT * FROM role";
    let roles = [];
    connection.query(roleQuery, (err, res) => {
      if (err) throw err;
      for (i = 0; i < res.length; i++) {
        roles.push(res[i].title);
      }

      inquirer
        .prompt([
          {
            name: "employee",
            type: "list",
            message: "Please select employee to edit role:",
            choices: employees,
          },
          {
            name: "role",
            type: "list",
            message: "Please select new role",
            choices: roles,
          },
        ])
        .then((answer) => {
          const roleQuery = `SELECT * FROM role WHERE title = "${answer.role}"`;
          connection.query(roleQuery, (err, res) => {
            if (err) throw err;
            let roleID = parseInt(res[0].id);

            const empQuery = `SELECT * FROM employee WHERE CONCAT (first_name, " ", last_name) = "${answer.employee}"`;
            connection.query(empQuery, (err, res) => {
              if (err) throw err;
              let empID = parseInt(res[0].id);

              const query = `UPDATE employee SET role_id = ${roleID} WHERE id = ${empID}`;
              connection.query(query, (event, r) => {
                if (event) throw event;
                init();
              });
            });
          });
        });
    });
  });
}

function updateManager() {
  const employeeQuery = "SELECT * FROM employee";
  let employees = [];
  connection.query(employeeQuery, (err, res) => {
    if (err) throw err;
    for (i = 0; i < res.length; i++) {
      employees.push(res[i].first_name + " " + res[i].last_name);
    }

    const managerQuery = "SELECT * FROM employee";
    let managers = [];
    connection.query(managerQuery, (err, res) => {
      if (err) throw err;
      for (i = 0; i < res.length; i++) {
        managers.push(res[i].first_name + " " + res[i].last_name);
      }

      inquirer
        .prompt([
          {
            name: "employee",
            type: "list",
            message: "Please select employee to have new manager",
            choices: employees,
          },
          {
            name: "manager",
            type: "list",
            message: "Please select new manager:",
            choices: managers,
          },
        ])
        .then((answer) => {
          const mgrQuery = `SELECT * FROM employee WHERE CONCAT (first_name, " ", last_name) = "${answer.manager}"`;
          connection.query(mgrQuery, (err, res) => {
            if (err) throw err;
            let mgrID = parseInt(res[0].id);

            const empQuery = `SELECT * FROM employee WHERE CONCAT (first_name, " ", last_name) = "${answer.employee}"`;
            connection.query(empQuery, (err, res) => {
              if (err) throw err;
              let empID = parseInt(res[0].id);

              const query = `UPDATE employee SET manager_id = ${mgrID} WHERE id = ${empID}`;
              connection.query(query, (e, r) => {
                if (e) throw e;
                init();
              });
            });
          });
        });
    });
  });
}

init();
