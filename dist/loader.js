// create scripts tags
const polyfillScript = document.createElement('script');
polyfillScript.src = '/question/type/uml/dist/polyfills.js';
polyfillScript.type = 'module';

const mainScript = document.createElement('script');
mainScript.src = '/question/type/uml/dist/main.js';
mainScript.type = 'module';

// insert scripts tags
document.head.appendChild(polyfillScript);
document.head.appendChild(mainScript);