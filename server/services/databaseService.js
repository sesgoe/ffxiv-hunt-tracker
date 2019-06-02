let database = require('../database')

exports.getRoomByName = async (roomName) => {
    return new Promise((resolve, reject) => {
      database.Room.findOne({name: roomName}, function(err, result) {
        if(err) reject({error: error})
        resolve(result)
      })
    })
}
