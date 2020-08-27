const Flight = require('../models/flight');

module.exports = {
    new: newDest,
    create,
    delete: deleteDest,
    return: returnToFlight
};

function newDest(req, res) {
    Flight.findById(req.params.id, function(err, flight) {
        //Retrieve all possible flight destinations
        destinationEnums = flight.schema.path('destinations.airport').enumValues;

        //Convert flight.destinations to an array containing only the airports.
        let usedAirports = flight.destinations.map(f => f.airport);

        //Add the departure airport to list of airports.
        usedAirports.push(flight.airport);

        //Filter usedAirports to display allowedDestinations
        let allowedDestinations = destinationEnums.filter(a => !usedAirports.includes(a));

        res.render('destinations/new', { title: 'Add Destination', allowedDestinations, flight });
    });
}

function create(req, res) {
    if (!req.body.arrival) delete req.body.arrival;

    Flight.findById(req.params.id, function(err, flight) {
        flight.destinations.push(req.body);
        flight.save(function(err) {
            res.redirect(`/flights/${flight._id}`);
        });
    });
}

function deleteDest(req, res) {
    Flight.findOne({ "destinations._id" : req.params.id }, function(err, flight) {
        flight.destinations.id(req.params.id).remove();
        flight.save(function(err) {
            res.redirect(`/flights/${flight._id}`)
        })
    });
}

function returnToFlight(req, res) {
    Flight.findById(req.params.id, function(err, flight) {
        res.redirect(`/flights/${flight._id}`);
    });
}