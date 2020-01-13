const { Pool } = require('pg')
const connectionString = process.env.POSTGRES_URL

const pool = new Pool({
    connectionString: connectionString,
})

exports.getRoomById = async (roomId) => {
    try {
        const queryText = 'select * from rooms where id = $1'
        const queryValues = [roomId]
        const res = await pool.query(queryText, queryValues)
        return res.rows[0]
    } catch (err) {
        return {error: err}
    }
}

exports.getRoomsByDiscordId = async (discordId) => {
    try {
        const queryText =   'select rooms.id, rooms.name, rooms.expansion from rooms ' +
                            'join roomRoles on rooms.id = roomRoles.roomId ' +
                            'join roles on roles.id = roomRoles.roleId ' +
                            'where roomRoles.userDiscordId = $1'
        const queryValues = [discordId]
        const res = await pool.query(queryText, queryValues)
        return res.rows
    } catch (err) {
        return {error: err}
    }
}

exports.createRoom = async (roomName) => {
    try {
        const queryText = "insert into rooms (name, createdAt, expansion) values ($1, now() AT TIME ZONE 'UTC', $2) returning *"
        const queryValues = [roomName, 'Shadowbringers']
        const result = await pool.query(queryText, queryValues)
        return result.rows[0]
    } catch (err) {
        console.log(err.stack)
        return {error: err}
    }
}

exports.linkRoomToCreator = async (roomId, discordId) => {
    try {
        const queryText = "insert into roomRoles (userDiscordId, roomId, roleId) VALUES ($1, $2, $3)"
        const queryValues = [discordId, roomId, 1]
        await pool.query(queryText, queryValues)
        return true
    } catch(err) {
        console.error(err)
        return false
    }
}

exports.setupInitialMonsterStatusesForRoom = async (roomId) => {
    try {
        for(let i=1; i<=12; i++) {
            const queryText = "insert into roomStatuses (roomId, monsterId, currentStatus, deathTimestamp) VALUES ($1, $2, $3, now() AT TIME ZONE 'UTC')"
            const queryValues = [roomId, i, 'Unknown']
            await pool.query(queryText, queryValues)
        }
        return true
    } catch (err) {
        console.error(err)
        return false
    }
}

exports.getUserByUsernameAndDiscriminator = async (discordUsername, discordDiscriminator) => {
    try {
        const queryText = 'select * from users where discordUsername = $1 and discordDiscriminator = $2'
        const queryValues = [discordUsername, discordDiscriminator]
        let result = await pool.query(queryText, queryValues)
        return result.rows[0]
    } catch (err) {
        return {error: err}
    }
}

exports.upsertUser = async(discordUser) => {
    try {
        const queryText =   'insert into users (discordId, discordDiscriminator, discordAvatar, discordUsername) values ($1, $2, $3, $4) ' +
                            'on conflict (discordId) ' +
                            'do update set (discordUsername, discordDiscriminator, discordAvatar) = ($4, $2, $3) '
        const queryValues = [discordUser.discordId, discordUser.discordDiscriminator, discordUser.discordAvatar, discordUser.discordUsername]
        await pool.query(queryText, queryValues)
        return true
    } catch (err) {
        console.log(err.stack)
        return false
    }
}

exports.updateMonsterStatusForRoom = async (roomId, monsterId, monsterStatus) => {
    try {

        if(!monsterStatus.includes('Dead')) {
            const queryText = 'update roomStatuses set currentStatus = $1 where roomId = $2 and monsterId = $3'
            const queryValues = [monsterStatus, roomId, monsterId]
            await pool.query(queryText, queryValues)
        } else {
            const queryText = "update roomStatuses set currentStatus = $1, deathTimestamp = now() AT TIME ZONE 'UTC' where roomId = $2 and monsterId = $3"
            const queryValues = [monsterStatus, roomId, monsterId]
            await pool.query(queryText, queryValues)
        }
        return true
    } catch (err) {
        console.log(err.stack)
        return false
    }
}
