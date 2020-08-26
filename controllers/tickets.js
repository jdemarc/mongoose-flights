const Flight = require('../models/flight');
const Ticket = require('../models/ticket');

module.exports = {
    deleteAllTickets,
    new: newTicket,
    create,
}

function deleteAllTickets(req, res) {
    Ticket.deleteMany({}, function (err, tickets) {
        console.log(tickets);
        res.redirect(`/flights/${req.params.id}`);
    })
}

function newTicket (req, res) {
    Ticket.find({}, function (err, tickets) {
        res.render('tickets/new', {
          title: 'Add Ticket',
          tickets,
          flightId: req.params.id
        });

    })
}

function create(req, res) {
    if (!req.body.price) delete req.body.price;
    
    req.body.flight = req.params.id;
    
    Ticket.find({}, function (err, tickets) {
        let takenSeats = tickets.map(t => t.seat);

        console.log(takenSeats);
        console.log(req.body.seat);

        if (takenSeats.includes(req.body.seat)) {
            res.redirect(`/flights/${req.params.id}/tickets/new`)
        
        } else {
            Ticket.create(req.body, function (err, ticket) {
                if (err) res.redirect(`/flights/${req.params.id}/tickets/new`);
            
                res.redirect(`/flights/${req.params.id}/`);
            });
        }
    });
}