'use strict';

var BpmnModdle = require('bpmn-moddle');

var flowableDescriptor = require('../../resources/flowable');


describe('exports', function() {

  it('should extend bpmn-moddle', function() {

    // given
    var moddle = new BpmnModdle({
      flowable: flowableDescriptor
    });

    // when
    var serviceTask = moddle.create('bpmn:ServiceTask');

    // then
    expect(serviceTask.$instanceOf('flowable:ServiceTaskLike')).to.be.true;
  });

});
