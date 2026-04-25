const express = require("express");
const router = express.Router();

const {
  // CRUD
  createNote,
  createBulkNotes,
  getAllNotes,
  getNoteById,
  replaceNote,
  updateNote,
  deleteNote,
  deleteBulkNotes,
  // Search
  searchByTitle,
  searchByContent,
  searchAll,
  // Two concepts
  filterAndSort,
  filterAndPaginate,
  sortAndPaginate,
  searchAndFilter,
  // Three concepts
  searchSortPaginate,
  filterSortPaginate,
  // Master
  masterQuery,
} = require("../controllers/note.controller");

// ─────────────────────────────────────────────
// IMPORTANT: Specific paths MUST come before /:id
// ─────────────────────────────────────────────

// CRUD — bulk routes first
router.post("/bulk",   createBulkNotes);
router.delete("/bulk", deleteBulkNotes);

// Search routes
router.get("/search/content",       searchByContent);
router.get("/search/all",           searchAll);
router.get("/search",               searchByTitle);

// Combination routes (two concepts)
router.get("/filter-sort",          filterAndSort);
router.get("/filter-paginate",      filterAndPaginate);
router.get("/sort-paginate",        sortAndPaginate);
router.get("/search-filter",        searchAndFilter);

// Combination routes (three concepts)
router.get("/search-sort-paginate", searchSortPaginate);
router.get("/filter-sort-paginate", filterSortPaginate);

// Master endpoint — everything at once
router.get("/query",                masterQuery);

// CRUD — single-item routes LAST (/:id always last)
router.post("/",     createNote);
router.get("/",      getAllNotes);
router.get("/:id",   getNoteById);
router.put("/:id",   replaceNote);
router.patch("/:id", updateNote);
router.delete("/:id", deleteNote);

module.exports = router;
