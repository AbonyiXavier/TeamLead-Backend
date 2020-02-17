import express from "express";
import Auth from "../middlewares/verifyToken";
import TeamLeadsController from "../controllers/teamleads";
import isAdmin from "../middlewares/admin";

const router = express.Router();

router.post("/teamLeads", TeamLeadsController.addTeamLeads);
router.get("/teamLeads", Auth, isAdmin, TeamLeadsController.getAllTeamLeads);
router.patch("/teamLeads/:id", TeamLeadsController.updateTeamLead);
router.delete("/teamLeads/:id", TeamLeadsController.deleteTeamLead);

export default router;
