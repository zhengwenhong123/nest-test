import {IsDateString, IsJSON, IsMilitaryTime, IsNotEmpty, IsNumber, IsOptional, IsString} from 'class-validator'
import {Artist} from "../../artists/artist.entity";

export class CreateSongDto {
    @IsString()
    @IsNotEmpty()
    readonly title: string;

    @IsNotEmpty()
    @IsJSON()
    @IsNumber({},{each:true})
    readonly artists: Artist[];

    @IsNotEmpty()
    @IsDateString()
    readonly releaseDate : Date;

    @IsMilitaryTime()
    @IsNotEmpty()
    readonly duration: Date;

    @IsString()
    @IsOptional()
    readonly lyrics: string;
}
