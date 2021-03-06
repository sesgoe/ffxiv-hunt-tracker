DROP TABLE IF EXISTS monsters CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;
DROP TABLE IF EXISTS roomAudits CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS roomStatuses CASCADE;
DROP TABLE IF EXISTS roomRoles CASCADE;

CREATE TABLE monsters (
  id SERIAL PRIMARY KEY,
  name text,
  imagePath text,
  expansion text
);

CREATE TABLE users (
  discordId text UNIQUE,
  discordUsername text,
  discordDiscriminator text,
  discordAvatar text,
  PRIMARY KEY(discordUsername, discordDiscriminator)
);

CREATE TABLE rooms (
  id SERIAL PRIMARY KEY,
  name text UNIQUE,
  createdAt timestamp,
  expansion varchar,
  isPrivate boolean
);

CREATE TABLE roomAudits (
  id SERIAL PRIMARY KEY,
  roomId int,
  discordId text,
  monsterId int,
  previousStatus int,
  newStatus int,
  updateTimestamp timestamp
);

CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name text
);

CREATE TABLE roomStatuses (
  roomId int,
  monsterId int,
  currentStatus int, --(-1 = dead, 0 = unknown, 1 = alive)
  deathTimestamp timestamp
);

CREATE TABLE roomRoles (
  userDiscordId text,
  roomId int,
  roleId int,
  PRIMARY KEY (userDiscordId, roomId, roleId)
);

ALTER TABLE roomStatuses ADD FOREIGN KEY (roomId) REFERENCES rooms (id) ON DELETE CASCADE;
ALTER TABLE roomStatuses ADD FOREIGN KEY (monsterId) REFERENCES monsters (id) ON DELETE CASCADE;

ALTER TABLE roomRoles ADD FOREIGN KEY (userDiscordId) REFERENCES users (discordId) ON DELETE CASCADE;
ALTER TABLE roomRoles ADD FOREIGN KEY (roomId) REFERENCES rooms (id) ON DELETE CASCADE;
ALTER TABLE roomRoles ADD FOREIGN KEY (roleId) REFERENCES roles (id) ON DELETE CASCADE;

INSERT INTO monsters (name, imagePath, expansion) VALUES ('Erle', '@/assets/hunts/erle.png', 'Stormblood');
INSERT INTO monsters (name, imagePath, expansion) VALUES ('Orcus', '@/assets/hunts/orcus.png', 'Stormblood');
INSERT INTO monsters (name, imagePath, expansion) VALUES ('Luminare', '@/assets/hunts/luminare.png', 'Stormblood');
INSERT INTO monsters (name, imagePath, expansion) VALUES ('Mahisha', '@/assets/hunts/mahisha.png', 'Stormblood');
INSERT INTO monsters (name, imagePath, expansion) VALUES ('Vochstein', '@/assets/hunts/vochstein.png', 'Stormblood');
INSERT INTO monsters (name, imagePath, expansion) VALUES ('Aqrabuamelu', '@/assets/hunts/aqrabuamelu.png', 'Stormblood');
INSERT INTO monsters (name, imagePath, expansion) VALUES ('Funa Yurei', '@/assets/hunts/funa.png', 'Stormblood');
INSERT INTO monsters (name, imagePath, expansion) VALUES ('Oni Yumemi', '@/assets/hunts/oni.png', 'Stormblood');
INSERT INTO monsters (name, imagePath, expansion) VALUES ('Angada', '@/assets/hunts/angada.png', 'Stormblood');
INSERT INTO monsters (name, imagePath, expansion) VALUES ('Gajasura', '@/assets/hunts/gajasura.png', 'Stormblood');
INSERT INTO monsters (name, imagePath, expansion) VALUES ('Sum', '@/assets/hunts/sum.png', 'Stormblood');
INSERT INTO monsters (name, imagePath, expansion) VALUES ('Girimekhala', '@/assets/hunts/girimekhala.png', 'Stormblood');


INSERT INTO roles (name) VALUES ('Creator');
INSERT INTO roles (name) VALUES ('Hunt Train Organizer');
INSERT INTO roles (name) VALUES ('Scout');
INSERT INTO roles (name) VALUES ('Member');
