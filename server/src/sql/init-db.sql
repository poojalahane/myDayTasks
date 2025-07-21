-- init-db.sql

-- Create the todos table
CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,
    task_name VARCHAR(255) NOT NULL,
    task_description TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    task_due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed data for the todos table

INSERT INTO todos (task_name, task_description, is_completed, task_due_date)
VALUES 
    ('Buy Groceries', 'Purchase milk, bread, eggs, and vegetables from the supermarket.', FALSE, '2024-12-10T17:00:00+00:00'),
    ('Complete Project Report', 'Finalize and submit the project report to the management team.', FALSE, '2024-12-15T23:59:59+00:00'),
    ('Workout Session', 'Attend the scheduled yoga class at the local gym.', TRUE, '2024-11-30T08:00:00+00:00'),
    ('Book Flight Tickets', 'Reserve tickets for the upcoming vacation to Hawaii.', FALSE, '2024-12-20T12:00:00+00:00'),
    ('Read a Book', 'Finish reading "The Pragmatic Programmer" by Andy Hunt and Dave Thomas.', TRUE, '2024-11-25T20:00:00+00:00'),
    ('Doctor Appointment', 'Annual health check-up at Dr. Smiths clinic.', FALSE, '2024-12-05T10:30:00+00:00'),
    ('Clean the House', 'Deep clean the kitchen, living room, and bathrooms.', TRUE, '2024-11-28T14:00:00+00:00'),
    ('Attend Webinar', 'Join the online webinar on backend development best practices.', FALSE, '2024-12-12T16:00:00+00:00'),
    ('Fix Bug', 'Resolve the login issue reported by users in the authentication module.', FALSE, '2024-12-08T18:00:00+00:00'),
    ('Plan Birthday Party', 'Organize a surprise birthday party for Alex, including venue and catering.', FALSE, '2024-12-22T19:00:00+00:00');
