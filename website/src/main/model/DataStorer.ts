import * as LZString from "lz-string"

import { ApiData } from "./data/ApiData"
import { Logger } from "../utilities/Logger"
import { LzstringWorkerCaller } from "./LzstringWorkerCaller"
import { TimestampedData } from "./TimestampedData"

export class DataStorer {
  private static readonly dataKey = "data"

  public static dataIsOkay(storedData: TimestampedData | undefined): storedData is TimestampedData {
    const isUpToDate = storedData !== undefined
      && DataStorer.isCorrectVersion(storedData.buildTimestamp)
      && DataStorer.isRecentEnough(storedData.storeTimestamp)
    Logger.log("The stored data is up-to-date, that is from the correct build and recent enough.")
    return isUpToDate
  }

  public static loadData(): TimestampedData | undefined {
    Logger.log("Loading data from local storage.")
    const compressedData = localStorage.getItem(DataStorer.dataKey)
    // tslint:disable-next-line:no-null-keyword
    if (compressedData === null) {
      return undefined
    }

    const dataString = LZString.decompressFromUTF16(compressedData)
    Logger.log(`Data size loaded: ${compressedData.length}, decompressed: ${dataString.length}.`)

    try {
      Logger.log("Done loading. Parsing JSON string.")
      return JSON.parse(dataString) as TimestampedData
    }
    catch (error) {
      console.error(error)
      return undefined
    }
    finally {
      Logger.log("Done parsing JSON. Done loading data.")
    }
  }

  public static async saveData(data: ApiData): Promise<void> {
    Logger.log("Saving data to local storage using worker.")

    const timestampedData: TimestampedData = {
      buildTimestamp: __BUILD_TIMESTAMP__,
      data: data,
      storeTimestamp: new Date().valueOf()
    }

    const compressedString = await LzstringWorkerCaller.compressTimestampedDataToString(timestampedData)

    localStorage.setItem(DataStorer.dataKey, compressedString)
  }

  private static isCorrectVersion(storedBuildTimestamp: number) {
    const timestampMatches = storedBuildTimestamp === __BUILD_TIMESTAMP__

    if (timestampMatches) {
      Logger.log("Build timestamp on stored data matches.")
    }
    else {
      Logger.log("Build timestamp on stored data does not match. The saved data might not match the new code base.")
    }

    return timestampMatches
  }

  private static isRecentEnough(storeTimestamp: number) {
    const now = new Date()
    // tslint:disable-next-line:prefer-const
    let latestDataCrawl = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 5, 0, 0)
    if (latestDataCrawl.valueOf() > now.valueOf()) {
      latestDataCrawl.setDate(latestDataCrawl.getDate() - 1)
    }

    const millisecondsIn24Hours = 24 * 60 * 60 * 1000
    const millisecondsSinceLatestFetch = latestDataCrawl.valueOf() - storeTimestamp
    const isRecentEnough = millisecondsSinceLatestFetch < millisecondsIn24Hours

    if (isRecentEnough) {
      Logger.log("The stored data is recent enough.")
    }
    else {
      Logger.log("The stored data is outdated.")
    }

    return isRecentEnough
  }
}