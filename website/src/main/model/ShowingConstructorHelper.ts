import { ImmutableDate } from "./moment/ImmutableDate"
import { Movie } from "./Movie"
import { SelectableDate } from "./SelectableDate"
import { Theater } from "./Theater"

export interface ShowingConstructorHelper {
  getMovie: (movieIndex: number) => Movie,
  getTheater: (theaterIndex: number) => Theater,
  getOrAddSelectableDate: (date: ImmutableDate) => SelectableDate,
}