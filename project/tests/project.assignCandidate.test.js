const request = require('supertest');
const app = require('../index');
const dotenv = require('dotenv');

dotenv.config();

// NOSONAR
describe('Assign Candidate into Project Endpoint', () => {

    const project = {
        "company_id": 2,
        "title": "Sgundo proyecto",
        "description": "Descripcion basica de mi segundo proyecto",
        "soft_skills": ["Trabajo en equipom2", "Buena comunicación 2"],
        "hard_skills": ["Python 2", "SQL 2"],
        "roles": ["Product manager 2", "Junior Programmer 2"]
    }

    let appServer = {}
    let project_id = 0;

    beforeAll(async () => {
        appServer = await app.listen(3004);

        await new Promise(r => setTimeout(r, 3000));

        const res = await request(app)
            .post('/projects/')
            .send(project);

        project_id = await res.body.id;

        // Wait for database connection to be established before running tests
    });

    afterAll(async () => {
        await appServer.close();
    })

    it('should return 400 when a candidate is not selected', async () => {
        const res = await request(app)
            .post(`/projects/${project_id}/assigncandidates/9999`)

        expect(res.statusCode).toEqual(400);
    })

    it('should return 404 when a project is not found', async () => {
        const res = await request(app)
            .post(`/projects/0/assigncandidates/17`)

        expect(res.statusCode).toEqual(404);
    })
});