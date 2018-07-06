const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');
const readFilePromise = Promise.promisify(fs.readFile);
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
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('error reading data folder');
    }
    var data = _.map(files, (file) => {
      var id = path.basename(file, '.txt');
      return readFilePromise(path.join(exports.dataDir, file)).then(fileData => {
        return { id, text: fileData.toString() };
      });
    });
    Promise.all(data)
      .then(items => callback(null, items), err => callback(err));
  });
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
