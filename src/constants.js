import {
  API_KEY,
  CLIENT_ID,
  COMMITTEES,
  COMMITTEE_BACKENDS,
  DELEGATIONS
} from "./config";

const TAGS = [
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

const COMMITTEES_REVERSE = {};
for (const committee in COMMITTEES) {
  COMMITTEES_REVERSE[COMMITTEES[committee]] = committee;
}

const SPEAKERS_LIST = "Speaker's List";
const MODERATED = "Moderated";
const UNMODERATED = "Unmoderated";
const FORMAL = "Formal";
const COMMENT = "Comment";
const CRISIS = "Crisis";

const SPEECH_TYPES = [
  SPEAKERS_LIST,
  MODERATED,
  UNMODERATED,
  FORMAL,
  COMMENT,
  CRISIS
];

const SORTS = {
  a_z: "A-Z",
  z_a: "Z-A",
  spoken_most: "Spoken most",
  spoken_least: "Spoken least",
  latest_first: "Latest first",
  earliest_first: "Earliest first",
  highest_score: "Highest score",
  lowest_score: "Lowest score"
};

export {
  API_KEY,
  CLIENT_ID,
  COMMITTEES,
  COMMITTEES_REVERSE,
  COMMITTEE_BACKENDS,
  SPEAKERS_LIST,
  MODERATED,
  UNMODERATED,
  FORMAL,
  COMMENT,
  CRISIS,
  DELEGATIONS,
  TAGS,
  SPEECH_TYPES,
  SORTS
};
