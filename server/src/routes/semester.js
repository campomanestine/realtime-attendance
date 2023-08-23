const express = require("express");
const {
  getAllSemester,
  createSemester,
  updateSemester,
  getSemesterStudents
} = require("../controllers/SemesterController");
const requireAuth = require("../middleware/RequiredAuth");
const router = express.Router();

// middleware
router.use(requireAuth);
router.get("/api/v1/semester", getAllSemester);
router.get("/api/v1/semester/:id/student", getSemesterStudents);
router.post("/api/v1/semester", createSemester);
router.put("/api/v1/semester/:id", updateSemester);

module.exports = router;
