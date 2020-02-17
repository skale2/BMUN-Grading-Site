import { SPEECH_TYPES, COMMITTEES, COMMITTEE_BACKENDS } from "./constants";

const API_KEY = "AIzaSyDcsmVfAWv_lR2kKxqED5dGBQxuIiPzp08";
const CLIENT_ID =
  "629249540008-mgv1q5m3sh5f700r1teji7acopl8aavn.apps.googleusercontent.com";
const DISCOVERY_DOCS = [
  "https://sheets.googleapis.com/$discovery/rest?version=v4"
];
const SCOPE =
  "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/spreadsheets";

function rowToObject(row, i) {
  return {
    row: i,
    date: new Date(parseInt(row[0])),
    delegation: row[1],
    type: SPEECH_TYPES[parseInt(row[2])],
    score: parseInt(row[3]),
    tags: row[4] !== undefined && row[4].length > 0 ? row[4].split(",") : [],
    text: row[5] !== undefined ? row[5] : ""
  };
}

class Backend {
  constructor() {
    this.isReady = false;
    this.auth = null;
    this.user = null;
    this.isReadyCallbacks = [];
    this.spreadsheetId = undefined;
    this.committee = undefined;
    this.delegations = undefined;

    window.gapi.load("client:auth2", this.initClient);
  }

  initClient = () => {
    window.gapi.client
      .init({
        clientId: CLIENT_ID,
        scope: SCOPE,
        discoveryDocs: DISCOVERY_DOCS,
        apiKey: API_KEY
      })
      .then(
        () => {
          this.auth = window.gapi.auth2.getAuthInstance();
          this.isReady = this.auth.isSignedIn.get();
          for (let callback of this.isReadyCallbacks) {
            callback();
          }
        },
        error => console.log(error)
      );
  };

  signIn = () => {
    return this.auth.signIn().then(result => {
      this.isReady = true;
      return result;
    });
  };

  setCommittee = committee => {
    if (committee !== this.committee) {
      if (!Object.keys(COMMITTEES).includes(committee))
        console.error(`Unknown committee: ${committee}`);

      this.committee = committee;
      this.spreadsheetId = COMMITTEE_BACKENDS[committee];
    }
  };

  comments = () => {
    if (!this.auth.isSignedIn.get()) {
      this.auth.signIn();
    } else if (this.spreadsheetId === undefined) {
      console.error("Committee not defined");
    }

    return window.gapi.client.sheets.spreadsheets.values
      .get({
        spreadsheetId: this.spreadsheetId,
        range: `Sheet1!A:F`,
        dateTimeRenderOption: "FORMATTED_STRING",
        majorDimension: "ROWS",
        valueRenderOption: "FORMATTED_VALUE"
      })
      .then(
        response => response.result.values.map(rowToObject),
        error => console.log(error)
      );
  };

  grade = (delegation, type, score, tags, text) => {
    if (!this.auth.isSignedIn.get()) {
      this.auth.signIn();
    }

    return window.gapi.client.sheets.spreadsheets.values
      .append(
        {
          spreadsheetId: this.spreadsheetId,
          includeGridData: false,
          valueInputOption: "USER_ENTERED",
          insertDataOption: "INSERT_ROWS",
          range: `Sheet1!A:F`
        },
        {
          majorDimension: "ROWS",
          range: `Sheet1!A:F`,
          values: [
            [
              Date.now(),
              delegation,
              type.toString(),
              score.toString(),
              Array.from(tags).join(","),
              text
            ]
          ]
        }
      )
      .then(
        response => response,
        error => console.log(error)
      );
  };

  edit = (row, delegation, type, score, tags, text) => {
    if (!this.auth.isSignedIn.get()) {
      this.auth.signIn();
    }

    // We add 1 to each row because sheet ranges are 1-indexed,
    // but all of our rows are stored 0-indexed.
    return window.gapi.client.sheets.spreadsheets.values
      .update(
        {
          spreadsheetId: this.spreadsheetId,
          includeGridData: false,
          valueInputOption: "USER_ENTERED",
          range: `Sheet1!A${row + 1}:F${row + 1}`
        },
        {
          majorDimension: "ROWS",
          range: `Sheet1!A${row + 1}:F${row + 1}`,
          values: [
            [
              Date.now(),
              delegation,
              type.toString(),
              score.toString(),
              Array.from(tags).join(","),
              text
            ]
          ]
        }
      )
      .then(
        response => response,
        error => console.log(error)
      );
  };

  status = delegation => {
    if (!this.auth.isSignedIn.get()) {
      this.auth.signIn();
    }

    return window.gapi.client.sheets.spreadsheets.values
      .get({
        spreadsheetId: this.spreadsheetId,
        range: `Sheet1!A:F`,
        dateTimeRenderOption: "FORMATTED_STRING",
        majorDimension: "ROWS",
        valueRenderOption: "FORMATTED_VALUE"
      })
      .then(
        response =>
          response.result.values
            .map(rowToObject)
            .filter(row => row.delegation === delegation),
        error => console.log(error)
      );
  };

  deleteComment = row => {
    if (!this.auth.isSignedIn.get()) {
      this.auth.signIn();
    }

    return window.gapi.client.sheets.spreadsheets.batchUpdate(
      { spreadsheetId: this.spreadsheetId },
      {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: 0,
                dimension: "ROWS",
                startIndex: row,
                endIndex: row + 1
              }
            }
          }
        ],
        includeSpreadsheetInResponse: false,
        responseIncludeGridData: false
      }
    );
  };
}

const backend = new Backend();

export default backend;
