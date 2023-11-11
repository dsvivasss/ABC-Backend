const request = require('supertest');
const app = require('../index');
const dotenv = require('dotenv');

dotenv.config();

describe('Assign Candidate into Project Endpoint', () => {

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

    // it('should return 200 when a candidate is assigned', async () => {

    //     await request(app)
    //         .post(`/projects/${project_id}/selectcandidates/17`)

    //     const getRes = await request(app)
    //         .get(`/projects/${project_id}/selectedcandidates`)

    //     const res = await request(app)
    //         .post(`/projects/${project_id}/assigncandidates/17`)

    //     expect(res.statusCode).toEqual(200);
    // })

    it('should return 404 when a project is not found', async () => {
        const res = await request(app)
            .post(`/projects/0/assigncandidates/17`)

        expect(res.statusCode).toEqual(404);
    })
});