const Project = require('../models/Project');

const create = async (req, res) => {

    const {
        company_id,
        title,
        description,
        soft_skills,
        hard_skills,
        roles,
    } = req.body;

    if (!company_id || !title || !description || !soft_skills || !hard_skills || !roles) {
        return res.status(400).json({
            message: 'Bad Request: Missing required fields'
        });
    }

    try {

        const project = await Project.create({
            company_id,
            title,
            description,
            soft_skills,
            hard_skills,
            roles,
        });

        console.log({
            project
        });

        res.status(201).json({
            id: project.id,
            company_id: project.company_id,
            title: project.title,
            description: project.description,
            soft_skills: project.soft_skills,
            hard_skills: project.hard_skills,
            roles: project.roles,
        });

    } catch (err) {
        console.log({
            err
        });
        res.status(500).json({
            message: 'Error finding company',
            error: err
        });
    }

}

const healthCheck = async (req, res) => {
    res.status(200).send('pong');
}

const retrieveProjectsFromCompany = async (req, res) => {
    const {
        company_id,
    } = req.params;

    const projects = await Project.findAll({
        where: {
            company_id,
        }
    });

    res.status(200).json({
        projects,
    });

}

module.exports = {
    create,
    retrieveProjectsFromCompany,
    healthCheck,
};