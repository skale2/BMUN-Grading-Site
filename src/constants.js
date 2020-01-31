const DELEGATIONS = [
  "Adolf A. Berle",
  "Basil O' Connor",
  "Benjamin V. Cohen",
  "Felix Frankfurter",
  "Frances Perkins",
  "George Peek",
  "Harold Ickes",
  "Harry Hopkins",
  "Henry Morgenthau Jr.",
  "Henry Thomas Rainey",
  "Huey Long",
  "Hugh S. Johnson",
  "Jim Farley",
  "Joe T. Robinson",
  "Louis Brandeis",
  "Louis McHenry Howe",
  "Marriner Eccles",
  "Paul M. O'Leary",
  "Raymond Moley",
  "Rexford Tugwell",
  "Robert C. Weaver",
  "Robert F. Wagner",
  "Thomas Gardiner Corcoran",
  "William Bankhead"
];

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

const ROWIdx = {
  datetime: 0,
  delegation: 1,
  type: 2,
  score: 3,
  tags: 4,
  comments: 5
};

const SPEAKERS_LIST = "Speaker's List";
const MODERATED = "Moderated";
const UNMODERATED = "Unmoderated";
const FORMAL = "Formal";
const COMMENT = "Comment";
const CRISIS = "Crisis";

const Types = [SPEAKERS_LIST, MODERATED, UNMODERATED, FORMAL, COMMENT, CRISIS];

export {
  SPEAKERS_LIST,
  MODERATED,
  UNMODERATED,
  FORMAL,
  COMMENT,
  CRISIS,
  DELEGATIONS,
  TAGS,
  ROWIdx,
  Types
};
