var queryParamPropertyName = function (key) {
  return '_' + key + 'QueryParams';
};

var stickyPropertyName = function (key) {
  return '_' + key + 'Sticky';
};

export { queryParamPropertyName, stickyPropertyName };
