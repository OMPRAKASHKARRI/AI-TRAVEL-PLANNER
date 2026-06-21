const Trip = require("../models/Trip");
const {
  generateTravelPlan, regenerateDayPlan
} = require("../services/aiService");

exports.createTrip = async (req,res) => {

    try{

        const {
            destination,
            durationDays,
            budgetTier,
            interests
        } = req.body;

        const trip = await Trip.create({
            userId:req.user.id,

            destination,
            durationDays,
            budgetTier,
            interests,

            itinerary:[],
            hotels:[],

            estimatedBudget:{},

            packingList:[]
        });

        res.status(201).json(trip);

    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};
exports.getTrips = async (req,res) => {

    try{

        const trips = await Trip.find({
            userId:req.user.id
        });

        res.json(trips);

    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};
// getTripById
exports.getTripById = async (req,res) => {

    try{

        const trip = await Trip.findOne({
            _id:req.params.id,
            userId:req.user.id
        });

        if(!trip){
            return res.status(404).json({
                message:"Trip not found"
            });
        }

        res.json(trip);

    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};
//update
exports.updateTrip = async (req,res) => {

    try{

        const trip = await Trip.findOneAndUpdate(
            {
                _id:req.params.id,
                userId:req.user.id
            },
            req.body,
            {
                new:true
            }
        );

        if(!trip){
            return res.status(404).json({
                message:"Trip not found"
            });
        }

        res.json(trip);

    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};
// delete
exports.deleteTrip = async (req,res) => {

    try{

        const trip = await Trip.findOneAndDelete({
            _id:req.params.id,
            userId:req.user.id
        });

        if(!trip){
            return res.status(404).json({
                message:"Trip not found"
            });
        }

        res.json({
            message:"Trip deleted"
        });

    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};
// generate trip
exports.generateTrip = async (req, res) => {

  try {

    const {
      destination,
      durationDays,
      budgetTier,
      interests,
    } = req.body;

    const aiData =
      await generateTravelPlan({
        destination,
        durationDays,
        budgetTier,
        interests,
      });

    const trip = await Trip.create({
      userId: req.user.id,

      destination,
      durationDays,
      budgetTier,
      interests,

      itinerary:
        aiData.itinerary || [],

      hotels:
        aiData.hotels || [],

      estimatedBudget:
        aiData.estimatedBudget || {},

      packingList:
        aiData.packingList || [],
    });

    res.status(201).json(trip);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });

  }

};
// add activity
exports.addActivity = async (req,res) => {

    try{

        const {
            dayNumber,
            title,
            description,
            estimatedCostUSD,
            timeOfDay
        } = req.body;

        const trip = await Trip.findOne({
            _id:req.params.id,
            userId:req.user.id
        });

        if(!trip){
            return res.status(404).json({
                message:"Trip not found"
            });
        }

        const day = trip.itinerary.find(
            item => item.dayNumber === Number(dayNumber)
        );

        if(!day){
            return res.status(404).json({
                message:"Day not found"
            });
        }

        day.activities.push({
            title,
            description,
            estimatedCostUSD,
            timeOfDay
        });

        await trip.save();

        res.json(trip);

    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};
// remove activity
exports.removeActivity = async (req,res) => {

    try{

        const trip = await Trip.findOne({
            _id:req.params.tripId,
            userId:req.user.id
        });

        if(!trip){
            return res.status(404).json({
                message:"Trip not found"
            });
        }

        trip.itinerary.forEach(day => {

            day.activities =
            day.activities.filter(
                activity =>
                activity._id.toString() !==
                req.params.activityId
            );

        });

        await trip.save();

        res.json(trip);

    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};

// regeenearte day plan

exports.regenerateDay = async (req, res) => {

  try {

    const { dayNumber, instruction } =
      req.body;

    const trip = await Trip.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found"
      });
    }

    const regeneratedDay =
      await regenerateDayPlan({
        destination: trip.destination,
        budgetTier: trip.budgetTier,
        interests: trip.interests,
        dayNumber,
        instruction
      });

    const dayIndex =
      trip.itinerary.findIndex(
        day =>
          String(day.dayNumber) ===
          String(dayNumber)
      );

    if (dayIndex === -1) {
      return res.status(404).json({
        message: "Day not found"
      });
    }

    trip.itinerary[dayIndex] =
      regeneratedDay;

    await trip.save();

    res.json({
      message:
        `Day ${dayNumber} regenerated`,
      trip
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};
// Toggle Package

exports.togglePackingItem = async (req, res) => {
  try {

    const trip = await Trip.findOne({
      _id: req.params.tripId,
      userId: req.user.id
    });

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found"
      });
    }

    const item = trip.packingList.id(
      req.params.itemId
    );

    if (!item) {
      return res.status(404).json({
        message: "Packing item not found"
      });
    }

    item.isPacked = !item.isPacked;

    await trip.save();

    res.json({
      message: "Packing item updated",
      item
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

// dashboard stats

exports.getDashboardStats = async (
  req,
  res
) => {

  try {

    const trips = await Trip.find({
      userId: req.user.id
    });

    const totalTrips = trips.length;

    const totalBudget =
      trips.reduce(
        (sum, trip) =>
          sum +
          (trip.estimatedBudget?.total || 0),
        0
      );

    res.json({
      totalTrips,
      totalBudget
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};