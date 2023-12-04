// create script tag
const mainScript = document.createElement('script');
mainScript.src = '/question/type/uml/dist/main.js';
mainScript.type = 'module';

// insert script tag to head
document.head.appendChild(mainScript);