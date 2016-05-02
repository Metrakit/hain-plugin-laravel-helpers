'use strict';

const _ = require('lodash');
const ncp = require("copy-paste");
const jsdom = require("jsdom");

module.exports = (context) => {
  const shell = context.shell;
  const url = 'http://cheats.jesse-obrien.ca/';
  let helperLines = [];

  function startup() {
    jsdom.env({
      url: url,
      scripts: ["http://code.jquery.com/jquery.js"],
      done: function (err, window) {
        var $ = window.$;
        $("pre.prettyprint").each(function() {
          var text = $(this).text();
          var lines = text.split("\n");
          for (var i = 0, len = lines.length; i < len; i++) {

            var currentLine = lines[i].trim();

            if ( ! currentLine.match(/\/\//g) &&
                 ! currentLine.match(/return/g) &&
                 ! currentLine.match(/echo/g) &&
                 ! currentLine.match(/.\/vendor/g) &&
                 ! currentLine.match(/->/g) &&
                 ! currentLine.match(/""/g) &&
                 currentLine !== '{' &&
                 currentLine !== '' &&
                 currentLine !== '));' &&
                 currentLine !== ');' &&
                 currentLine !== '});') {
              helperLines.push(currentLine)
            }
          }
          helperLines.sort();
        });
      }
    });
  }

  function search(query, res) {
    const query_trim = query.trim();
    if (query_trim.length === 0) {
      _.take(helperLines, 20).map((helper) => {
          res.add({
              id: helper,
              payload: 'cp',
              title: helper,
              icon: '#fa fa-info'
          });
      });
    } else {
      var result = _.filter(helperLines, function(o) { return o.indexOf(query_trim) > -1; });
      _.take(result, 20).map((helper) => {
          res.add({
              id: helper,
              payload: 'cp',
              title: helper,
              icon: '#fa fa-info'
          });
      });
    }
  }

  function execute(id, payload) {
    if (payload === 'cp') {
      ncp.copy(id, function() {
          context.toast.enqueue('Pasted to clipboard !');
      })
    }
  }

  return { startup, search, execute };
};
