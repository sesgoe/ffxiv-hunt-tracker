const database = require('../database')


exports.updateMonsterStatus = async (roomId, monsterId, newStatus) => {
  return await database.updateMonsterStatusForRoom(roomId, monsterId, newStatus)
}
