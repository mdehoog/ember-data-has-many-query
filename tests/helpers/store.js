/* eslint ember/no-classic-classes: 'off' */

import { dasherize } from '@ember/string';
import Ember from 'ember';
import Adapter from '@ember-data/adapter';
import JSONSerializer from '@ember-data/serializer/json';
import RESTSerializer from '@ember-data/serializer/rest';
import RESTAdapter from '@ember-data/adapter/rest';
import JSONAPIAdapter from '@ember-data/adapter/json-api';
import JSONAPISerializer from '@ember-data/serializer/json-api';
import Store from '@ember-data/store';
import Owner from './owner';

export default function setupStore(options) {
  let container, registry, owner;
  let env = {};
  options = options || {};

  if (Ember.Registry) {
    registry = env.registry = new Ember.Registry();
    owner = Owner.create({
      __registry__: registry
    });
    container = env.container = registry.container({
      owner: owner
    });
    owner.__container__ = container;
  } else {
    container = env.container = new Ember.Container();
    registry = env.registry = container;
  }

  env.replaceContainerNormalize = function replaceContainerNormalize(fn) {
    if (env.registry) {
      env.registry.normalize = fn;
    } else {
      env.container.normalize = fn;
    }
  };

  let adapter = env.adapter = (options.adapter || '-default');
  delete options.adapter;

  if (typeof adapter !== 'string') {
    env.registry.register('adapter:-ember-data-test-custom', adapter);
    adapter = '-ember-data-test-custom';
  }

  for (let prop in options) {
    registry.register('model:' + dasherize(prop), options[prop]);
  }

  registry.register('service:store', class extends Store.extend({
    adapter: adapter
  }) {});

  registry.optionsForType('serializer', { singleton: false });
  registry.optionsForType('adapter', { singleton: false });
  registry.register('adapter:-default', Adapter);

  registry.register('serializer:-default', JSONSerializer);
  registry.register('serializer:-rest', RESTSerializer);

  registry.register('adapter:-rest', RESTAdapter);

  registry.register('adapter:-json-api', JSONAPIAdapter);
  registry.register('serializer:-json-api', JSONAPISerializer);

  env.restSerializer = container.lookup('serializer:-rest');
  env.store = container.lookup('service:store');
  env.serializer = env.store.serializerFor('-default');
  env.adapter = env.store.get('defaultAdapter');

  return env;
}

export { setupStore };

export function createStore(options) {
  return setupStore(options).store;
}
