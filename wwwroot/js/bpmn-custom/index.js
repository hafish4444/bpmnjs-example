
//import CustomContextPad from './CustomContextPad.js';
//import CustomPalette from './CustomPalette.js';
BpmnPropertiesPanelModule = window.bpmnJsPropertiesPanel.BpmnPropertiesPanelModule
BpmnPropertiesProviderModule = window.bpmnJsPropertiesPanel.BpmnPropertiesProviderModule
export default {
    __init__: ['bpmnPropertiesPanelModule', 'bpmnPropertiesProviderModule'],
    bpmnPropertiesPanelModule: ['type', BpmnPropertiesPanelModule],
    bpmnPropertiesProviderModule: ['type', BpmnPropertiesProviderModule]
};