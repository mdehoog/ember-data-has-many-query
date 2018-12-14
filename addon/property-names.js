const queryParamPropertyName = function (key) {
  return '__' + key + 'QueryParams';
};

const queryIdPropertyName = function (key) {
  return '__' + key + 'QueryId';
};

const lastWasErrorPropertyName = function (key) {
  return '__' + key + 'LastWasError';
};

const ajaxOptionsPropertyName = function (key) {
  return '__' + key + 'AjaxOptions';
};

const stickyPropertyName = function (key) {
  return '__' + key + 'BelongsToSticky';
};

export {queryParamPropertyName, queryIdPropertyName, lastWasErrorPropertyName, ajaxOptionsPropertyName, stickyPropertyName};
