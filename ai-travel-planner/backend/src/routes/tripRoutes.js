const express = require("express");

const router = express.Router();

const authMiddleware =
require("../middleware/authMiddleware");

const {
    createTrip,
    getTrips,
    getTripById,
    updateTrip,
    deleteTrip,
    generateTrip, 
    addActivity, 
    removeActivity, 
    regenerateDay, 
    togglePackingItem,
    getDashboardStats
} = require("../controllers/tripController");


router.post(
    "/",
    authMiddleware,
    createTrip
);

router.get(
    "/",
    authMiddleware,
    getTrips
);
router.get(
    "/:id",
    authMiddleware,
    getTripById
);

router.put(
    "/:id",
    authMiddleware,
    updateTrip
);

router.delete(
    "/:id",
    authMiddleware,
    deleteTrip
);
router.post(
  "/generate",
  authMiddleware,
  generateTrip
);
router.post(
    "/:id/activity",
    authMiddleware,
    addActivity
);
router.delete(
    "/:tripId/activity/:activityId",
    authMiddleware,
    removeActivity
);
router.post(
  "/:id/regenerate-day",
  authMiddleware,
  regenerateDay
);
router.patch(
  "/:tripId/packing/:itemId",
  authMiddleware,
  togglePackingItem
);
router.get(
  "/dashboard/stats",
  authMiddleware,
  getDashboardStats
);
module.exports = router;