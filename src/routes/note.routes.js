const express = require("express");
const router = express.Router();
const {
  createNote, createBulkNotes, getAllNotes, getNoteById,
  replaceNote, updateNote, deleteNote, deleteBulkNotes,
  searchByTitle, searchByContent, searchAll,
  filterAndSort, filterAndPaginate, sortAndPaginate, searchAndFilter,
} = require("../controllers/note.controller");

router.post("/bulk",   createBulkNotes);
router.delete("/bulk", deleteBulkNotes);

router.get("/search/content", searchByContent);
router.get("/search/all",     searchAll);
router.get("/search",         searchByTitle);

// Two-concept combination routes
router.get("/filter-sort",     filterAndSort);
router.get("/filter-paginate", filterAndPaginate);
router.get("/sort-paginate",   sortAndPaginate);
router.get("/search-filter",   searchAndFilter);

router.post("/",     createNote);
router.get("/",      getAllNotes);
router.get("/:id",   getNoteById);
router.put("/:id",   replaceNote);
router.patch("/:id", updateNote);
router.delete("/:id", deleteNote);

module.exports = router;
