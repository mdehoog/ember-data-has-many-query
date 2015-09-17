import Ember from 'ember';

export default function(callback, timeout) {
  var timer;
  stop();

  timer = setTimeout(function() {
    start();
    ok(false, "Timeout was reached");
  }, timeout || 200);

  return function() {
    clearTimeout(timer);

    start();

    var args = arguments;
    return Ember.run(function() {
      return callback.apply(this, args);
    });
  };
}
