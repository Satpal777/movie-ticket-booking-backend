import { z } from 'zod';
import BaseDto from '../../utils/base.dto.js';

class MovieIdParamDto extends BaseDto {
    static schema = z.object({
        id: z.coerce.number().int().positive(),
    });
}

class MovieIdParamForShowsDto extends BaseDto {
    static schema = z.object({
        movieId: z.coerce.number().int().positive(),
    });
}

class CinemaShowsParamDto extends BaseDto {
    static schema = z.object({
        movieId:  z.coerce.number().int().positive(),
        cinemaId: z.coerce.number().int().positive(),
    });
}

class ShowIdParamDto extends BaseDto {
    static schema = z.object({
        showId: z.coerce.number().int().positive(),
    });
}

class BookSeatsDto extends BaseDto {
    static schema = z.object({
        seatIds: z
            .array(z.number().int().positive())
            .min(1, 'Select at least one seat')
            .max(10, 'Cannot book more than 10 seats at once'),
    });
}

export type MovieIdParamDtoType          = z.infer<typeof MovieIdParamDto.schema>;
export type MovieIdParamForShowsDtoType  = z.infer<typeof MovieIdParamForShowsDto.schema>;
export type CinemaShowsParamDtoType      = z.infer<typeof CinemaShowsParamDto.schema>;
export type ShowIdParamDtoType           = z.infer<typeof ShowIdParamDto.schema>;
export type BookSeatsDtoType             = z.infer<typeof BookSeatsDto.schema>;

export {
    MovieIdParamDto,
    MovieIdParamForShowsDto,
    CinemaShowsParamDto,
    ShowIdParamDto,
    BookSeatsDto,
};
