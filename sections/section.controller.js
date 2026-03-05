const express = require('express');
const router = express.Router();
const Joi = require('joi');
const sectionService = require('./section.service');
const validateRequest = require('_middleware/validate-request');

// Routes
router.get('/sections/:id', getSectionById);
router.get('/grade-levels/:gradeLevelId/sections', getSectionsByGradeLevel);
router.post('/grade-levels/:gradeLevelId/sections', createSectionSchema, createSection);
router.put('/grade-levels/:gradeLevelId/sections/:sectionId', updateSectionSchema, updateSection);
router.delete('/grade-levels/:gradeLevelId/sections/:sectionId', deleteSection);

module.exports = router;

async function getSectionById(req, res, next) {
    try {
        const section = await sectionService.getById(req.params.id);
        res.json(section);
    } catch (err) { next(err); }
}

// Validation
function createSectionSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().trim().required(),
        strand: Joi.string().trim().allow('', null)
    });
    validateRequest(req, next, schema);
}

function updateSectionSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().trim().required(),
        strand: Joi.string().trim().allow('', null)
    });
    validateRequest(req, next, schema);
}

// Controllers
async function getSectionsByGradeLevel(req, res, next) {
    try {
        const sections = await sectionService.getSectionsByGradeLevel(req.params.gradeLevelId, req.query.strand);
        res.json(sections);
    } catch (err) { next(err); }
}

async function createSection(req, res, next) {
    try {
        const section = await sectionService.addSection(req.params.gradeLevelId, req.body.name, req.body.strand);
        res.status(201).json(section);
    } catch (err) { next(err); }
}

async function updateSection(req, res, next) {
    try {
        const updated = await sectionService.updateSection(
            req.params.gradeLevelId,
            req.params.sectionId,
            req.body.name,
            req.body.strand
        );
        res.json(updated);
    } catch (err) { next(err); }
}

async function deleteSection(req, res, next) {
    try {
        const result = await sectionService.deleteSection(req.params.gradeLevelId, req.params.sectionId);
        res.json(result);
    } catch (err) { next(err); }
}
