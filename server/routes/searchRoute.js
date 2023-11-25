const { searchCtrl } = require("../controllers/searchController");

const router = require("express").Router();

// /api/search/workshop
router.get("/workshop", searchCtrl);

module.exports = router;
