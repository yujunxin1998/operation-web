'use strict';


var readFile = require('../../helper').readFile,
    createModdle = require('../../helper').createModdle;


describe('read', function() {

  describe('should read extensions', function() {

    var moddle;

    beforeEach(function() {
      moddle = createModdle();
    });


    describe('flowable:historyTimeToLive', function() {

      it('on Process', function(done) {

        // given
        var xml = readFile('test/fixtures/xml/process-flowable-historyTimeToLive.part.bpmn');

        // when
        moddle.fromXML(xml, 'bpmn:Process', function(err, proc) {

          // then
          expect(proc).to.jsonEqual({
            $type : 'bpmn:Process',
            historyTimeToLive : 'foo'
          });

          done(err);

        });

      });

    });


    describe('flowable:isStartableInTasklist', function() {

      it('on Process', function(done) {

        // given
        var xml = readFile('test/fixtures/xml/process-flowable-isStartableInTasklist.part.bpmn');

        // when
        moddle.fromXML(xml, 'bpmn:Process', function(err, proc) {

          // then
          expect(proc).to.jsonEqual({
            $type : 'bpmn:Process',
            isStartableInTasklist : true
          });

          done(err);

        });

      });


      it('default value', function() {

        // when
        var bo = moddle.create('bpmn:Process');

        // then
        expect(bo.get('flowable:isStartableInTasklist')).to.be.true;
      });

    });


    describe('flowable:priority', function() {

      it('on UserTask', function(done) {

        // given
        var xml = readFile('test/fixtures/xml/userTask-flowable-priority.part.bpmn');

        // when
        moddle.fromXML(xml, 'bpmn:UserTask', function(err, serviceTask) {

          // then
          expect(serviceTask).to.jsonEqual({
            $type: 'bpmn:UserTask',
            priority: '${ priority }'
          });

          done(err);
        });

      });
    });


    describe('flowable:async', function() {

      it('on ServiceTask', function(done) {

        // given
        var xml = readFile('test/fixtures/xml/serviceTask-flowable-async.part.bpmn');

        // when
        moddle.fromXML(xml, 'bpmn:ServiceTask', function(err, serviceTask) {

          // then
          expect(serviceTask).to.jsonEqual({
            $type: 'bpmn:ServiceTask',
            async: true
          });

          done(err);
        });

      });


      it('on SignalEventDefinition', function(done) {

        // given
        var xml = readFile('test/fixtures/xml/signalEventDefinition-flowable-async.part.bpmn');

        // when
        moddle.fromXML(xml, 'bpmn:SignalEventDefinition', function(err, definition) {

          // then
          expect(definition).to.jsonEqual({
            $type: 'bpmn:SignalEventDefinition',
            async: true
          });

          done(err);
        });

      });

    });


    describe('flowable:errorCodeVariable', function() {

      it('on ErrorEventDefinition', function(done) {

        // given
        var xml = readFile('test/fixtures/xml/errorEventDefinition-flowable-errorCodeVariable.part.bpmn');

        // when
        moddle.fromXML(xml, 'bpmn:ErrorEventDefinition', function(err, definition) {

          // then
          expect(definition).to.jsonEqual({
            $type: 'bpmn:ErrorEventDefinition',
            errorCodeVariable: 'errorCode'
          });

          done(err);
        });

      });

    });


    describe('flowable:escalationCodeVariable', function() {

      it('on EscalationEventDefinition', function(done) {

        // given
        var xml = readFile('test/fixtures/xml/escalationEventDefinition-flowable-escalationCodeVariable.part.bpmn');

        // when
        moddle.fromXML(xml, 'bpmn:EscalationEventDefinition', function(err, definition) {

          // then
          expect(definition).to.jsonEqual({
            $type: 'bpmn:EscalationEventDefinition',
            escalationCodeVariable: 'escalationCode'
          });

          done(err);
        });

      });

    });


    describe('flowable:errorMessage', function() {

      it('on Error', function(done) {

        // given
        var xml = readFile('test/fixtures/xml/flowable-errorMessage.part.bpmn');

        // when
        moddle.fromXML(xml, 'bpmn:Error', function(err, definition) {

          // then
          expect(definition).to.jsonEqual({
            $type: 'bpmn:Error',
            errorMessage: 'errorMessage'
          });

          done(err);
        });

      });

    });


    it('flowable:script', function(done) {

      // given
      var xml = readFile('test/fixtures/xml/flowable-script.part.bpmn');

      // when
      moddle.fromXML(xml, 'flowable:Script', function(err, script) {

        // then
        expect(script).to.jsonEqual({
          $type: 'flowable:Script',
          scriptFormat: 'groovy',
          resource: 'null',
          value: 'foo = bar;'
        });

        done(err);
      });
    });


    it('flowable:connector', function(done) {

      // given
      var xml = readFile('test/fixtures/xml/flowable-connector.part.bpmn');

      // when
      moddle.fromXML(xml, 'flowable:Connector', function(err, connector) {

        // then
        expect(connector).to.jsonEqual({
          $type: 'flowable:Connector',
          connectorId: 'connector',
          inputOutput: {
            $type: 'flowable:InputOutput',
            inputParameters: [
              {
                $type: 'flowable:InputParameter',
                name: 'in'
              }
            ],
            outputParameters: [
              {
                $type: 'flowable:OutputParameter',
                name: 'out'
              }
            ]
          }
        });

        done(err);
      });
    });


    it('flowable:properties', function(done) {

      // given
      var xml = readFile('test/fixtures/xml/flowable-properties.part.bpmn');

      // when
      moddle.fromXML(xml, 'flowable:Properties', function(err, properties) {

        // then
        expect(properties).to.jsonEqual({
          $type: 'flowable:Properties',
          values: [
            {
              $type: 'flowable:Property',
              id: 'p1',
              name: 'foo',
              value: 'property1'
            }
          ]
        });

        done(err);
      });
    });


    it('flowable:potentialStarter', function(done) {

      // given
      var xml = readFile('test/fixtures/xml/flowable-potentialStarter.part.bpmn');

      // when
      moddle.fromXML(xml, 'flowable:PotentialStarter', function(err, starter) {

        // then
        expect(starter).to.jsonEqual({
          $type: 'flowable:PotentialStarter',
          resourceAssignmentExpression: {
            $type: 'bpmn:ResourceAssignmentExpression',
            expression: {
              $type: 'bpmn:FormalExpression',
              body: 'group2, group(group3), user(user3)'
            }
          }
        });

        done(err);
      });
    });


    describe('flowable:resource', function() {

      it('on FormalExpression', function(done) {

        // given
        var xml = readFile('test/fixtures/xml/formalExpression-resource.part.bpmn');

        // when
        moddle.fromXML(xml, 'bpmn:FormalExpression', function(err, starter) {

          // then
          expect(starter).to.jsonEqual({
            $type: 'bpmn:FormalExpression',
            resource: 'deployment://some-file'
          });

          done(err);
        });
      });
    });


    it('flowable:in', function(done) {

      // given
      var xml = readFile('test/fixtures/xml/flowable-in.part.bpmn');

      // when
      moddle.fromXML(xml, 'flowable:In', function(err, binding) {

        // then
        expect(binding).to.jsonEqual({
          $type: 'flowable:In',
          sourceExpression: 'fooExp',
          source: 'foo',
          target: 'bar',
          variables: 'all',
          local: true
        });

        done(err);
      });
    });


    it('flowable:out', function(done) {

      // given
      var xml = readFile('test/fixtures/xml/flowable-out.part.bpmn');

      // when
      moddle.fromXML(xml, 'flowable:Out', function(err, binding) {

        // then
        expect(binding).to.jsonEqual({
          $type: 'flowable:Out',
          sourceExpression: 'fooExp',
          source: 'foo',
          target: 'bar',
          variables: 'all',
          local: true
        });

        done(err);
      });
    });


    describe('flowable:inputParameter', function() {

      it('with body content', function(done) {

        // given
        var xml = readFile('test/fixtures/xml/flowable-inputParameter-body.part.bpmn');

        // when
        moddle.fromXML(xml, 'flowable:InputParameter', function(err, parameter) {

          // then
          expect(parameter).to.jsonEqual({
            $type: 'flowable:InputParameter',
            name: 'foo',
            value: 'BAR'
          });

          done(err);
        });
      });


      it('with nested script', function(done) {

        // given
        var xml = readFile('test/fixtures/xml/flowable-inputParameter-script.part.bpmn');

        // when
        moddle.fromXML(xml, 'flowable:InputParameter', function(err, parameter) {

          // then
          expect(parameter).to.jsonEqual({
            $type: 'flowable:InputParameter',
            definition: {
              $type: 'flowable:Script'
            }
          });

          done(err);
        });
      });


      it('with nested list', function(done) {

        // given
        var xml = readFile('test/fixtures/xml/flowable-inputParameter-list.part.bpmn');

        // when
        moddle.fromXML(xml, 'flowable:InputParameter', function(err, parameter) {

          // then
          expect(parameter).to.jsonEqual({
            $type: 'flowable:InputParameter',
            name: 'var1',
            definition: {
              $type: 'flowable:List',
              items: [
                {
                  $type: 'flowable:Value',
                  value: '${1+1}'
                },
                {
                  $type: 'flowable:Value',
                  value: '${1+2}'
                },
                {
                  $type: 'flowable:Value',
                  value: '${1+3}'
                }
              ]
            }
          });

          done(err);
        });
      });


      it('with nested map', function(done) {

        // given
        var xml = readFile('test/fixtures/xml/flowable-inputParameter-map.part.bpmn');

        // when
        moddle.fromXML(xml, 'flowable:InputParameter', function(err, parameter) {

          // then
          expect(parameter).to.jsonEqual({
            $type: 'flowable:InputParameter',
            definition: {
              $type: 'flowable:Map',
              entries: [
                {
                  $type: 'flowable:Entry',
                  key: 'a',
                  value: '${1+1}'
                },
                {
                  $type: 'flowable:Entry',
                  key: 'b',
                  value: '${1+2}'
                },
                {
                  $type: 'flowable:Entry',
                  key: 'c',
                  value: '${1+3}'
                }
              ]
            }
          });

          done(err);
        });
      });

    });


    describe('flowable:outputParameter', function() {

      it('with mixed contents', function(done) {

        // given
        var xml = readFile('test/fixtures/xml/flowable-outputParameter-mixed.part.bpmn');

        // when
        moddle.fromXML(xml, 'flowable:OutputParameter', function(err, parameter) {

          // then
          expect(parameter).to.jsonEqual({
            $type: 'flowable:OutputParameter',
            name: 'var1',
            definition: {
              $type: 'flowable:List',
              items: [
                {
                  $type: 'flowable:Value',
                  value: 'constantStringValue'
                },
                {
                  $type: 'flowable:Value',
                  value: '${ \'elValue\' }'
                },
                {
                  $type: 'flowable:Script',
                  scriptFormat: 'Groovy',
                  value: 'return "scriptValue";'
                }
              ]
            }
          });

          done(err);
        });
      });

    });


    describe('flowable:FormSupported with flowable:formKey and flowable:formHandlerClass', function() {

      it('on UserTask', function(done) {

        // given
        var xml = readFile('test/fixtures/xml/userTask-flowable-formSupported.part.bpmn');

        // when
        moddle.fromXML(xml, 'bpmn:UserTask', function(err, task) {

          // then
          expect(task).to.jsonEqual({
            $type: 'bpmn:UserTask',
            formHandlerClass: 'my.company.FormHandler',
            formKey: 'form.html'
          });

          done(err);
        });
      });


      it('on StartEvent', function(done) {

        // given
        var xml = readFile('test/fixtures/xml/userTask-flowable-formSupported.part.bpmn');

        // when
        moddle.fromXML(xml, 'bpmn:UserTask', function(err, startEvent) {

          // then
          expect(startEvent).to.jsonEqual({
            $type: 'bpmn:UserTask',
            formHandlerClass: 'my.company.FormHandler',
            formKey: 'form.html'
          });

          done(err);
        });
      });

    });


    describe('flowable:TemplateSupported with flowable:modelerTemplate', function() {

      it('on Process', function(done) {

        // given
        var xml = readFile('test/fixtures/xml/process-flowable-modelerTemplate.part.bpmn');

        // when
        moddle.fromXML(xml, 'bpmn:Process', function(err, task) {

          // then
          expect(task).to.jsonEqual({
            $type: 'bpmn:Process',
            modelerTemplate: 'foo'
          });

          done(err);
        });
      });

      it('on Task', function(done) {

        // given
        var xml = readFile('test/fixtures/xml/task-flowable-modelerTemplate.part.bpmn');

        // when
        moddle.fromXML(xml, 'bpmn:Task', function(err, task) {

          // then
          expect(task).to.jsonEqual({
            $type: 'bpmn:Task',
            modelerTemplate: 'foo'
          });

          done(err);
        });
      });

      it('on StartEvent', function(done) {

        // given
        var xml = readFile('test/fixtures/xml/startEvent-flowable-modelerTemplate.part.bpmn');

        // when
        moddle.fromXML(xml, 'bpmn:StartEvent', function(err, task) {

          // then
          expect(task).to.jsonEqual({
            $type: 'bpmn:StartEvent',
            modelerTemplate: 'bar'
          });

          done(err);
        });
      });

    });


    describe('flowable:initiator', function() {

      it('on StartEvent', function(done) {

        // given
        var xml = readFile('test/fixtures/xml/startEvent-flowable-initiator.part.bpmn');

        // when
        moddle.fromXML(xml, 'bpmn:StartEvent', function(err, proc) {

          // then
          expect(proc).to.jsonEqual({
            $type: 'bpmn:StartEvent',
            initiator: 'kermit'
          });

          done(err);
        });
      });

    });

    it('bpmn:CallActivity', function(done) {

      // given
      var xml = readFile('test/fixtures/xml/callActivity.part.bpmn');

      // when
      moddle.fromXML(xml, 'bpmn:CallActivity', function(err, callActivity) {

        // then
        expect(callActivity).to.jsonEqual({
          $type: 'bpmn:CallActivity',
          calledElementBinding: 'version',
          calledElementVersion: '1',
          calledElementVersionTag: 'version1',
          calledElementTenantId: 'tenant1',
          caseRef: 'oneTaskCase',
          caseBinding: 'version',
          caseVersion: '2',
          caseTenantId: 'tenant1',
          variableMappingClass: 'org.flowable.bpm.test.Test',
          variableMappingDelegateExpression: '${test}'
        });

        done(err);
      });

    });

    describe('flowable:taskPriority', function() {

      it('on Process', function(done) {

        // given
        var xml = readFile('test/fixtures/xml/process-flowable-taskPriority.part.bpmn');

        // when
        moddle.fromXML(xml, 'bpmn:Process', function(err, proc) {

          // then
          expect(proc).to.jsonEqual({
            $type : 'bpmn:Process',
            taskPriority : '100'
          });

          done(err);
        });
      });


      it('on ServiceTaskLike Element', function(done) {

        // given
        var xml = readFile('test/fixtures/xml/serviceTask-flowable-taskPriority.part.bpmn');

        // when
        moddle.fromXML(xml, 'bpmn:ServiceTask', function(err, task) {

          // then
          expect(task).to.jsonEqual({
            $type : 'bpmn:ServiceTask',
            taskPriority : '100'
          });

          done(err);
        });
      });
    });


    describe('flowable:jobPriority', function() {

      it('on Process', function(done) {

        // given
        var xml = readFile('test/fixtures/xml/process-flowable-jobPriority.part.bpmn');

        // when
        moddle.fromXML(xml, 'bpmn:Process', function(err, proc) {

          // then
          expect(proc).to.jsonEqual({
            $type: 'bpmn:Process',
            jobPriority: '100'
          });

          done(err);
        });
      });


      it('on ServiceTask', function(done) {

        // given
        var xml = readFile('test/fixtures/xml/serviceTask-flowable-jobPriority.part.bpmn');

        // when
        moddle.fromXML(xml, 'bpmn:ServiceTask', function(err, task) {

          // then
          expect(task).to.jsonEqual({
            $type: 'bpmn:ServiceTask',
            jobPriority: '100'
          });

          done(err);
        });
      });


      it('on Gateway', function(done) {

        // given
        var xml = readFile('test/fixtures/xml/gateway-flowable-jobPriority.part.bpmn');

        // when
        moddle.fromXML(xml, 'bpmn:ExclusiveGateway', function(err, gateway) {

          // then
          expect(gateway).to.jsonEqual({
            $type: 'bpmn:ExclusiveGateway',
            jobPriority: '${ some - expression }'
          });

          done(err);
        });
      });


      it('on Event', function(done) {

        // given
        var xml = readFile('test/fixtures/xml/event-flowable-jobPriority.part.bpmn');

        // when
        moddle.fromXML(xml, 'bpmn:IntermediateCatchEvent', function(err, proc) {

          // then
          expect(proc).to.jsonEqual({
            $type: 'bpmn:IntermediateCatchEvent',
            jobPriority: '100'
          });

          done(err);
        });
      });

    });


    describe('bpmn:Process', function() {

      it('extended with flowable:candidateStarterUsers, flowable:candidateStarterGroups, flowable:versionTag', function(done) {

        // given
        var xml = readFile('test/fixtures/xml/process.part.bpmn');

        // when
        moddle.fromXML(xml, 'bpmn:Process', function(err, proc) {

          // then
          expect(proc).to.jsonEqual({
            $type: 'bpmn:Process',
            candidateStarterUsers: 'userInGroup2',
            candidateStarterGroups: 'group1, group2, group3',
            versionTag: '1.0.0'
          });

          done(err);
        });
      });

    });


    describe('bpmn:ScriptTask', function() {

      it('extended with flowable:resource, flowable:resultVariable', function(done) {

        // given
        var xml = readFile('test/fixtures/xml/scriptTask.part.bpmn');

        // when
        moddle.fromXML(xml, 'bpmn:ScriptTask', function(err, definition) {

          // then
          expect(definition).to.jsonEqual({
            $type: 'bpmn:ScriptTask',
            scriptFormat: 'python',
            resource: 'some-file.py',
            resultVariable: 'result'
          });

          done(err);
        });
      });

    });


    it('flowable:formData', function(done) {

      // given
      var xml = readFile('test/fixtures/xml/flowable-formData.part.bpmn');

      // when
      moddle.fromXML(xml, 'flowable:FormData', function(err, formData) {

        // then
        expect(formData).to.jsonEqual({
          $type: 'flowable:FormData',
          fields: [
            {
              $type: 'flowable:FormField',
              id: 'stringField',
              label: 'String Field',
              type: 'string',
              defaultValue: 'someString',
              properties: {
                $type: 'flowable:Properties',
                values: [
                  {
                    $type: 'flowable:Property',
                    id: 'p1',
                    value: 'property1'
                  },
                  {
                    $type: 'flowable:Property',
                    id: 'p2',
                    value: 'property2'
                  }
                ]
              },
              validation: {
                $type: 'flowable:Validation',
                constraints: [
                  {
                    $type: 'flowable:Constraint',
                    name: 'readonly'
                  },
                  {
                    $type: 'flowable:Constraint',
                    name: 'minlength',
                    config: '5'
                  }
                ]
              },
              values: [
                {
                  $type: 'flowable:Value',
                  id: 'a',
                  name: 'A'
                },
                {
                  $type: 'flowable:Value',
                  id: 'b',
                  name: 'B'
                }
              ]
            }
          ]
        });

        done(err);
      });

    });


    describe('flowable:formProperty', function() {

      it('attributes', function(done) {
        // given
        var xml = readFile('test/fixtures/xml/flowable-formProperty-attributes.part.bpmn');

        // when
        moddle.fromXML(xml, 'flowable:FormProperty', function(err, formProperty) {

          // then
          expect(formProperty).to.jsonEqual({
            $type: 'flowable:FormProperty',
            id: 'longProperty',
            name: 'Property',
            type: 'long',
            required: 'true',
            readable: 'true',
            writable: 'true',
            variable: 'SpeakerName',
            expression: '#{address.street}',
            datePattern: 'dd-MM-yyyy hh:mm',
            default: '42'
          });

          done(err);
        });
      });


      it('with nested value', function(done) {
        // given
        var xml = readFile('test/fixtures/xml/flowable-formProperty-children.part.bpmn');

        // when
        moddle.fromXML(xml, 'flowable:FormProperty', function(err, formProperty) {

          // then
          expect(formProperty).to.jsonEqual({
            $type: 'flowable:FormProperty',
            values: [
              {
                $type: 'flowable:Value',
                id: 'false',
                name: 'Yes'
              },
              {
                $type: 'flowable:Value',
                id: 'true',
                name: 'No'
              }
            ]
          });

          done(err);
        });
      });

    });

    describe('flowable:executionListener', function() {

      it('attributes', function(done) {

        // given
        var xml = readFile('test/fixtures/xml/flowable-executionListener.part.bpmn');

        // when
        moddle.fromXML(xml, 'flowable:ExecutionListener', function(err, executionListener) {

          // then
          expect(executionListener).to.jsonEqual({
            $type: 'flowable:ExecutionListener',
            event: 'start',
            'class': 'my.company.Listener'
          });

          done(err);
        });

      });


      it('script', function(done) {

        // given
        var xml = readFile('test/fixtures/xml/flowable-executionListener-script.part.bpmn');

        // when
        moddle.fromXML(xml, 'flowable:ExecutionListener', function(err, executionListener) {

          // then
          expect(executionListener).to.jsonEqual({
            $type: 'flowable:ExecutionListener',
            event: 'start',
            script: {
              $type: 'flowable:Script',
              scriptFormat: 'groovy',
              value: 'foo = bar;'
            }
          });

          done(err);
        });
      });


      it('fields', function(done) {

        // given
        var xml = readFile('test/fixtures/xml/flowable-executionListener-fields.part.bpmn');

        // when
        moddle.fromXML(xml, 'flowable:ExecutionListener', function(err, executionListener) {

          // then
          expect(executionListener).to.jsonEqual({
            $type: 'flowable:ExecutionListener',
            event: 'start',
            'class': 'my.company.Listener',
            fields : [
              {
                $type: 'flowable:Field',
                name: 'fieldOne',
                stringValue: 'myString'
              },
              {
                $type: 'flowable:Field',
                name: 'fieldTwo',
                expression: '${myExpression}'
              }
            ]
          });

          done(err);
        });

      });

    });


    it('flowable:taskListener', function(done) {

      // given
      var xml = readFile('test/fixtures/xml/flowable-taskListener.part.bpmn');

      // when
      moddle.fromXML(xml, 'flowable:TaskListener', function(err, taskListener) {

        // then
        expect(taskListener).to.jsonEqual({
          $type: 'flowable:TaskListener',
          event: 'create',
          class: 'org.flowable.bpm.engine.test.bpmn.usertask.UserTaskTestCreateTaskListener',
          delegateExpression: '${myTaskListener}',
          expression: '${myTaskListener.notify(task, task.eventName)}'
        });

        done(err);
      });
    });


    describe('flowable:field', function() {

      it('attributes', function(done) {

        // given
        var xml = readFile('test/fixtures/xml/flowable-field-attributes.part.bpmn');

        // when
        moddle.fromXML(xml, 'flowable:Field', function(err, field) {

          // then
          expect(field).to.jsonEqual({
            $type: 'flowable:Field',
            name: 'html',
            expression: '<html><body>Hi!</body></html>',
            stringValue: '41 is not the answer!'
          });

          done(err);
        });
      });


      it('with nested expression and string', function(done) {

        // given
        var xml = readFile('test/fixtures/xml/flowable-field-children.part.bpmn');

        // when
        moddle.fromXML(xml, 'flowable:Field', function(err, field) {

          // then
          expect(field).to.jsonEqual({
            $type: 'flowable:Field',
            name: 'html',
            expression: '<html><body>Hi!</body></html>',
            string: '42 is the answer!'
          });

          done(err);
        });
      });

    });


    describe('flowable:Collectable', function() {

      it('attributes', function(done) {

        // given
        var xml = readFile('test/fixtures/xml/flowable-multiInstance.part.bpmn');

        // when
        moddle.fromXML(xml, 'bpmn:MultiInstanceLoopCharacteristics', function(err, field) {

          // then
          expect(field).to.jsonEqual({
            $type: 'bpmn:MultiInstanceLoopCharacteristics',
            isSequential: true,
            collection: '5',
            elementVariable: '5'
          });

          done(err);
        });
      });
    });

    describe('flowable tenant id', function() {

      it('on BusinessRuleTask', function(done) {

        // given
        var xml = readFile('test/fixtures/xml/businessRuleTask.part.bpmn');

        // when
        moddle.fromXML(xml, 'bpmn:BusinessRuleTask', function(err, proc) {

          // then
          expect(proc).to.jsonEqual({
            $type: 'bpmn:BusinessRuleTask',
            decisionRef: 'myDecision',
            decisionRefBinding: 'version',
            decisionRefVersion: '1',
            decisionRefTenantId: 'tenant1'
          });

          done(err);
        });
      });


      it('on CallActivity', function(done) {

        // given
        var xml = readFile('test/fixtures/xml/callActivity.part.bpmn');

        // when
        moddle.fromXML(xml, 'bpmn:CallActivity', function(err, task) {

          // then
          expect(task).to.jsonEqual({
            $type: 'bpmn:CallActivity',
            calledElementBinding: 'version',
            calledElementVersion: '1',
            calledElementVersionTag: 'version1',
            calledElementTenantId: 'tenant1',
            caseRef: 'oneTaskCase',
            caseBinding: 'version',
            caseVersion: '2',
            caseTenantId: 'tenant1',
            variableMappingClass: 'org.flowable.bpm.test.Test',
            variableMappingDelegateExpression: '${test}'
          });

          done(err);
        });
      });
    });


    describe('flowable:errorMessageVariable', function() {

      it('on ErrorEventDefinition', function(done) {

        // given
        var xml = readFile('test/fixtures/xml/errorEventDefinition-flowable-errorMessageVariable.part.bpmn');

        // when
        moddle.fromXML(xml, 'bpmn:ErrorEventDefinition', function(err, definition) {

          // then
          expect(definition).to.jsonEqual({
            $type: 'bpmn:ErrorEventDefinition',
            errorMessageVariable: 'errorMessage'
          });

          done(err);
        });

      });

    });

    describe('flowable:variableName', function() {

      it('on ConditionalEventDefinition', function(done) {

        // given
        var xml = readFile('test/fixtures/xml/conditionalEventDefinition-flowable-variableName.part.bpmn');

        // when
        moddle.fromXML(xml, 'bpmn:ConditionalEventDefinition', function(err, definition) {

          // then
          expect(definition).to.jsonEqual({
            $type: 'bpmn:ConditionalEventDefinition',
            variableName: 'myConditionVar'
          });

          done(err);
        });

      });

    });

    describe('flowable:variableEvent', function() {

      it('on ConditionalEventDefinition', function(done) {

        // given
        var xml = readFile('test/fixtures/xml/conditionalEventDefinition-flowable-variableEvent.part.bpmn');

        // when
        moddle.fromXML(xml, 'bpmn:ConditionalEventDefinition', function(err, definition) {

          // then
          expect(definition).to.jsonEqual({
            $type: 'bpmn:ConditionalEventDefinition',
            variableEvent: 'create, update'
          });

          done(err);
        });

      });

    });


  });

});
