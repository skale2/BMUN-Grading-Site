/**
 * Google OAuth API key, used to identify the application with the Sheets API.
 * See https://cloud.google.com/docs/authentication/api-keys.
 */
export const API_KEY = "AIzaSyDcsmVfAWv_lR2kKxqED5dGBQxuIiPzp08";

/**
 * Google OAuth Client ID, used to authenticate the end user.
 * See https://cloud.google.com/docs/authentication/end-user
 */
export const CLIENT_ID =
  "629249540008-mgv1q5m3sh5f700r1teji7acopl8aavn.apps.googleusercontent.com";

export const SPEAKERS_LIST = "Speaker's List";
export const MODERATED = "Moderated";
export const UNMODERATED = "Unmoderated";
export const FORMAL = "Formal";
export const COMMENT = "Comment";
export const CRISIS = "Crisis";

export const SPEECH_TYPES = [
  SPEAKERS_LIST,
  MODERATED,
  UNMODERATED,
  FORMAL,
  COMMENT,
  CRISIS
];

export const TAGS = [
  "Great Points",
  "Convincing Speaker",
  "Good Body Language",
  "Shows Leadership",
  "Encourages Others",
  "Uses Parli Pro Well",
  "Well Researched",
  "Highly Professional",
  "Represents Delegation",
  "Persuasive Caucuser",
  "Teaches Others",
  "Good Partnership",
  "Leverages Resources",
  "On Topic",
  "Well Written Resolution",
  "Makes Connections"
];

export const SORTS = {
  a_z: "A-Z",
  z_a: "Z-A",
  spoken_most: "Spoken most",
  spoken_least: "Spoken least",
  latest_first: "Latest first",
  earliest_first: "Earliest first",
  highest_score: "Highest score",
  lowest_score: "Lowest score"
};