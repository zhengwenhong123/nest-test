import {Injectable} from '@nestjs/common';
import {Artist} from "./artist.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@Injectable()
export class ArtistsService {
    constructor(@InjectRepository(Artist) private readonly artistRepository: Repository<Artist>) {

    }

    findArtist(userId: number): Promise<Artist> {
        return this.artistRepository.findOneBy({ user: { id: userId } });
    }



}
