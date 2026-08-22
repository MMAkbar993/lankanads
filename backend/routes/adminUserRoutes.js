const express = require("express");
const {
    getAllUsers,
    getUserById,
} = require("../controllers/adminUserController");
const {
    makeAgent,
    listAgents,
    topUpAgent,
    getUserTransactions,
    getAdTypeCosts,
    updateAdTypeCost,
} = require("../controllers/creditController");
const { protectAdmin } = require("../middleware/adminMiddleware");

const router = express.Router();

router.use(protectAdmin);

router.get("/users", getAllUsers);
router.get("/agents-list", listAgents);
router.get("/ad-type-costs", getAdTypeCosts);
router.patch("/ad-type-costs/:type", updateAdTypeCost);
router.get("/users/:id", getUserById);
router.patch("/users/:id/make-agent", makeAgent);
router.post("/users/:id/top-up", topUpAgent);
router.get("/users/:id/transactions", getUserTransactions);

module.exports = router;