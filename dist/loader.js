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

const umlEditorLoader = document.createElement('uml-editor');
umlEditorLoader.id = 'uml-editor-loader';
document.body.appendChild(umlEditorLoader);

// insert script tag to head
document.head.appendChild(mainScript);

// Listen for diagram changes (globally)
document.addEventListener('diagramChanged', setDiagramToReferenceInputField.bind(null));

// Poll for the existence of the uml-editor element
// Once it exists, remove the loader and replace all the umleditors with uml-editors
const pollingInterval = setInterval(() => {
    const umlEditorCustomElement = customElements.get('uml-editor');
    if (umlEditorCustomElement) {
        clearInterval(pollingInterval);
        umlEditorLoader.remove();

        // rename all the umleditors to uml-editor
        document.querySelectorAll('umleditor').forEach((tmpUmlEditor) => {
            const newUmlEditor = document.createElement('uml-editor');
            Array.from(tmpUmlEditor.attributes).forEach((attribute) => {
                newUmlEditor.setAttribute(attribute.name, attribute.value);
            });

            tmpUmlEditor.parentNode.replaceChild(newUmlEditor, tmpUmlEditor);
        });
    }
}, 200);