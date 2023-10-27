const request = require('supertest');
const app = require('../index');
const dotenv = require('dotenv');
const Project = require('../models/Project');

dotenv.config();

describe('Create Project Endpoint', () => {

    const project = {
        "company_id": 1,
        "title": "Primer proyecto",
        "description": "Descripcion basica de mi primer proyecto",
        "soft_skills": ["Trabajo en equipo", "Buena comunicación"],
        "hard_skills": ["Python", "SQL"],
        "roles": ["Product manager", "Junior Programmer"]
    }

    let appServer = {}

    beforeAll(async () => {
        appServer = await app.listen(3001);

        // Wait for database connection to be established before running tests
        await new Promise(r => setTimeout(r, 3000));
    });

    afterAll(async () => {
        await appServer.close();
    })

    it('should return 201 when a project is created', async () => {
        const res = await request(app)
            .post('/projects/')
            .send(project);

        expect(res.statusCode).toEqual(201);
    })

    it('should return a 400 when missing required fields', async () => {
        const res = await request(app)
            .post('/projects/')
            .send({
                title: 'Uncompleted project',
            });

        expect(res.statusCode).toEqual(400);
    })

    it('should return a 500 error when there is an error during user login', async () => {
        const mockError = new Error('Mock error message');

        // Replace the create function with a mock that throws an error
        const originalCreate = Project.create;
        Project.create = jest.fn(() => {
            throw mockError;
        });

        // Send a request to the login route
        const response = await request(app)
            .post('/projects/')
            .send(project);

        // Restore the original create function
        Project.create = originalCreate;

        // Assertions
        expect(response.status).toBe(500); // Check for a 500 status code

    });

    it('should return a 200 when checking the health of the endpoint', async () => {
        const res = await request(app)
            .get('/projects/ping');

        expect(res.statusCode).toEqual(200);
    })
});