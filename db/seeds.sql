INSERT INTO department (name)
VALUES  ('Human Resources'),
        ('Legal'),
        ('Finance'),
        ('Technology');

INSERT INTO role (title, salary, department_id)
VALUES  ('HR Manager', '10000.00', '1'),
        ('Associate', '5000.00', '2'),
        ('Developer', '80000.00', '4'),
        ('Accountant', '6500.00', '3'),
        ('IT Manager', '12000.00', '4');


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ('John', 'Hancock', '1', NULL),
        ('Joe', 'Maggio', '2', '1'),
        ('Lucy', 'Law', '2', '1'),
        ('Tiny', 'Diamond', '2', '1'),
        ('Vicky', 'Oh', '2', '1'),
		('Judy', 'Williams', '4', '5'),
        ('Minnie', 'Mall', '4', '5');