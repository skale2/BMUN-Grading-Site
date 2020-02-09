const DELEGATIONS = {
  jcc_new_deal: [
    "Adolf A. Berle",
    "Basil O' Connor",
    "Benjamin V. Cohen",
    "F. Palmer Weber",
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
  ],
  jcc_old_guard: [
    "Al Smith",
    "Alfred P. Sloan",
    "Andrew Mellon",
    "Bertrand Snell",
    "Dean Acheson",
    "Eugene Meyer",
    "Frank Knox",
    "Frederick Steiwer",
    "Harry F. Byrd",
    "Irénée du Pont",
    "James Wolcott Wadsworth Jr.",
    "John Davis",
    "John Howard Pew",
    "Jouett Shouse",
    "Lester Dickinson",
    "Lewis Douglas",
    "Milton Friedman",
    "Nathan L. Miller",
    "Odgen Mills",
    "Pierre du Pont",
    "Robert A. Taft",
    "Robert Luce",
    "Rush Holt Sr.",
    "Wendell Willkie",
    "William Randolph Hearst"
  ]
};

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

const COMMITTEES = {
  jcc_new_deal: "JCC New Deal",
  jcc_old_guard: "JCC Old Guard"
};

const COMMITTEES_REVERSE = {};
for (const committee in COMMITTEES) {
  COMMITTEES_REVERSE[COMMITTEES[committee]] = committee;
}

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
  COMMITTEES,
  COMMITTEES_REVERSE,
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
