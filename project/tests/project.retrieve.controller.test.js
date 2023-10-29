const request = require('supertest');
const app = require('../index');
const dotenv = require('dotenv');
const Project = require('../models/Project');

dotenv.config();

describe('Create Project Endpoint', () => {

    const project = {
        "company_id": 2,
        "title": "Primer proyecto",
        "description": "Descripcion basica de mi primer proyecto",
        "soft_skills": ["Trabajo en equipo", "Buena comunicación"],
        "hard_skills": ["Python", "SQL"],
        "roles": ["Product manager", "Junior Programmer"]
    }

    let appServer = {}

    beforeAll(async () => {
        appServer = await app.listen(3001);

        await request(app)
            .post('/projects/')
            .send(project);

        // Wait for database connection to be established before running tests
        await new Promise(r => setTimeout(r, 3000));
    });

    afterAll(async () => {
        await appServer.close();
    })

    it('should return 200 when a project is retrieved', async () => {
        const res = await request(app)
            .get('/projects/companies/2')

        expect(res.statusCode).toEqual(200);
    })
});