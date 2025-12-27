import azFn from "./lib/az.js";

function azAll(root) {
  var rootNode = root || document;
  var nodes = rootNode.querySelectorAll('[class]');

  for (let i = 0; i < nodes.length; i++) {
    let el = nodes[i];
    let original = el.getAttribute('class');
    if (!original) continue;

    let transformed = azFn(original);

    if (typeof transformed === 'string' && transformed !== original) {
      el.setAttribute('class', transformed);
    }
  }
}

window.az = function(str) {
  if (str) {
    return azFn(str);
  }
  return azAll();
};

if (document.readyState !== 'loading') {
  azAll();
} else {
  document.addEventListener('DOMContentLoaded', function () {
    azAll();
  });
}
window.addEventListener('load', function () {
  azAll();
});