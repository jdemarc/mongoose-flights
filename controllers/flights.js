const Flight = require('../models/flight');
const Ticket = require('../models/ticket');

module.exports = {
    index,
    create,
    new: newFlight,
    show,
    delete: deleteOne
};

function index(req, res) {
    Flight.find({}, function(err, flights) {
        res.render('flights/index', { flights, title: 'All Flights' });
    }).sort( {departs: 'ascending'} );
}

function create(req, res) {
    if (!req.body.departs) delete req.body.departs;

    const flight = new Flight(req.body);

    flight.save(function(err) {
        if (err) return res.redirect('/flights/new')
        
        res.redirect('/flights');
    });
}

function newFlight(req, res) {
    const flight = new Flight();
    const dt = flight.departs;
    const departsDate = dt.toISOString().slice(0, 16);

    res.render('flights/new', { departsDate, title: 'Add Flight' });
}

function show(req, res) {
    Flight.findById(req.params.id, function(err, flight) {

        //Sort flight destinations by arrival time.
        flight.destinations.sort((a, b) => a.arrival.getTime() - b.arrival.getTime());

        //Retrieve all possible flight destinations
        destinationEnums = flight.schema.path('destinations.airport').enumValues;

        //Convert flight.destinations to an array containing only the airports.
        let usedAirports = flight.destinations.map(f => f.airport);

        //Add the departure airport to list of airports.
        usedAirports.push(flight.airport);

        //Filter usedAirports to display allowedDestinations
        let allowedDestinations = destinationEnums.filter(a => !usedAirports.includes(a));

        //Ticket.find({ flight: flight._id})...
        Ticket.find({}, function(err, createdTickets) {

            Ticket.find({ flight: flight._id} , function (err, attachedTickets) {
            //     console.log(attachedTickets);

                res.render('flights/show', { flight, title: 'Flight Details', 
                                            createdTickets, attachedTickets });
            });
            
        });
    });
}

function deleteOne(req, res) {
    Flight.findByIdAndDelete(req.params.id, function (err) {
        if(err) console.log('Error');
        console.log('Successfully deleted.');

        res.redirect('/flights');
    });
}