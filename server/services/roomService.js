const database = require('../database')

exports.getRoomById = async (roomName) => {
    return database.getRoomById(roomName)
}

exports.getRoomsByDiscordUser = async (discordUser) => {
  return database.getRoomsByDiscordId(discordUser.id)
}

exports.createRoom = async (roomName, discordUser) => {
  let room = await database.createRoom(roomName)
  if(room.error) {
    return room.error
  }

  //after room is made, go ahead and populate monsterStatuses for room
  let populateRoomResult = await database.setupInitialMonsterStatusesForRoom(room.id)
  if(!populateRoomResult) {
    return {error: `Unable to set up initial monster statuses for room id: ${room.id}`}
  }

  //after room is made, need to link user, room, and role id 1 (creator)
  let linkResult = await database.linkRoomToCreator(room.id, discordUser)
  if(!linkResult) {
    return {error: "Unable to link room to its creator--room was not created."}
  }

  return room

}
