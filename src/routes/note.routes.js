const express = require("express");
const router = express.Router();
const {
  createNote, createBulkNotes, getAllNotes, getNoteById,
  replaceNote, updateNote, deleteNote, deleteBulkNotes,
  searchByTitle, searchByContent, searchAll,
} = require("../controllers/note.controller");

router.post("/bulk",   createBulkNotes);
router.delete("/bulk", deleteBulkNotes);

// Search routes (before /:id)
router.get("/search/content", searchByContent);
router.get("/search/all",     searchAll);
router.get("/search",         searchByTitle);

router.post("/",     createNote);
router.get("/",      getAllNotes);
router.get("/:id",   getNoteById);
router.put("/:id",   replaceNote);
router.patch("/:id", updateNote);
router.delete("/:id", deleteNote);

module.exports = router;
