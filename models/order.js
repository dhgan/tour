var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var logger = require('../lib/log').logger;
var Package = require('./package');
var moment = require('moment');

var orderSchema = new mongoose.Schema({
    user: {
        type: ObjectId,
        ref: 'User'
    },
    package: {
        type: ObjectId,
        ref: 'Package'
    },
    name: String,
    tel: String,
    totalPrice: Number,
    number: Number,
    date: Date,
    price: Number,
    createDate: Date,
    payDate: Date,
    leastDate: Date,
    state: {
        type: Number,
        enum: [-1, 0, 1, 2],
        default: 0
    }
});

setInterval(function() {
    Order.find({state: 0, leastDate: { $lt: new Date()}})
        .exec()
        .then(function(orders) {
            orders.forEach(function(order) {
                order.state = -1;
                order.save()
                    .then(function() {
                        Package.findById(order.package).exec()
                            .then(function(package) {
                                var choices = package.choices;

                                choices.forEach(function(choice) {
                                    if(moment(choice.date).isSame(order.date, 'day')) {
                                        choice.left = choice.left + order.number;
                                        return;
                                    }
                                });

                                package.save()
                                    .then(function() {}, function(err) {
                                        logger.error(err);
                                    });
                            }, function() {

                            });
                    }, function(err) {
                        logger.error(err);
                    });
            });
        }, function(err) {
            logger.error(err);
        });
}, 1000 * 60);

var Order = mongoose.model('Order', orderSchema);
module.exports = Order;