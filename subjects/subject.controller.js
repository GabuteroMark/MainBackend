const express = require('express');
const router = express.Router();
const Joi = require('joi');
const subjectService = require('./subject.service'); // Fixed service
const validateRequest = require('_middleware/validate-request');

// ================= SUBJECT ROUTES =================

// GET all subjects for a section
router.get('/sections/:sectionId/subjects', getSubjectsBySection);

// POST add a new subject
router.post('/sections/:sectionId/subjects', createSubjectSchema, createSubject);

// PUT update a subject
router.put('/sections/:sectionId/subjects/:subjectId', updateSubjectSchema, updateSubject);

// DELETE a subject
router.delete('/sections/:sectionId/subjects/:subjectId', deleteSubject);

module.exports = router;

// ================= VALIDATION SCHEMAS =================
function createSubjectSchema(req, res, next) {
    const schema = Joi.object({ name: Joi.string().trim().required() });
    validateRequest(req, next, schema);
}

function updateSubjectSchema(req, res, next) {
    const schema = Joi.object({ name: Joi.string().trim().required() });
    validateRequest(req, next, schema);
}

// ================= CONTROLLERS =================

// Get all subjects for a section
async function getSubjectsBySection(req, res, next) {
    try {
        const sectionId = Number(req.params.sectionId);
        const subjects = await subjectService.getSubjectsBySection(sectionId);
        res.json(subjects);
    } catch (err) { next(err); }
}

// Add a new subject
async function createSubject(req, res, next) {
    try {
        const sectionId = Number(req.params.sectionId);
        const name = req.body.name;
        const subject = await subjectService.addSubject(sectionId, name);
        res.status(201).json(subject);
    } catch (err) {
        console.error('Error creating subject:', err.message || err);
        res.status(400).json({ message: err.message || 'Failed to create subject' });
    }
}

// Update a subject
async function updateSubject(req, res, next) {
    try {
        const sectionId = Number(req.params.sectionId);
        const subjectId = Number(req.params.subjectId);
        const name = req.body.name;
        const updated = await subjectService.updateSubject(sectionId, subjectId, name);
        res.json(updated);
    } catch (err) {
        console.error('Error updating subject:', err.message || err);
        res.status(400).json({ message: err.message || 'Failed to update subject' });
    }
}

// Delete a subject
async function deleteSubject(req, res, next) {
    try {
        const sectionId = Number(req.params.sectionId);
        const subjectId = Number(req.params.subjectId);
        const result = await subjectService.deleteSubject(sectionId, subjectId);
        res.json(result);
    } catch (err) {
        console.error('Error deleting subject:', err.message || err);
        res.status(400).json({ message: err.message || 'Failed to delete subject' });
    }
}