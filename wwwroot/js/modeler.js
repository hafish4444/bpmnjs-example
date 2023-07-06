/**
 * bpmn-js-seed
 *
 * This is an example script that loads an embedded diagram file <diagramXML>
 * and opens it using the bpmn-js modeler.
 */
// import customControlsModule from './bpmn-custom/index.js';

//import diagramXML from '../resources/diagram.bpmn';
(function (BpmnModeler, BpmnPropertiesPanelModule, BpmnPropertiesProviderModule) {
    var canvas = $('#canvas');
    // create modeler
    var bpmnModeler = new BpmnModeler({
        container: canvas,
        height: 800,
        propertiesPanel: {
            parent: '#js-properties-panel'
        },
        additionalModules: [
            BpmnPropertiesPanelModule,
            BpmnPropertiesProviderModule
        ]
    });
    bpmnModeler.on('commandStack.changed', (test) => {
        // console.log(test)
    });

    bpmnModeler.on('element.changed', (event) => {
        const element = event.element;
        const dataElement = {
            "name": element.businessObject.name,
            "width": element.width,
            "height": element.height,
            "type": element.type,
            "id": element.id
        }
        console.log(event)
        console.log(dataElement)
        // the element was changed by the user
    });

    function xmlToJSON(xml) {
        const xmlDoc = new DOMParser().parseFromString(xml, 'text/xml');
        const root = xmlDoc.documentElement;
        const result = {};
        if (root.hasAttributes()) {
            const attributes = root.attributes;
            for (let i = 0; i < attributes.length; i++) {
                if ("xmlns:" + root.tagName.split(":")[0] === attributes[i].name && attributes[i].name !== "xmlns:bpmn2") {
                    continue;
                }
                if (attributes[i].name == "xmlns") {
                    if (root.tagName !== "definitions") {
                        continue;
                    }
                }

                result['@' + attributes[i].name] = attributes[i].value;
            }
        }

        const childNodes = root.childNodes;
        for (let i = 0; i < childNodes.length; i++) {
            const child = childNodes[i];
            if (child.nodeType === Node.ELEMENT_NODE) {
                const tagName = child.nodeName;
                if (!result[tagName]) {
                    result[tagName] = xmlToJSON(child.outerHTML);
                } else {
                    if (!Array.isArray(result[tagName])) {
                        result[tagName] = [result[tagName]];
                    }
                    result[tagName].push(xmlToJSON(child.outerHTML));
                }
            } else if (child.nodeType === Node.TEXT_NODE && child.nodeValue.trim()) {
                result['labelText'] = child.nodeValue.trim();
            }
        }

        return result;
    }
    function createXMLNode(doc, data, parentNode) {
        for (let key in data) {
            if (key.startsWith('@')) {
                parentNode.setAttribute(key.substring(1), data[key]);
            } else if (key === 'labelText') {
                const textNode = doc.createTextNode(data[key]);
                parentNode.appendChild(textNode);
            } else if (Array.isArray(data[key])) {
                for (let i = 0; i < data[key].length; i++) {
                    const arrayItem = data[key][i];
                    const childNode = doc.createElement(key);
                    parentNode.appendChild(childNode);
                    createXMLNode(doc, arrayItem, childNode);
                }
            } else if (typeof data[key] === 'object') {
                const childNode = doc.createElement(key);
                parentNode.appendChild(childNode);
                createXMLNode(doc, data[key], childNode);
            } else {
                const childNode = doc.createElement(key);
                const textNode = doc.createTextNode(data[key]);
                childNode.appendChild(textNode);
                parentNode.appendChild(childNode);
            }
        }
    }

    function jsonToXML(rootElement, jsonData) {
        const doc = document.implementation.createDocument(null, null, null);
        const rootNode = doc.createElement(rootElement);
        doc.appendChild(rootNode);

        createXMLNode(doc, jsonData, rootNode);

        return new XMLSerializer().serializeToString(doc);
    }
    // import function
    async function importXML(xml) {

        // import diagram
        console.log("test importXML")
        await bpmnModeler.importXML(xml);
        console.log("test")
        var canvas = bpmnModeler.get('canvas');
        console.log("canvas", canvas)

        // zoom to fit full viewport
        canvas.zoom('fit-viewport');

        // save diagram on button click
        var saveButton = document.querySelector('#save-button');

        saveButton.addEventListener('click', function () {

            // get the diagram contents
            bpmnModeler.saveXML({ format: true }, function (err, xml) {

                if (err) {
                    console.error('diagram save failed', err);
                } else {
                    console.info('diagram saved');
                    console.log(xml)
                    const jsonData = xmlToJSON(xml);
                    console.log(jsonData);
                    localStorage.setItem("xmlData", JSON.stringify(jsonData, null, 4));
                }
            });
        });
    }


    // a diagram to display
    //
    // see index-async.js on how to load the diagram asynchronously from a url.
    // (requires a running webserver)
    let jsonData = JSON.parse(localStorage.getItem("xmlData") ?? `{
        "@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
        "@xmlns:bpmn2": "http://www.omg.org/spec/BPMN/20100524/MODEL",
        "@xmlns:bpmndi": "http://www.omg.org/spec/BPMN/20100524/DI",
        "@xmlns:dc": "http://www.omg.org/spec/DD/20100524/DC",
        "@xmlns:di": "http://www.omg.org/spec/DD/20100524/DI",
        "@id": "sample-diagram",
        "@targetNamespace": "http://bpmn.io/schema/bpmn",
        "@xsi:schemaLocation": "http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd",
        "bpmn2:process": {
            "@xmlns:bpmn2": "http://www.omg.org/spec/BPMN/20100524/MODEL",
            "@id": "Process_1",
            "@isExecutable": "false",
            "bpmn2:startEvent": {
                "@xmlns:bpmn2": "http://www.omg.org/spec/BPMN/20100524/MODEL",
                "@id": "StartEvent_1",
                "bpmn2:outgoing": {
                    "@xmlns:bpmn2": "http://www.omg.org/spec/BPMN/20100524/MODEL",
                    "labelText": "Flow_0c3ia1g"
                }
            },
            "bpmn2:task": {
                "@xmlns:bpmn2": "http://www.omg.org/spec/BPMN/20100524/MODEL",
                "@id": "Activity_1bonnv4",
                "@name": "ตัวอย่าง",
                "bpmn2:incoming": {
                    "@xmlns:bpmn2": "http://www.omg.org/spec/BPMN/20100524/MODEL",
                    "labelText": "Flow_0c3ia1g"
                }
            },
            "bpmn2:sequenceFlow": {
                "@xmlns:bpmn2": "http://www.omg.org/spec/BPMN/20100524/MODEL",
                "@id": "Flow_0c3ia1g",
                "@sourceRef": "StartEvent_1",
                "@targetRef": "Activity_1bonnv4"
            }
        },
        "bpmndi:BPMNDiagram": {
            "@id": "BPMNDiagram_1",
            "bpmndi:BPMNPlane": {
                "@id": "BPMNPlane_1",
                "@bpmnElement": "Process_1",
                "bpmndi:BPMNShape": [
                    {
                        "@id": "_BPMNShape_StartEvent_2",
                        "@bpmnElement": "StartEvent_1",
                        "dc:Bounds": {
                            "@x": "212",
                            "@y": "342",
                            "@width": "36",
                            "@height": "36"
                        }
                    },
                    {
                        "@id": "Activity_1bonnv4_di",
                        "@bpmnElement": "Activity_1bonnv4",
                        "dc:Bounds": {
                            "@x": "320",
                            "@y": "320",
                            "@width": "100",
                            "@height": "80"
                        },
                        "bpmndi:BPMNLabel": {}
                    }
                ],
                "bpmndi:BPMNEdge": {
                    "@id": "Flow_0c3ia1g_di",
                    "@bpmnElement": "Flow_0c3ia1g",
                    "di:waypoint": [
                        {
                            "@x": "248",
                            "@y": "360"
                        },
                        {
                            "@x": "320",
                            "@y": "360"
                        }
                    ]
                }
            }
        }
    }`)
    // import xml
    let xmlData = '<?xml version="1.0" encoding="UTF-8"?>' + jsonToXML('bpmn2:definitions', jsonData);

    // xmlData = `<?xml version="1.0" encoding="UTF-8"?>
    //<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn">
    //  <bpmn2:process id="Process_1" isExecutable="false">
    //    <bpmn2:startEvent id="StartEvent_1"/>
    //  </bpmn2:process>
    //  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    //    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
    //      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
    //        <dc:Bounds height="36.0" width="36.0" x="412.0" y="240.0"/>
    //      </bpmndi:BPMNShape>
    //    </bpmndi:BPMNPlane>
    //  </bpmndi:BPMNDiagram>
    //</bpmn2:definitions>`;
    // console.log(importXML);
    // console.log(jsonToXML);
     console.log(xmlToJSON);
    console.log(xmlData);
    //console.log(xmlTojSON(xmlData));
    importXML(xmlData);
    //console.log(xmlData);


})(window.BpmnModeler, window.BpmnPropertiesPanelModule, window.BpmnPropertiesProviderModule);  