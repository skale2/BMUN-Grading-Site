/**
 * Configuration for this app. Change these constants to change the 
 * app's behavior. 
 */

// Google OAuth API key, used to identify the application with the Sheets API. 
// See https://cloud.google.com/docs/authentication/api-keys.
const API_KEY = "AIzaSyDcsmVfAWv_lR2kKxqED5dGBQxuIiPzp08";

// Google OAuth Client ID, used to authenticate the end user.
// See https://cloud.google.com/docs/authentication/end-user
const CLIENT_ID =
  "629249540008-mgv1q5m3sh5f700r1teji7acopl8aavn.apps.googleusercontent.com";

// A mapping from the unique identifier for each committee to
// its display representation.
const COMMITTEES = {
  jcc_new_deal: "JCC New Deal",
  jcc_old_guard: "JCC Old Guard"
};

// A mapping from the unique identifier for each committee to
// the spreadsheet ID of the Google Sheets spreadsheet backing 
// its data. 
// See https://developers.google.com/sheets/api/guides/concepts#spreadsheet_id.
//
// This spreadsheet must contain a single sheet named 'Sheet1'
// with sheet ID 0.
// See https://developers.google.com/sheets/api/guides/concepts#sheet_id.
const COMMITTEE_BACKENDS = {
  jcc_new_deal: "1Hfuo9tQeTD_u-QUD55MvTdhm-xYO-0LzTsXy_B1mR84",
  jcc_old_guard: "1aBD4NR8n8WkA_p_lIG023pAFjNjD5zXn84cj6XBXHcI"
};

// A mapping from the unique identifier for each committee to
// the delegations in that committee.
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

export {
	API_KEY,
	CLIENT_ID,
	COMMITTEES,
	COMMITTEE_BACKENDS,
	DELEGATIONS
}