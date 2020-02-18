import {
	COMMITTEES,
	COMMITTEE_BACKENDS,
	DELEGATIONS
 } from "./config";

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
