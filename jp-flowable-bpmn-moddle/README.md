# flowable-bpmn-moddle

[![Build Status](https://travis-ci.org/flowable/flowable-bpmn-moddle.svg)](https://travis-ci.org/flowable/flowable-bpmn-moddle)

This project defines the [Flowable](https://flowable.org) namespace extensions for BPMN 2.0 as a [moddle](https://github.com/bpmn-io/moddle) descriptor.


## Usage

Use it together with [bpmn-moddle](https://github.com/bpmn-io/bpmn-moddle) to validate Flowable BPMN 2.0 extensions.

```javascript
var BpmnModdle = require('bpmn-moddle');

var flowableModdle = require('flowable-bpmn-moddle/resources/flowable');

var moddle = new BpmnModdle({ flowable: flowableModdle });

var serviceTask = moddle.create('bpmn:ServiceTask', {
  'javaDelegate': 'my.company.SomeDelegate'
});
```


## Building the Project

To run the test suite that includes XSD schema validation you must have a Java JDK installed and properly exposed through the `JAVA_HOME` variable.

Execute the test via

```
npm test
```

Perform a complete build of the application via

```
npm run all
```

## [bpmn-js](https://github.com/bpmn-io/bpmn-js) Extension

We include an extension that makes [bpmn-js](https://github.com/bpmn-io/bpmn-js) copy and replace mechanisms aware of Flowable properties.

```js
var BpmnJS = require('bpmn-js/lib/Modeler'),
    flowableExtensionModule = require('flowable-bpmn-moddle/lib'),
    flowableModdle = require('flowable-bpmn-moddle/resources/flowable');

var modeler = new BpmnJS({
    additionalModules: [
      flowableExtensionModule
    ],
    moddleExtensions: {
      flowable: flowableModdle
    }
  });
```

This extension hooks into the copy mechanism provided by the BPMN editor and ensures Flowable properties are kept and or dropped on copy and element replace.


## License

Use under the terms of the [MIT license](http://opensource.org/licenses/MIT).
