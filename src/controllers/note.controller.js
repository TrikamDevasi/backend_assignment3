const mongoose = require("mongoose");
const Note = require("../models/note.model");
const ALLOWED_SORT_FIELDS = ["title", "createdAt", "updatedAt", "category"];
const createNote = async (req, res) => {
  try {
    const { title, content, category, isPinned } = req.body;
    if (!title || !content) return res.status(400).json({ success: false, message: "Title and content are required", data: null });
    const note = await Note.create({ title, content, category, isPinned });
    return res.status(201).json({ success: true, message: "Note created successfully", data: note });
  } catch (error) { return res.status(500).json({ success: false, message: error.message, data: null }); }
};const createBulkNotes = async (req, res) => {
  try {
    const { notes } = req.body;
    if (!notes || !Array.isArray(notes) || notes.length === 0) return res.status(400).json({ success: false, message: "notes array is required and cannot be empty", data: null });
    const created = await Note.insertMany(notes);
    return res.status(201).json({ success: true, message: `${created.length} notes created successfully`, data: created });
  } catch (error) { return res.status(500).json({ success: false, message: error.message, data: null }); }
};
module.exports = { createNote, createBulkNotes };
