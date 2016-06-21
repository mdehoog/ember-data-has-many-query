var queryParamPropertyName = function (key) {
  return '__' + key + 'QueryParams';
};

var queryIdPropertyName = function (key) {
  return '__' + key + 'QueryId';
};

var lastWasErrorPropertyName = function (key) {
  return '__' + key + 'LastWasError';
};

var ajaxOptionsPropertyName = function (key) {
  return '__' + key + 'AjaxOptions';
};

var stickyPropertyName = function (key) {
  return '__' + key + 'BelongsToSticky';
};

export {queryParamPropertyName, queryIdPropertyName, lastWasErrorPropertyName, ajaxOptionsPropertyName, stickyPropertyName};
