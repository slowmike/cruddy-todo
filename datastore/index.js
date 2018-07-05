const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const fsPromises = fs.promises;
var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, err => {
      err ? callback(err) : callback(null, { id, text });
    });
  });
};

exports.readOne = (id, callback) => {
  fs.readFile(path.join(exports.dataDir, `${id}.txt`), (err, data) => {
    err ? callback(new Error(`No item with id: ${id}`)) : callback(null, { id, text: data.toString() });
  });
};

exports.readAll = (callback) => {
  let data = [];
  fsPromises.readdir(exports.dataDir, 'utf8', (err, files) => {
    data = _.map(files, item => {
      let id = path.basename(item, '.txt');
      return { id, text: id };
    });
    console.log(data);
  }).then(() => callback(null, data));
};

exports.update = (id, text, callback) => {
  const pathname = path.join(exports.dataDir, `${id}.txt`);
  fs.access(pathname, fs.constants.F_OK, err => {
    err ? callback(new Error(`No item with id: ${id}`)) : fs.writeFile(pathname, text, err => {
      err ? callback(err) : callback(null, { id, text });
    });
  });
};

exports.delete = (id, callback) => {
  fs.unlink(path.join(exports.dataDir, `${id}.txt`), err => {
    err ? callback(new Error(`No item with id: ${id}`)) : callback();
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
