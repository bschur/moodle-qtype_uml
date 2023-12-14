function setDiagramToReferenceInputField(event) {
    const element = document.getElementById(event.detail?.inputId);
    if (element) {
        element.value = event.detail.diagram;
    }
}

// create script tag
const mainScript = document.createElement('script');
mainScript.src = '/question/type/uml/dist/main.js';
mainScript.type = 'module';
mainScript.defer = true;

// used for angular initialization
const umlEditorLoader = document.createElement('uml-elements');
document.body.appendChild(umlEditorLoader);

// insert script tag to head
document.head.appendChild(mainScript);

// listen for dom changes to detect when the editor is loaded
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.nodeName === 'UML-EDITOR') {
                node.addEventListener('diagramChanged', setDiagramToReferenceInputField);
            }
        });
    });
});

observer.observe(document.body, {childList: true, subtree: true});