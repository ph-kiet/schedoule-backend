import dotenv from 'dotenv';
import geolib from 'geolib';

dotenv.config();

const office_lat = parseFloat(process.env.OFFICE_LAT);
const office_lng = parseFloat(process.env.OFFICE_LNG);
const max_distance = parseInt(process.env.MAX_DISTANCE, 10);

const verifyLocation = (req, res, next) => {
    const userLocation = req.body.location;
    const officeLocation = { latitude: office_lat, longitude: office_lng};

    if(!userLocation || !userLocation.latitude || !userLocation.longitude) 
        return res.status(400).json({ message: 'Location is missing!!!'});

    const distance = geolib.getDistance(userLocation, officeLocation);
    
    if(distance <= max_distance){
        next();
    }
    else{
        res.status(403).json({message: 'Unable to login from this location!!!', distance, userLocation, officeLocation, max_distance});
    }
}

export default verifyLocation;