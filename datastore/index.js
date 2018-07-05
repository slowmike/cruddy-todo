const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err) => {
      err ? callback(err) : callback(null, { id, text });
    });
  });
};

exports.readOne = (id, callback) => {
  fs.readFile(path.join(exports.dataDir, `${id}.txt`, (err, data) => {
    err ? callback(new Error(`No item with id: ${id}`)) :  callback(null, { id, text: data.toString() });
  });
};

exports.readAll = (callback) => {

  var data = [];
  _.each(items, (item, idx) => {
    data.push({ id: idx, text: items[idx] });
  });
  callback(null, data);
};

exports.update = (id, text, callback) => {
  fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err) => {
    err ? callback(new Error(`No item with id: ${id}`)) : callback(null, { id, text });
  });
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
