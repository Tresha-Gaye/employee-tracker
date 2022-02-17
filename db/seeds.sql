INSERT INTO department (name)
VALUES  ('Human Resources'),
        ('Legal');

INSERT INTO role (title, salary, department_id)
VALUES  ('Manager', '10000.00', '1'),
        ('Associate', '5000.00', '2');

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ('John', 'Hancock', '1', NULL),
        ('Joe', 'DiMaggio', '1', '1');