const Trip = require("../models/Trip");

const checkTripOwnership = async (
    req,
    res,
    next
) => {

    const trip = await Trip.findById(
        req.params.id
    );

    if(!trip){
        return res.status(404).json({
            message:"Trip not found"
        });
    }

    if(
        trip.userId.toString() !==
        req.user.id
    ){
        return res.status(403).json({
            message:"Access denied"
        });
    }

    req.trip = trip;

    next();
};

module.exports =
checkTripOwnership;