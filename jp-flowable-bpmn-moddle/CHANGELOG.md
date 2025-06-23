# Changelog

All notable changes to [flowable-bpmn-moddle](https://github.com/flowable/flowable-bpmn-moddle) are documented here. We use [semantic versioning](http://semver.org/) for releases.

## Unreleased

___Note:__ Yet to be released changes appear here._

## 4.1.2

* `FIX`: do not copy `flowable:InputOutput` on gateways
* `FIX`: copy `flowable:FailedJobRetryTimeCycle` consistently for all `flowable:AsyncCapable` elements

## 4.1.1

* `FIX`: allow [`flowable:failedJobRetryTimeCycle`](https://docs.flowable.org/manual/7.11/reference/bpmn20/custom-extensions/extension-elements/#failedjobretrytimecycle) in `bpmn:SubProcess`
* `FIX`: allow [`flowable:executionListener`](https://docs.flowable.org/manual/7.11/reference/bpmn20/custom-extensions/extension-elements/#executionlistener) in `bpmn:Process`

## 4.1.0

* `FEAT`: add `flowable:errorMessage` to schema ([`d47da`](https://github.com/flowable/flowable-bpmn-moddle/commit/d47da3a8e90b90994fd397c3ddb6572ce6dcbc1c))

## 4.0.1

* `DOCS`: update bpmn-js integration docs

## 4.0.0

* `CHORE`: update moddle copy mechanism for compatibility with `bpmn-js@5`
* `CHORE`: use Flowable logical types in `allowedIn` mappings
* `FIX`: make extension work

### Breaking Changes

* Requires `bpmn-js@5+` for proper copying of moddle attributes

## 3.2.0

* `FEAT`: add `flowable:calledElementVersionTag` to schema ([#43](https://github.com/flowable/flowable-bpmn-moddle/issues/43))

## 3.1.1

* `FIX`: correct `flowable:isStartableInTasklist` default value ([#41](https://github.com/flowable/flowable-bpmn-moddle/issues/41))

## 3.1.0

* `FEAT`: support `flowable:isStartableInTasklist`

## ...

Check `git log` for earlier history.
