import resolver from './helpers/resolver';
import {setResolver} from 'ember-qunit';
import {wait} from 'dummy/tests/helpers/async';
import QUnit from 'qunit';

const {assert} = QUnit;

setResolver(resolver);
assert.wait = wait;
