const DELEGATIONS = [
  "Adolf A. Berle",
  "Al Smith",
  "Alfred P. Sloan",
  "Andrew Mellon",
  "Basil O' Connor",
  "Benjamin V. Cohen",
  "Bertrand Snell",
  "Dean Acheson",
  "Eugene Meyer",
  "Felix Frankfurter",
  "Frances Perkins",
  "Frank Knox",
  "Frederick Steiwer",
  "George Peek",
  "Harold Ickes",
  "Harry F. Byrd",
  "Harry Hopkins",
  "Henry Morgenthau Jr.",
  "Henry Thomas Rainey",
  "Huey Long",
  "Hugh S. Johnson",
  "Irénée du Pont",
  "James Wolcott Wadsworth Jr.",
  "Jim Farley",
  "Joe T. Robinson",
  "John Davis",
  "John Howard Pew",
  "Jouett Shouse",
  "Lester Dickinson",
  "Lewis Douglas",
  "Louis Brandeis",
  "Louis McHenry Howe",
  "Marriner Eccles",
  "Milton Friedman",
  "Nathan L. Miller",
  "Odgen Mills",
  "Paul M. O'Leary",
  "Pierre du Pont",
  "Raymond Moley",
  "Rexford Tugwell",
  "Robert A. Taft",
  "Robert C. Weaver",
  "Robert F. Wagner",
  "Robert Luce",
  "Rush Holt Sr.",
  "Thomas Gardiner Corcoran",
  "Wendell Willkie",
  "William Bankhead",
  "William Randolph Hearst"
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
