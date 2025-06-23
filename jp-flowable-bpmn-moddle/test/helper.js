'use strict';

var fs = require('fs');


function readFile(filename) {
  return fs.readFileSync(filename, { encoding: 'UTF-8' });
}

module.exports.readFile = readFile;


var BpmnModdle = require('bpmn-moddle');

var flowableDescriptor = require('../resources/flowable');

function createModdle() {
  return new BpmnModdle({
    flowable: flowableDescriptor
  });
}

module.exports.createModdle = createModdle;
