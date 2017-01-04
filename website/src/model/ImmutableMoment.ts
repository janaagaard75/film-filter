import * as moment from "moment"
import { Moment } from "moment"

import { isString } from "../utilities"

export class ImmutableMoment {
  constructor(dateTime?: string | Moment) {
    if (dateTime === undefined) {
      this.moment = moment()
    }
    else if (isString(dateTime)) {
      this.moment = moment(this.parseAsLocalDateTime(dateTime))
    }
    else {
      this.moment = moment(dateTime)
    }
  }

  private moment: Moment

  public diff(other: ImmutableMoment): number {
    const diff = this.moment.diff(other.moment)
    return diff
  }

  public equals(other: ImmutableMoment): boolean {
    const equals = this.moment.unix() === other.moment.unix()
    return equals
  }

  public format(format: string): string {
    const formatted = this.moment.format(format)
    return formatted
  }

  public isAfter(other: ImmutableMoment) {
    const isAfter = this.moment.isAfter(other.moment)
    return isAfter
  }

  private parseAsLocalDateTime(dateString: string): Date {
    const numbers = dateString.split(/\D/)
    const dateTime = new Date(
      parseInt(numbers[0], 10),
      parseInt(numbers[1], 10) - 1,
      parseInt(numbers[2], 10),
      parseInt(numbers[3], 10),
      parseInt(numbers[4], 10),
      parseInt(numbers[5], 10))

    return dateTime
  }

  /** Return a new ImmutableMoment where the hours have been stripped. */
  public toDate(): ImmutableMoment {
    const date = new ImmutableMoment(moment(new Date(
      this.moment.year(),
      this.moment.month(),
      this.moment.date()
    )))

    return date
  }
}