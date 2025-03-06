CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) CHECK (role IN ('USER', 'RECRUITER')) NOT NULL,
    resumeURL TEXT,
    skills TEXT[] -- Array of skills for USERs
);


CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- e.g., Full-time, Part-time, etc.
    skillsRequired TEXT[], -- Array of required skills for the job
    creator UUID REFERENCES users(id) ON DELETE SET NULL -- Foreign key to RECRUITER
);

CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- Foreign key to USER
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE, -- Foreign key to Job
    recruiter_id UUID REFERENCES users(id) ON DELETE CASCADE, -- Foreign key to RECRUITER (Job Creator)
    status VARCHAR(50) CHECK (status IN ('Pending', 'Accepted', 'Rejected')) NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT now()
);


CREATE INDEX idx_applications_user_id ON applications (user_id);
CREATE INDEX idx_applications_job_id ON applications (job_id);
CREATE INDEX idx_jobs_creator ON jobs (creator);

ALTER TABLE applications
    ADD CONSTRAINT unique_application UNIQUE (user_id, job_id);

-- Inserting a RECRUITER
INSERT INTO users (name, email, password, role)
VALUES ('John Doe', 'john@company.com', 'hashed_password', 'RECRUITER');

-- Inserting a USER
INSERT INTO users (name, email, password, role, skills)
VALUES ('Jane Smith', 'jane@user.com', 'hashed_password', 'USER', '{"JavaScript", "React", "Node.js"}');

-- Inserting a Job
INSERT INTO jobs (title, company, location, type, skills_required, creator)
VALUES ('Frontend Developer', 'Tech Company', 'Remote', 'Full-time', '{"JavaScript", "React"}', (SELECT id FROM users WHERE email = 'john@company.com'));

-- Inserting an Application
INSERT INTO applications (user_id, job_id, status)
VALUES ((SELECT id FROM users WHERE email = 'jane@user.com'), (SELECT id FROM jobs WHERE title = 'Frontend Developer'), 'Pending');
