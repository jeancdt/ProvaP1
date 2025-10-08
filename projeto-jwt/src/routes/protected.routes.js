const express = require("express");
const { authenticateToken, authorizeRole } = require("../middlewares/auth.middleware");
const ProtectedController = require("../controllers/protected.controller");
const VolunteerController = require("../controllers/volunteer.controller");
const router = express.Router();

router.get("/dashboard", authenticateToken, ProtectedController.dashboard);
router.get("/admin", authenticateToken, authorizeRole("admin"), ProtectedController.adminOnly);

// Rotas de Eventos
router.post("/events", authenticateToken, authorizeRole("admin"), ProtectedController.createEvent);
router.put("/events/:id", authenticateToken, authorizeRole("admin"), ProtectedController.updateEvent);
router.delete("/events/:id", authenticateToken, authorizeRole("admin"), ProtectedController.deleteEvent);

// Rotas de Voluntários
router.get("/volunteers", authenticateToken, VolunteerController.listVolunteers);
router.get("/volunteers/:id", authenticateToken, VolunteerController.getVolunteerById);
router.post("/volunteers", authenticateToken, authorizeRole("admin"), VolunteerController.createVolunteer);
router.put("/volunteers/:id", authenticateToken, authorizeRole("admin"), VolunteerController.updateVolunteer);
router.delete("/volunteers/:id", authenticateToken, authorizeRole("admin"), VolunteerController.deleteVolunteer);

module.exports = router;
