const Flight = require('../models/flight');

module.exports = {
    create,
    delete: deleteDest,
};

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