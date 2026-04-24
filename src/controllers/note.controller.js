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
const searchByTitle = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ success: false, message: "Search query 'q' is required", data: null });
    const notes = await Note.find({ title: { $regex: q, $options: "i" } });
    return res.status(200).json({ success: true, message: `Search results for: ${q}`, count: notes.length, data: notes });
  } catch (error) { return res.status(500).json({ success: false, message: error.message, data: null }); }
};
const searchByContent = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ success: false, message: "Search query 'q' is required", data: null });
    const notes = await Note.find({ content: { $regex: q, $options: "i" } });
    return res.status(200).json({ success: true, message: `Content search results for: ${q}`, count: notes.length, data: notes });
  } catch (error) { return res.status(500).json({ success: false, message: error.message, data: null }); }
};
const searchAll = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ success: false, message: "Search query 'q' is required", data: null });
    const notes = await Note.find({ $or: [{ title: { $regex: q, $options: "i" } }, { content: { $regex: q, $options: "i" } }] });
    return res.status(200).json({ success: true, message: `Search results for: ${q}`, count: notes.length, data: notes });
  } catch (error) { return res.status(500).json({ success: false, message: error.message, data: null }); }
};
const filterAndSort = async (req, res) => {
  try {
    const { category, isPinned, sortBy, order } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (isPinned !== undefined) filter.isPinned = isPinned === "true";
    const sortField = ALLOWED_SORT_FIELDS.includes(sortBy) ? sortBy : "createdAt";
    const sortOrder = order === "asc" ? 1 : -1;
    const notes = await Note.find(filter).sort({ [sortField]: sortOrder });
    return res.status(200).json({ success: true, message: "Notes fetched successfully", count: notes.length, data: notes });
  } catch (error) { return res.status(500).json({ success: false, message: error.message, data: null }); }
};
const filterAndPaginate = async (req, res) => {
  try {
    const { category, isPinned, page, limit } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (isPinned !== undefined) filter.isPinned = isPinned === "true";
    const pageNum = parseInt(page) || 1; const limitNum = parseInt(limit) || 10; const skip = (pageNum - 1) * limitNum;
    const total = await Note.countDocuments(filter); const totalPages = Math.ceil(total / limitNum);
    const notes = await Note.find(filter).skip(skip).limit(limitNum);
    return res.status(200).json({ success: true, message: "Notes fetched successfully", data: notes, pagination: { total, page: pageNum, limit: limitNum, totalPages, hasNextPage: pageNum < totalPages, hasPrevPage: pageNum > 1 } });
  } catch (error) { return res.status(500).json({ success: false, message: error.message, data: null }); }
};
const sortAndPaginate = async (req, res) => {
  try {
    const { sortBy, order, page, limit } = req.query;
    const sortField = ALLOWED_SORT_FIELDS.includes(sortBy) ? sortBy : "createdAt"; const sortOrder = order === "asc" ? 1 : -1;
    const pageNum = parseInt(page) || 1; const limitNum = parseInt(limit) || 10; const skip = (pageNum - 1) * limitNum;
    const total = await Note.countDocuments(); const totalPages = Math.ceil(total / limitNum);
    const notes = await Note.find().sort({ [sortField]: sortOrder }).skip(skip).limit(limitNum);
    return res.status(200).json({ success: true, message: "Notes fetched successfully", data: notes, pagination: { total, page: pageNum, limit: limitNum, totalPages, hasNextPage: pageNum < totalPages, hasPrevPage: pageNum > 1 } });
  } catch (error) { return res.status(500).json({ success: false, message: error.message, data: null }); }
};
const searchAndFilter = async (req, res) => {
  try {
    const { q, category, isPinned } = req.query;
    if (!q) return res.status(400).json({ success: false, message: "Search query 'q' is required", data: null });
    const filter = { $or: [{ title: { $regex: q, $options: "i" } }, { content: { $regex: q, $options: "i" } }] };
    if (category) filter.category = category;
    if (isPinned !== undefined) filter.isPinned = isPinned === "true";
    const notes = await Note.find(filter);
    return res.status(200).json({ success: true, message: `Search results for: ${q}`, count: notes.length, data: notes });
  } catch (error) { return res.status(500).json({ success: false, message: error.message, data: null }); }
};

// ── SECTION 7 — THREE CONCEPTS COMBINED ──────────────────────────────────

// 16. Search + Sort + Paginate
const searchSortPaginate = async (req, res) => {
  try {
    const { q, sortBy, order, page, limit } = req.query;
    if (!q) return res.status(400).json({ success: false, message: "Search query 'q' is required", data: null });
    const filter = { $or: [{ title: { $regex: q, $options: "i" } }, { content: { $regex: q, $options: "i" } }] };
    const sortField = ALLOWED_SORT_FIELDS.includes(sortBy) ? sortBy : "createdAt"; const sortOrder = order === "asc" ? 1 : -1;
    const pageNum = parseInt(page) || 1; const limitNum = parseInt(limit) || 10; const skip = (pageNum - 1) * limitNum;
    const total = await Note.countDocuments(filter); const totalPages = Math.ceil(total / limitNum);
    const notes = await Note.find(filter).sort({ [sortField]: sortOrder }).skip(skip).limit(limitNum);
    return res.status(200).json({ success: true, message: `Search results for: ${q}`, data: notes, pagination: { total, page: pageNum, limit: limitNum, totalPages, hasNextPage: pageNum < totalPages, hasPrevPage: pageNum > 1 } });
  } catch (error) { return res.status(500).json({ success: false, message: error.message, data: null }); }
};

// 17. Filter + Sort + Paginate
const filterSortPaginate = async (req, res) => {
  try {
    const { category, isPinned, sortBy, order, page, limit } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (isPinned !== undefined) filter.isPinned = isPinned === "true";
    const sortField = ALLOWED_SORT_FIELDS.includes(sortBy) ? sortBy : "createdAt"; const sortOrder = order === "asc" ? 1 : -1;
    const pageNum = parseInt(page) || 1; const limitNum = parseInt(limit) || 10; const skip = (pageNum - 1) * limitNum;
    const total = await Note.countDocuments(filter); const totalPages = Math.ceil(total / limitNum);
    const notes = await Note.find(filter).sort({ [sortField]: sortOrder }).skip(skip).limit(limitNum);
    return res.status(200).json({ success: true, message: "Notes fetched successfully", data: notes, pagination: { total, page: pageNum, limit: limitNum, totalPages, hasNextPage: pageNum < totalPages, hasPrevPage: pageNum > 1 } });
  } catch (error) { return res.status(500).json({ success: false, message: error.message, data: null }); }
};

// ── MASTER ENDPOINT ───────────────────────────────────────────────────────

// 18. GET /api/notes/query — Search + Filter + Sort + Paginate
const masterQuery = async (req, res) => {
  try {
    const { q, category, isPinned, sortBy, order, page, limit } = req.query;

    // Step 1 — Build filter
    const filter = {};
    if (q) {
      filter.$or = [
        { title:   { $regex: q, $options: "i" } },
        { content: { $regex: q, $options: "i" } },
      ];
    }
    if (category)              filter.category = category;
    if (isPinned !== undefined) filter.isPinned  = isPinned === "true";

    // Step 2 — Sorting
    const sortField = ALLOWED_SORT_FIELDS.includes(sortBy) ? sortBy : "createdAt";
    const sortOrder = order === "asc" ? 1 : -1;

    // Step 3 — Pagination
    const pageNum  = parseInt(page)  || 1;
    const limitNum = parseInt(limit) || 10;
    const skip     = (pageNum - 1) * limitNum;

    // Step 4 — Execute
    const total      = await Note.countDocuments(filter);
    const totalPages = Math.ceil(total / limitNum);
    const notes      = await Note.find(filter)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limitNum);

    return res.status(200).json({
      success: true,
      message: "Notes fetched successfully",
      data: notes,
      pagination: {
        total,
        page:        pageNum,
        limit:       limitNum,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message, data: null });
  }
};

module.exports = {
  createNote, createBulkNotes, getAllNotes, getNoteById, replaceNote, updateNote, deleteNote, deleteBulkNotes,
  searchByTitle, searchByContent, searchAll,
  filterAndSort, filterAndPaginate, sortAndPaginate, searchAndFilter,
  searchSortPaginate, filterSortPaginate,
  masterQuery,
};
