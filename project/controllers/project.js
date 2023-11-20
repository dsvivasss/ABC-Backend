const Project = require('../models/Project');
const Sequelize = require('sequelize');
const dotenv = require('dotenv');
const fetch = require('node-fetch');
dotenv.config();

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
            users_assigned: [],
            users_selected: [],
        });

        res.status(201).json({
            id: project.id,
            company_id: project.company_id,
            title: project.title,
            description: project.description,
            soft_skills: project.soft_skills,
            hard_skills: project.hard_skills,
            roles: project.roles,
            users_assigned: project.users_assigned,
            users_selected: project.users_selected,
        });

    } catch (err) {
        console.log({
            err
        });
        res.status(500).json({
            message: 'Error creating project',
            error: err
        });
    }

}

const selectCandidate = async (req, res) => {

    const {
        project_id,
        candidate_id
    } = req.params;

    const project = await Project.findOne({
        where: {
            id: project_id,
        }
    });

    if (!project) {
        return res.status(404).json({
            message: 'Project not found'
        });
    }

    // istanbul ignore next
    if (!project.users_selected) {
        project.users_selected = [];
    }

    // istanbul ignore next
    if (project.users_selected.includes(candidate_id)) {
        return res.status(400).json({
            message: 'Candidate already selected'
        });
    }

    Project.update({
        users_selected: Sequelize.fn('array_append', Sequelize.col('users_selected'), candidate_id)
    }, {
        where: {
            id: project_id
        }
    });

    await project.save();

    res.status(200).json({
        message: 'Candidate selected successfully'
    });
}

const assignCandidate = async (req, res) => {

    const {
        project_id,
        candidate_id
    } = req.params;

    const project = await Project.findOne({
        where: {
            id: project_id,
        }
    });

    // istanbul ignore next
    if (!project) {
        return res.status(404).json({
            message: 'Project not found'
        });
    }

    if (!project.users_selected) {
        return res.status(400).json({
            message: 'You must select the candidate first in order to assign it'
        });
    }

    // Check if project.candidates includes is null or undefined
    if (!project.users_selected.includes(candidate_id)) {
        return res.status(400).json({
            message: 'You must select the candidate first in order to assign it'
        });
    }

    // Check if project.candidates includes is null or undefined
    // istanbul ignore next
    if (!project.users_assigned) {
        project.users_assigned = [];
    }

    // istanbul ignore next
    if (project.users_assigned.includes(candidate_id)) {
        return res.status(400).json({
            message: 'Candidate already assigned'
        });
    }

    // istanbul ignore next
    Project.update({
        users_assigned: Sequelize.fn('array_append', Sequelize.col('users_assigned'), candidate_id)
    }, {
        where: {
            id: project_id
        }
    });

    // istanbul ignore next
    await project.save();

    // istanbul ignore next
    res.status(200).json({
        message: 'Candidate assigned successfully'
    });
}

const retrieveSelectedCandidates = async (req, res) => {

    const {
        project_id,
    } = req.params;

    const project = await Project.findOne({
        where: {
            id: project_id,
        }
    });

    if (!project) {
        return res.status(404).json({
            message: 'Project not found'
        });
    }

    const obj = {
        ids: project.users_selected,
    }

    const request = await fetch(`${process.env.URL}/users/findmany`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(obj),
        });

    const response = await request.json();

    res.status(200).json(
        response
    );
}

// istanbul ignore next
const retrieveAssignedCandidates = async (req, res) => {

    const {
        project_id,
    } = req.params;

    const project = await Project.findOne({
        where: {
            id: project_id,
        }
    });

    if (!project) {
        return res.status(404).json({
            message: 'Project not found'
        });
    }

    const obj = {
        ids: project.users_assigned,
    }

    const request = await fetch(`${process.env.URL}/users/findmany`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(obj),
        });

    const response = await request.json();

    res.status(200).json(
        response
    );
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
    assignCandidate,
    selectCandidate,
    retrieveAssignedCandidates,
    retrieveSelectedCandidates,
    healthCheck,
};