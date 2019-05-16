const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const mongoUrl = process.env.MONGO_URL;
mongoose.connect(mongoUrl, {useNewUrlParser: true});

var roomSchema = new Schema({
    name: String,
    createdAt: Number,
    huntStatuses: [
        {
            name: String,
            status: String,
            deathTimestamp: Number
        }
    ],
    roles: [
        {
            name: String,
            members: [
                {
                    userId: String,
                    username: String,
                    discriminator: String,
                    avatar: String
                }
            ]
        }
    ]
});

var Room = mongoose.model('Room', roomSchema);

module.exports = {
    roomSchema: roomSchema,
    Room: Room,
    mongoose: mongoose
};
