import Ember from 'ember';
import EmberObject from '@ember/object';

let Owner;

if (Ember._RegistryProxyMixin && Ember._ContainerProxyMixin) {
  Owner = EmberObject.extend(Ember._RegistryProxyMixin, Ember._ContainerProxyMixin);
} else {
  Owner = EmberObject.extend();
}

export default Owner;
