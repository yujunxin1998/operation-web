'use strict';


describe('descriptor', function() {

  var flowableDescriptor = require('../../resources/flowable');


  it('should provide model', function() {

    // then
    expect(flowableDescriptor).to.exist;

    expect(flowableDescriptor.uri).to.eql('http://flowable.org/bpmn');
    expect(flowableDescriptor.prefix).to.eql('flowable');
  });

});
