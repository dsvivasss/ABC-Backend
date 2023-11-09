const request = require('supertest');
const app = require('../index');
const dotenv = require('dotenv');

dotenv.config();

describe('Retrieve Selected Candidates Endpoint', () => {

    const project = {
        "company_id": 1,
        "title": "Primer proyecto",
        "description": "Descripcion basica de mi primer proyecto",
        "soft_skills": ["Trabajo en equipo", "Buena comunicación"],
        "hard_skills": ["Python", "SQL"],
        "roles": ["Product manager", "Junior Programmer"]
    }

    let appServer = {}
    let project_id = 0;

    beforeAll(async () => {
        appServer = await app.listen(3003);

        await new Promise(r => setTimeout(r, 3000));

        const res = await request(app)
            .post('/projects/')
            .send(project);

        project_id = await res.body.id;

        await request(app)
            .post(`/projects/${project_id}/selectcandidates/17`)

        // Wait for database connection to be established before running tests
    });

    afterAll(async () => {
        await appServer.close();
    })

    it('should return 200 when selected candidates are retrieved', async () => {
        const res = await request(app)
            .get(`/projects/${project_id}/selectedcandidates`)

        expect(res.statusCode).toEqual(200);
    })

});