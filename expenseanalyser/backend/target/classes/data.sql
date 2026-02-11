INSERT INTO employees (first_name, last_name, email, department)
VALUES ('John', 'Doe', 'john.doe@example.com', 'Engineering')
ON CONFLICT (email) DO NOTHING;

INSERT INTO employees (first_name, last_name, email, department)
VALUES ('Jane', 'Smith', 'jane.smith@example.com', 'Marketing')
ON CONFLICT (email) DO NOTHING;

