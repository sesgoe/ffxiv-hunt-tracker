const database = require('../database')

exports.getRoomByName = async (roomName) => {
    return database.getRoomByName(roomName)
}

exports.getRoomsByDiscordUser = async (discordUser) => {
  return database.getRoomsByDiscordId(discordUser.discordId)
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
  let linkResult = await database.linkRoomToCreator(room.id, discordUser.discordId)
  if(!linkResult) {
    return {error: "Unable to link room to its creator--room was not created."}
  }

  return room

}

exports.getDiscordUserByDiscordUsernameAndDiscordDiscriminator = async (discordUsername, discordDiscriminator) => {
  return await database.getDiscordUserByDiscordUsernameAndDiscordDiscriminator(discordUsername, discordDiscriminator)
}

exports.updateUser = async(discordUser) => {
  return await database.upsertUser(discordUser)
}

exports.updateMonsterStatus = async (roomId, monsterId, newStatus) => {
  return await database.updateMonsterStatusForRoom(roomId, monsterId, newStatus)
}
