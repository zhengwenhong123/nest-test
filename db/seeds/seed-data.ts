import {EntityManager} from "typeorm";
import * as bcrypt from "bcryptjs";
import {faker} from "@faker-js/faker";
import {v4 as uuid4} from "uuid";
import {User} from "../../src/users/user.entity";
import {Artist} from "../../src/artists/artist.entity";
import {Playlist} from "../../src/playlists/entities/playlist.entity";


export const seedData = async (manager: EntityManager) => {

    await Promise.all([seedPlayLists(manager), seedUsersAndArtists(manager)])

    async function createUser() {
        const password = await bcrypt.hash('123456', await bcrypt.genSalt());
        return manager.create(User, {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            password,
            apiKey: uuid4(),
        });
    }

    async function seedUsersAndArtists(manager: EntityManager) {
        const user = await createUser();
        await manager.save(user);
        await manager.save(manager.create(Artist, {user}));
    }

    async function seedPlayLists(manager: EntityManager) {
        const user = await createUser();
        await manager.save(user);
        await manager.save(manager.create(Playlist, {
            name: faker.music.genre(),
            user,
        }))
    }
}