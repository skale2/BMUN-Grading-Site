import moment from "moment";
import { message } from "antd";
import {
  API_KEY,
  CLIENT_ID,
  SPEECH_TYPES,
  COMMITTEES,
  COMMITTEE_BACKENDS
} from "./constants";

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
    text: row[5] !== undefined ? row[5] : "",
    author: row[6]
  };
}

class Backend {
  constructor() {
    this.isReady = false;
    this.auth = undefined;
    this.spreadsheetId = undefined;
    this.committee = undefined;
    this.delegations = undefined;
    this.isReadyCallbacks = [];
    this.user = {
      name: undefined,
      email: undefined,
      avatarUrl: undefined
    };

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

          let basicProfile = this.auth.currentUser.je.getBasicProfile();

          /* I'm not sure if this is how you're supposed to use this... */
          this.user = {
            name: basicProfile.Ad,
            email: basicProfile.zu,
            avatarUrl: basicProfile.UK
          };

          for (let callback of this.isReadyCallbacks) {
            callback();
          }

          console.log(this.user);
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

  getUser = () => {
    return this.user;
  };

  comments = () => {
    if (!this.auth.isSignedIn.get()) {
      this.auth.signIn();
    } else if (this.spreadsheetId === undefined) {
      console.error("Committee not defined");
      message.error("We're having some issues on our end...");
    }

    return window.gapi.client.sheets.spreadsheets.values
      .get({
        spreadsheetId: this.spreadsheetId,
        range: "Sheet1!A:G",
        dateTimeRenderOption: "FORMATTED_STRING",
        majorDimension: "ROWS",
        valueRenderOption: "FORMATTED_VALUE"
      })
      .then(
        response =>
          response.result.values === undefined
            ? []
            : response.result.values.map(rowToObject),
        error => {
          console.error(error);
          message.error("We're having some issues on our end...");
        }
      );
  };

  grade = (delegation, type, score, tags, text, author) => {
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
          range: "Sheet1!A:G"
        },
        {
          majorDimension: "ROWS",
          range: "Sheet1!A:G",
          values: [
            [
              Date.now(),
              delegation,
              type.toString(),
              score.toString(),
              Array.from(tags).join(","),
              text,
              author
            ]
          ]
        }
      )
      .then(
        response => response,
        error => {
          console.error(error);
          message.error("We're having some issues on our end...");
        }
      );
  };

  edit = (row, delegation, type, score, tags, text, author) => {
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
          range: `Sheet1!A${row + 1}:G${row + 1}`
        },
        {
          majorDimension: "ROWS",
          range: `Sheet1!A${row + 1}:G${row + 1}`,
          values: [
            [
              Date.now(),
              delegation,
              type.toString(),
              score.toString(),
              Array.from(tags).join(","),
              text,
              author
            ]
          ]
        }
      )
      .then(
        response => response,
        error => {
          console.error(error);
          message.error("We're having some issues on our end...");
        }
      );
  };

  status = delegation => {
    if (!this.auth.isSignedIn.get()) {
      this.auth.signIn();
    }

    return window.gapi.client.sheets.spreadsheets.values
      .get({
        spreadsheetId: this.spreadsheetId,
        range: "Sheet1!A:G",
        dateTimeRenderOption: "FORMATTED_STRING",
        majorDimension: "ROWS",
        valueRenderOption: "FORMATTED_VALUE"
      })
      .then(
        response =>
          response.result.values === undefined
            ? []
            : response.result.values
                .map(rowToObject)
                .filter(row => row.delegation === delegation),
        error => {
          console.error(error);
          message.error("We're having some issues on our end...");
        }
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

  exportNew = (title, includeHeader) => {
    return this.comments()
      .then(comments =>
        Promise.all([
          window.gapi.client.sheets.spreadsheets.create(
            {},
            {
              properties: {
                title: title
              },
              sheets: [
                {
                  properties: {
                    sheetId: 0,
                    title: "Sheet1"
                  }
                }
              ]
            }
          ),
          comments
        ])
      )
      .then(([{ result }, comments]) => {
        return Promise.all([
          window.gapi.client.sheets.spreadsheets.values.append(
            {
              spreadsheetId: result.spreadsheetId,
              includeGridData: false,
              valueInputOption: "USER_ENTERED",
              insertDataOption: "OVERWRITE",
              range: `Sheet1!A1:G${comments.length}`
            },
            {
              range: `Sheet1!A1:G${comments.length}`,
              majorDimension: "ROWS",
              values: (includeHeader
                ? [
                    [
                      "Timestamp",
                      "Delegation",
                      "Type",
                      "Score",
                      "Tags",
                      "Comment",
                      "Author"
                    ]
                  ]
                : []
              ).concat(
                comments.map(comment => [
                  moment(comment.date).format("MM/DD/YYYY H:MM:SS"),
                  comment.delegation,
                  comment.type,
                  comment.score,
                  comment.tags.length > 0
                    ? "[" + comment.tags.join("], [") + "]"
                    : "",
                  comment.text,
                  comment.author
                ])
              )
            }
          ),
          result,
          comments
        ]);
      })
      .then(
        ([_, spreadsheet, __]) => spreadsheet,
        error => {
          console.error(error);
          message.error("We're having some issues on our end...");
        }
      );
  };

  exportUpdate = (spreadsheetId, location, includeHeader) => {
    if (!/(.+?)!([A-Z])([0-9]+)/i.test(location)) {
      return Promise.reject({
        result: {
          error: {
            code: 400,
            message: "Location not in single-cell A1 notation"
          }
        }
      });
    }

    return this.comments().then(comments => {
      let [_, sheetName, column, row] = location.match(
        /(.+?)!([A-Z])([0-9]+)/i
      );

      let range = `${sheetName}!${column}${row}:${String.fromCharCode(
        column.charCodeAt(0) + 6
      )}${row + comments.length}`;

      return window.gapi.client.sheets.spreadsheets.values.update(
        {
          spreadsheetId: spreadsheetId,
          includeGridData: false,
          valueInputOption: "USER_ENTERED",
          range: range
        },
        {
          range: range,
          majorDimension: "ROWS",
          values: (includeHeader
            ? [
                [
                  "Timestamp",
                  "Delegation",
                  "Type",
                  "Score",
                  "Tags",
                  "Comment",
                  "Author"
                ]
              ]
            : []
          ).concat(
            comments.map(comment => [
              moment(comment.date).format("MM/DD/YYYY H:MM:SS"),
              comment.delegation,
              comment.type,
              comment.score,
              comment.tags.length > 0
                ? "[" + comment.tags.join("], [") + "]"
                : "",
              comment.text,
              comment.author
            ])
          )
        }
      );
    });
  };
}

const backend = new Backend();

export default backend;
