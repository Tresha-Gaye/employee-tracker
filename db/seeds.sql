INSERT INTO department (name)
VALUES  ('Human Resources'),
        ('Legal'),
        ('Finance'),
        ('Technology');

INSERT INTO role (title, salary, department_id)
VALUES  ('General Manager', '15000.00', '1'),
        ('Associate', '5000.00', '2'),
        ('Developer', '9000.00', '4'),
        ('General Counsel', '12000.00', '2'),
        ('Accountant', '6500.00', '3'),
        ('Secretary', '4500.00', '1'),
        ('IT Manager', '12000.00', '4');
        
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ('John', 'Hancock', '1', NULL),
        ('Tiny', 'Diamond', '4', '1'),
        ('Vicky', 'Oh', '7', '1'),
	    ('Lucy', 'Law', '2', '2'),
        ('Minnie', 'Mall', '3', '3'),
        ('Judy', 'Williams', '3', '3'),
        ('Theo', 'Sunday', '5', '1'),
        ('Fred', 'Reddy', '6', '1'),
        ('Joe', 'Maggio', '2', '4'),
        ('Max', 'Payne', '3', '3');
        