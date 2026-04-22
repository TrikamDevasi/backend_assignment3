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
};

const createBulkNotes = async (req, res) => {
  try {
    const { notes } = req.body;
    if (!notes || !Array.isArray(notes) || notes.length === 0) return res.status(400).json({ success: false, message: "notes array is required and cannot be empty", data: null });
    const created = await Note.insertMany(notes);
    return res.status(201).json({ success: true, message: `${created.length} notes created successfully`, data: created });
  } catch (error) { return res.status(500).json({ success: false, message: error.message, data: null }); }
};

const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find();
    return res.status(200).json({ success: true, message: "Notes fetched successfully", count: notes.length, data: notes });
  } catch (error) { return res.status(500).json({ success: false, message: error.message, data: null }); }
};

const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Invalid note ID", data: null });
    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ success: false, message: "Note not found", data: null });
    return res.status(200).json({ success: true, message: "Note fetched successfully", data: note });
  } catch (error) { return res.status(500).json({ success: false, message: error.message, data: null }); }
};

const replaceNote = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Invalid note ID", data: null });
    const { title, content, category, isPinned } = req.body;
    if (!title || !content) return res.status(400).json({ success: false, message: "Title and content are required", data: null });
    const note = await Note.findByIdAndUpdate(id, { title, content, category, isPinned }, { new: true, overwrite: true, runValidators: true });
    if (!note) return res.status(404).json({ success: false, message: "Note not found", data: null });
    return res.status(200).json({ success: true, message: "Note replaced successfully", data: note });
  } catch (error) { return res.status(500).json({ success: false, message: error.message, data: null }); }
};

const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Invalid note ID", data: null });
    if (!req.body || Object.keys(req.body).length === 0) return res.status(400).json({ success: false, message: "No fields provided to update", data: null });
    const note = await Note.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!note) return res.status(404).json({ success: false, message: "Note not found", data: null });
    return res.status(200).json({ success: true, message: "Note updated successfully", data: note });
  } catch (error) { return res.status(500).json({ success: false, message: error.message, data: null }); }
};

const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Invalid note ID", data: null });
    const note = await Note.findByIdAndDelete(id);
    if (!note) return res.status(404).json({ success: false, message: "Note not found", data: null });
    return res.status(200).json({ success: true, message: "Note deleted successfully", data: null });
  } catch (error) { return res.status(500).json({ success: false, message: error.message, data: null }); }
};

const deleteBulkNotes = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) return res.status(400).json({ success: false, message: "ids array is required and cannot be empty", data: null });
    const result = await Note.deleteMany({ _id: { $in: ids } });
    return res.status(200).json({ success: true, message: `${result.deletedCount} notes deleted successfully`, data: null });
  } catch (error) { return res.status(500).json({ success: false, message: error.message, data: null }); }
};

// ── SECTION 5 — SEARCH ────────────────────────────────────────────────────

// 9. Search in title only
const searchByTitle = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ success: false, message: "Search query 'q' is required", data: null });
    const notes = await Note.find({ title: { $regex: q, $options: "i" } });
    return res.status(200).json({ success: true, message: `Search results for: ${q}`, count: notes.length, data: notes });
  } catch (error) { return res.status(500).json({ success: false, message: error.message, data: null }); }
};

// 10. Search in content only
const searchByContent = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ success: false, message: "Search query 'q' is required", data: null });
    const notes = await Note.find({ content: { $regex: q, $options: "i" } });
    return res.status(200).json({ success: true, message: `Content search results for: ${q}`, count: notes.length, data: notes });
  } catch (error) { return res.status(500).json({ success: false, message: error.message, data: null }); }
};

// 11. Search in title AND content ($or)
const searchAll = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ success: false, message: "Search query 'q' is required", data: null });
    const notes = await Note.find({
      $or: [
        { title:   { $regex: q, $options: "i" } },
        { content: { $regex: q, $options: "i" } },
      ],
    });
    return res.status(200).json({ success: true, message: `Search results for: ${q}`, count: notes.length, data: notes });
  } catch (error) { return res.status(500).json({ success: false, message: error.message, data: null }); }
};

module.exports = {
  createNote, createBulkNotes, getAllNotes, getNoteById, replaceNote, updateNote, deleteNote, deleteBulkNotes,
  searchByTitle, searchByContent, searchAll,
};
