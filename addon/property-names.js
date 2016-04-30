var queryParamPropertyName = function (key) {
  return '_' + key + 'QueryParams';
};

var ajaxOptionsPropertyName = function (key) {
  return '_' + key + 'AjaxOptions';
};

var stickyPropertyName = function (key) {
  return '_' + key + 'BelongsToSticky';
};

export {queryParamPropertyName, ajaxOptionsPropertyName, stickyPropertyName};
