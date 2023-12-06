function setDiagramToReferenceInputField(event) {
    const element = document.getElementById(event.detail?.inputId);
    if (element) {
        event.target.value = event.detail.diagram;
    }
}

// create script tag
const mainScript = document.createElement('script');
mainScript.src = '/question/type/uml/dist/main.js';
mainScript.type = 'module';

// insert script tag to head
document.head.appendChild(mainScript);

// Listen for diagram changes (globally)
document.addEventListener('diagramChanged', setDiagramToReferenceInputField.bind(null));