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

const COMMITTEE_BACKENDS = {
  jcc_new_deal: "1Hfuo9tQeTD_u-QUD55MvTdhm-xYO-0LzTsXy_B1mR84",
  jcc_old_guard: "1aBD4NR8n8WkA_p_lIG023pAFjNjD5zXn84cj6XBXHcI"
};

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
