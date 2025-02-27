var base_filter = require('../lib/base_filter'),
  util = require('util'),
  csv = require('csv-parser');
  logger = require('log4node');

const { Parser } = require('json2csv');

function FilterCsvOut() {
  base_filter.BaseFilter.call(this);
  this.mergeConfig({
    name: 'csvout',
    optional_params: ['header','fields','flatten'],
    default_values: {
    	header: false,
    	flatten: true,
        fields: false
    },
    start_hook: this.start
  });
}

util.inherits(FilterCsvOut, base_filter.BaseFilter);
var json2csvParser = false;

FilterCsvOut.prototype.start = function(callback) {
  if (this.fields) {
    var fields = this.fields;
    json2csvParser = new Parser({ fields, header: this.header, flatten: this.flatten });
    logger.info('CSV Fields Ready!');
    callback();
  } else {
    logger.debug('No Fields Defined!');
    return;
  }
}

FilterCsvOut.prototype.process = function(data) {
  if (!data || !data.message ) return;
  var input = data.message || data;
  var out = json2csvParser.parse(input);
  this.emit('output', out);
};

FilterCsvOut.prototype.close = function(callback) {
  logger.info('Closing stdout');
  callback();
};

exports.create = function() {
  return new FilterCsvOut();
};
