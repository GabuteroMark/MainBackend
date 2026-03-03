const express = require('express');
const router = express.Router();
const Joi = require('joi');
const gradeLevelService = require('./grade-level.service');
const validateRequest = require('_middleware/validate-request');

// ================= GRADE LEVEL ROUTES =================

// GET all grade levels
router.get('/', getAllGradeLevels);

// GET grade level by ID
router.get('/:id', getGradeLevelById);

// POST create grade level
router.post('/', createGradeLevelSchema, createGradeLevel);

// UPDATE grade level
router.put('/:id', updateGradeLevelSchema, updateGradeLevel);

// DELETE grade level
router.delete('/:id', deleteGradeLevel);

module.exports = router;

// ================= VALIDATION SCHEMAS =================
function createGradeLevelSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().trim().required(),
        academicLevel: Joi.string().trim().allow(null, '')
    });
    validateRequest(req, next, schema);
}

function updateGradeLevelSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().trim().required(),
        academicLevel: Joi.string().trim().allow(null, '')
    });
    validateRequest(req, next, schema);
}

// ================= CONTROLLERS =================
function getAllGradeLevels(req, res, next) {
    gradeLevelService.getAllGradeLevel(req.query.academicLevel)
        .then(data => res.json(data))
        .catch(next);
}

function getGradeLevelById(req, res, next) {
    gradeLevelService.getGradeLevelById(req.params.id)
        .then(data => res.json(data))
        .catch(next);
}

function createGradeLevel(req, res, next) {
    gradeLevelService.createGradeLevel(req.body)
        .then(data => res.status(201).json(data))
        .catch(next);
}

function updateGradeLevel(req, res, next) {
    gradeLevelService.updateGradeLevel(req.params.id, req.body)
        .then(data => res.json(data))
        .catch(next);
}

function deleteGradeLevel(req, res, next) {
    gradeLevelService.deleteGradeLevel(req.params.id)
        .then(() => res.json({ message: 'Grade Level deleted' }))
        .catch(next);
}