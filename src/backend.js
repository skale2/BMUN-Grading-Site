import moment from "moment";
import { message } from "antd";
import { CLIENT_ID, SPEECH_TYPES_ORDERED } from "./constants";

const DISCOVERY_DOCS = [
  "https://sheets.googleapis.com/$discovery/rest?version=v4",
  "https://docs.googleapis.com/$discovery/rest?version=v1"
];
const SCOPE =
  "https://www.googleapis.com/auth/drive " +
  "https://www.googleapis.com/auth/drive.file " +
  "https://www.googleapis.com/auth/spreadsheets " +
  "https://www.googleapis.com/auth/documents.readonly";

class Backend {
  constructor() {
    this.auth = undefined;

    this.isReady = false;
    this.isReadyCallBacks = [];

    this.isSignedIn = false;
    this.isSignedInCallBacks = [];

    this.committees = {};

    this.user = {
      name: undefined,
      email: undefined,
      avatarUrl: undefined
    };

    this.committee = {
      shortName: undefined,
      name: undefined,
      sheet: undefined,
      delegations: [],
      chairs: []
    };

    window.gapi.load("client:auth2", this._initClient);
  }

  _initClient = () => {
    window.gapi.client
      .init({
        clientId: CLIENT_ID,
        scope: SCOPE,
        discoveryDocs: DISCOVERY_DOCS
      })
      .then(
        () => {
          this.auth = window.gapi.auth2.getAuthInstance();

          if (this.auth.isSignedIn.get()) {
            this._fetchCommittees()
              .then(this._fetchUser)
              .then(() => {
                this.isSignedIn = true;
                for (let callback of this.isSignedInCallBacks) callback();

                this.isReady = true;
                for (let callback of this.isReadyCallBacks) callback();
              });
          } else {
            this.isReady = true;
            for (let callback of this.isReadyCallBacks) callback();
          }
        },
        error => {
          message.error("We're having some issues on our end...");
          console.log(error);
        }
      );
  };

  _reportError = (consoleError, windowError) => {
    console.log(consoleError);
    message.error(windowError || "We're having some issues on our end...");
  };

  _fetchUser = () => {
    let basicProfile = this.auth.currentUser.je.getBasicProfile();

    /* I'm not sure if this is how you're supposed to use this... */
    this.user = {
      name: basicProfile.Ad,
      email: basicProfile.zu,
      avatarUrl: basicProfile.UK
    };

    return Promise.resolve();
  };

  _fetchCommittees = () => {
    return window.gapi.client.docs.documents
      .get({
        documentId: process.env.REACT_APP_CONFIG_DOC_ID
      })
      .then(response => {
        let content = "";

        for (let text of response.result.body.content) {
          if (text.paragraph !== undefined) {
            for (let element of text.paragraph.elements) {
              content += element.textRun.content;
            }
          }
        }

        this.committees = JSON.parse(content);
      }, this._reportError);
  };

  _rowToObject = (row, i) => {
    return {
      row: i,
      date: new Date(parseInt(row[0])),
      delegation: row[1],
      type: SPEECH_TYPES_ORDERED[parseInt(row[2])],
      score: parseInt(row[3]),
      tags: row[4] !== undefined && row[4].length > 0 ? row[4].split(",") : [],
      text: row[5] !== undefined ? row[5] : "",
      author: row[6]
    };
  };

  committeeByFullName = committee => {
    return Object.keys(this.committees).find(
      shortname => this.committees[shortname].name === committee
    );
  };

  signIn = () => {
    return this.auth
      .signIn()
      .then(this._fetchCommittees)
      .then(this._fetchUser)
      .then(result => {
        this.isSignedIn = true;
        for (let callback of this.isSignedInCallBacks) callback();

        return result;
      }, this._reportError);
  };

  setCommittee = committee => {
    if (!Object.keys(this.committees).includes(committee)) {
      this._reportError(`Unknown committee: ${committee}`);
      return Promise.reject();
    }

    if (committee !== this.committee.shortName)
      this.committee = this.committees[committee];

    return Promise.resolve();
  };

  comments = () => {
    if (!this.auth.isSignedIn.get()) {
      this.auth.signIn();
    }

    if (this.committee === undefined) {
      this._reportError("Committee not defined");
      return Promise.reject();
    }

    return window.gapi.client.sheets.spreadsheets.values
      .get({
        spreadsheetId: this.committee.sheet,
        range: "Sheet1!A:G",
        dateTimeRenderOption: "FORMATTED_STRING",
        majorDimension: "ROWS",
        valueRenderOption: "FORMATTED_VALUE"
      })
      .then(
        response =>
          response.result.values === undefined
            ? []
            : response.result.values.map(this._rowToObject),
        this._reportError
      );
  };

  grade = (delegation, type, score, tags, text, author) => {
    if (!this.auth.isSignedIn.get()) {
      this.auth.signIn();
    }

    if (this.committee === undefined) {
      this._reportError("Committee not defined");
      return Promise.reject();
    }

    return window.gapi.client.sheets.spreadsheets.values
      .append(
        {
          spreadsheetId: this.committee.sheet,
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
      .then(response => response, this._reportError);
  };

  edit = (row, delegation, type, score, tags, text, author) => {
    if (!this.auth.isSignedIn.get()) {
      this.auth.signIn();
    }

    if (this.committee === undefined) {
      this._reportError("Committee not defined");
      return Promise.reject();
    }

    // We add 1 to each row because sheet ranges are 1-indexed,
    // but all of our rows are stored 0-indexed.
    return window.gapi.client.sheets.spreadsheets.values
      .update(
        {
          spreadsheetId: this.committee.sheet,
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
      .then(response => response, this._reportError);
  };

  status = delegation => {
    if (!this.auth.isSignedIn.get()) {
      this.auth.signIn();
    }

    if (this.committee === undefined) {
      this._reportError("Committee not defined");
      return Promise.reject();
    }

    return window.gapi.client.sheets.spreadsheets.values
      .get({
        spreadsheetId: this.committee.sheet,
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
                .map(this._rowToObject)
                .filter(row => row.delegation === delegation),
        this._reportError
      );
  };

  deleteComment = row => {
    if (!this.auth.isSignedIn.get()) {
      this.auth.signIn();
    }

    if (this.committee === undefined) {
      this._reportError("Committee not defined");
      return Promise.reject();
    }

    return window.gapi.client.sheets.spreadsheets.batchUpdate(
      { spreadsheetId: this.committee.sheet },
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
    if (!this.auth.isSignedIn.get()) {
      this.auth.signIn();
    }

    if (this.committee === undefined) {
      this._reportError("Committee not defined");
      return Promise.reject();
    }

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
      .then(([, spreadsheet]) => spreadsheet, this._reportError);
  };

  exportUpdate = (spreadsheetId, location, includeHeader) => {
    if (!this.auth.isSignedIn.get()) {
      this.auth.signIn();
    }

    if (this.committee === undefined) {
      this._reportError("Committee not defined");
      return Promise.reject();
    }

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
      let [, sheetName, column, row] = location.match(/(.+?)!([A-Z])([0-9]+)/i);

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
