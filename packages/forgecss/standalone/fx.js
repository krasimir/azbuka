import fxFn from "../lib/fx.js";

function fxAll(root) {
  var rootNode = root || document;
  var nodes = rootNode.querySelectorAll('[class]');

  for (var i = 0; i < nodes.length; i++) {
    var el = nodes[i];
    var original = el.getAttribute('class');
    if (!original) continue;

    var transformed = fxFn(original);

    if (typeof transformed === 'string' && transformed !== original) {
      el.setAttribute('class', transformed);
    }
  }
}

window.fx = function(str) {
  if (str) {
    return fxFn(str);
  }
  return fxAll();
};

if (document.readyState !== 'loading') {
  fxAll();
} else {
  document.addEventListener('DOMContentLoaded', function () {
    fxAll();
  });
}
window.addEventListener('load', function () {
  fxAll();
});