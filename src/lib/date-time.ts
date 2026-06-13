import { execSync } from "node:child_process";
import { relative } from "node:path";

/* ============================================================================================= */

export const getLastModified = (filePath: string): string => {
  try {
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

export const getRecentDateTime = (dateTimes: string[]) => {
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

export const removeMilliSeconds = (dateTimeISO: string) => {
  return `${dateTimeISO.split(".")[0]}Z`.replaceAll(/Z+/g, "Z");
};
