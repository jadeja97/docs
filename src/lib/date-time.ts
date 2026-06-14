import { execSync } from "node:child_process";
import { relative } from "node:path";

/* ============================================================================================= */

/**
 * get last modified date-time in ISO format from git history (milliseconds removed)
 *
 * @param filePath - absolute file path
 */
export const getLastModified = (filePath: string): string => {
  //
  try {
    // `.git` file path (absolute)
    const repoRoot = execSync("git rev-parse --show-toplevel", { encoding: "utf8" }).trim();

    const relativePath = relative(repoRoot, filePath);

    // get the last commit date for the specific file in ISO format
    const date = execSync(`git log -1 --format="%cI" -- "${relativePath}"`, {
      encoding: "utf8",
      cwd: repoRoot,
    }).trim();

    // no git history for this file
    if (!date) {
      return removeMilliSeconds(new Date().toISOString());
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return removeMilliSeconds(new Date().toISOString());
    }

    return removeMilliSeconds(parsedDate.toISOString());

    //
  } catch (error) {
    // oxlint-disable-next-line eslint/no-console
    console.error("Could not get git date, falling back to current time", error);
    return removeMilliSeconds(new Date().toISOString());
  }
};

/* ============================================================================================= */

/**
 * get most recent date-time from the provided list
 *
 * @param dateTimes - date times list
 */
export const getMostRecentDateTime = (dateTimes: string[]): string => {
  //
  // oxlint-disable-next-line prefer-destructuring
  let recent: string = dateTimes[0];
  let recentInNumber: number = Number(new Date(recent));

  for (const dateTime of dateTimes) {
    //
    const current = Number(new Date(dateTime));

    if (current > recentInNumber) {
      recent = dateTime;
      recentInNumber = current;
    }
  }

  return recent;
};

/* ============================================================================================= */

/**
 * remove milliseconds from the date-time string
 *
 * @param dateTimeISO - date-time in ISO string
 */
export const removeMilliSeconds = (dateTimeISO: string): string => {
  return `${dateTimeISO.split(".")[0]}Z`.replaceAll(/Z+/g, "Z");
};
