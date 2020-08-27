const Flight = require('../models/flight');
const Ticket = require('../models/ticket');

module.exports = {
    delete: deleteAllTickets,
    new: newTicket,
    create,
}

function deleteAllTickets(req, res) {
    
}

function newTicket (req, res) {

    Flight.findById(req.params.id, function(err, flight) {
        Ticket.find({ flight: flight._id }, function (err, tickets) {
                res.render('tickets/new', {
                    title: 'Add Ticket',
                    tickets,
                    flightId: req.params.id
                }); 
            });
    });
}

function create(req, res) {
    if (!req.body.price) delete req.body.price;
    
    req.body.flight = req.params.id;
    
    Flight.findById(req.params.id, function(err, flight) {
        Ticket.find({}, function(err, tickets) {
            let takenSeats = tickets.map(t => t.seat);

            if (takenSeats.includes(req.body.seat)) {
                res.redirect(`/flights/${req.params.id}/tickets/new`);
            } else {
                Ticket.create(req.body, function (err, ticket) {
                    if (err) res.redirect(`/flights/${req.params.id}/tickets/new`);
                
                    res.redirect(`/flights/${req.params.id}/`);
                });                
            }
        });
    });
}