import { useState, useCallback, useEffect } from 'react'
import './App.css'
import { ReactFlow,
  MiniMap,
  Controls,
  Background,
  Panel,
  useNodesState,
  useEdgesState,
  applyNodeChanges,
  ReactFlowProvider
 } from '@xyflow/react';

 import { SketchPicker } from 'react-color';

 import { IoAdd } from "react-icons/io5";
 
import '@xyflow/react/dist/style.css';

function CustomNode({ data }) {
 
  return (
    <div className="node" id={data.id} onClick={() => data.setActiveNode(data.id)}
      style={data.styles}>
      {data.label}
    </div>
  )
}

const nodeTypes = {
  'custom': CustomNode
};

/*

Wanted CSs

.button-30 {
  align-items: center;
  appearance: none;
  background-color: #FCFCFD;
  border-radius: 4px;
  border-width: 0;
  box-shadow: rgba(45, 35, 66, 0.4) 0 2px 4px,rgba(45, 35, 66, 0.3) 0 7px 13px -3px,#D6D6E7 0 -3px 0 inset;
  box-sizing: border-box;
  color: #36395A;
  cursor: pointer;
  display: inline-flex;
  font-family: "JetBrains Mono",monospace;
  height: 48px;
  justify-content: center;
  line-height: 1;
  list-style: none;
  overflow: hidden;
  padding-left: 16px;
  padding-right: 16px;
  position: relative;
  text-align: left;
  text-decoration: none;
  transition: box-shadow .15s,transform .15s;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  white-space: nowrap;
  will-change: box-shadow,transform;
  font-size: 18px;
}

.button-30:focus {
  box-shadow: #D6D6E7 0 0 0 1.5px inset, rgba(45, 35, 66, 0.4) 0 2px 4px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #D6D6E7 0 -3px 0 inset;
}

.button-30:hover {
  box-shadow: rgba(45, 35, 66, 0.4) 0 4px 8px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #D6D6E7 0 -3px 0 inset;
  transform: translateY(-2px);
}

.button-30:active {
  box-shadow: #D6D6E7 0 3px 7px inset;
  transform: translateY(2px);
}
*/

const styles = [
  { "name": "backgroundColor", "type": "color", "default": "lightgrey" },
  { "name": "color", "type": "color", "default": "black" },
  { "name": "height", "type": "text", "default": "auto" },
  { "name": "width", "type": "text", "default": "auto" },
  { "name": "fontSize", "type": "text", "default": "16px" },
  { "name": "fontFamily", "type": "text", "default": "sans-serif" },
  { "name": "fontWeight", "type": "text", "default": "normal" },
  { "name": "fontStyle", "type": "text", "default": "normal" },
  { "name": "textAlign", "type": "text", "default": "left", "options": ["left", "center", "right", "justify"] },
  { "name": "lineHeight", "type": "text", "default": "normal" },
  { "name": "letterSpacing", "type": "text", "default": "normal" },
  { "name": "margin", "type": "text", "default": "0" },
  { "name": "padding", "type": "text", "default": "0" },
  { "name": "border", "type": "text", "default": "none" },
  { "name": "borderRadius", "type": "text", "default": "0" },
  { "name": "borderColor", "type": "color", "default": "black" },
  { "name": "borderWidth", "type": "text", "default": "1px" },
  { "name": "borderStyle", "type": "text", "default": "solid", "options": ["none", "solid", "dashed", "dotted", "double", "groove", "ridge", "inset", "outset"] },
  { "name": "boxShadow", "type": "text", "default": "none" },
  { "name": "textShadow", "type": "text", "default": "none" },
  { "name": "display", "type": "text", "default": "block", "options": ["none", "block", "inline", "inline-block", "flex", "grid", "inline-flex", "inline-grid", "table", "table-row", "table-cell"] },
  { "name": "position", "type": "text", "default": "static", "options": ["static", "relative", "absolute", "fixed", "sticky"] },
  { "name": "zIndex", "type": "text", "default": "auto" },
  { "name": "overflow", "type": "text", "default": "visible", "options": ["visible", "hidden", "scroll", "auto"] },
  { "name": "opacity", "type": "text", "default": "1" },
  { "name": "visibility", "type": "text", "default": "visible", "options": ["visible", "hidden", "collapse"] },
  { "name": "cursor", "type": "selector", "default": "auto", "options": ["alias", "all-scroll", "auto", "cell", "col-resize", "context-menu", "copy", "crosshair", "default", "e-resize", "ew-resize", "grab", "grabbing", "help", "move", "n-resize", "ne-resize", "nesw-resize", "ns-resize", "nw-resize", "nwse-resize", "no-drop", "none", "not-allowed", "pointer", "progress", "row-resize", "s-resize", "se-risze", "sw-resize", "text", "w-resize", "wait", "zoom-in", "zoom-out"] },
  { "name": "transition", "type": "text", "default": "none" },
  { "name": "transform", "type": "text", "default": "none" },
  { "name": "alignItems", "type": "text", "default": "stretch", "options": ["flex-start", "flex-end", "center", "baseline", "stretch"] },
  { "name": "justifyContent", "type": "text", "default": "flex-start", "options": ["flex-start", "flex-end", "center", "space-between", "space-around", "space-evenly"] },
  { "name": "flexDirection", "type": "text", "default": "row", "options": ["row", "row-reverse", "column", "column-reverse"] },
  { "name": "flexWrap", "type": "text", "default": "nowrap", "options": ["nowrap", "wrap", "wrap-reverse"] },
  { "name": "alignSelf", "type": "text", "default": "auto", "options": ["auto", "flex-start", "flex-end", "center", "baseline", "stretch"] },
  { "name": "flexGrow", "type": "text", "default": "0" },
  { "name": "flexShrink", "type": "text", "default": "1" },
  { "name": "flexBasis", "type": "text", "default": "auto" },
  { "name": "gap", "type": "text", "default": "0" },
  { "name": "gridTemplateColumns", "type": "text", "default": "none" },
  { "name": "gridTemplateRows", "type": "text", "default": "none" },
  { "name": "gridTemplateAreas", "type": "text", "default": "none" },
  { "name": "gridAutoColumns", "type": "text", "default": "none" },
  { "name": "gridAutoRows", "type": "text", "default": "none" },
  { "name": "gridAutoFlow", "type": "text", "default": "row", "options": ["row", "column", "row dense", "column dense"] },
  { "name": "gridColumn", "type": "text", "default": "auto" },
  { "name": "gridRow", "type": "text", "default": "auto" },
  { "name": "gridColumnStart", "type": "text", "default": "auto" },
  { "name": "gridColumnEnd", "type": "text", "default": "auto" },
  { "name": "gridRowStart", "type": "text", "default": "auto" },
  { "name": "gridRowEnd", "type": "text", "default": "auto" }
];


function App() {
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);
  const [activeNode, setActiveNode] = useState(null);
  const [nodeStyles, setNodeStyles] = useState({});
  const [baseStyles, setBaseStyles] = useState({})
  const [showColorPicker, setShowColorPicker] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let newBaseStyle = {rerenderId: 0};
    styles.forEach((style) => {
      newBaseStyle[style.name] = style.default;
    })


    setBaseStyles(newBaseStyle)
  }, [styles])


  function addNewNode(){
    let id = Math.floor(Math.random() * 999999999).toString()
    let new_node = {
      id: id,
      data: { 
        label: "Example Content",
        setActiveNode: setActiveNode,
        id: id,
        styles: {...baseStyles}
      },
      position: { x: Math.random() * 100 * nodes.length, y: Math.random() * 100 * nodes.length }, 
      type: "custom"
    };

    setNodes((oldNodes) => oldNodes.concat(new_node))
  }

  const onNodesChange = useCallback(
    (changes) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [setNodes]
  );

  function handleNodeClick(_, node){
    setActiveNode(node.id)
    setNodeStyles(node.data.styles);
  }

  function changeStyle(newKey, newValue){
    setNodeStyles((oldNodesStyles) => {
      let newNodeStyles = {...oldNodesStyles};
      newNodeStyles[newKey] = newValue;
      newNodeStyles.rerenderId++;

      return newNodeStyles
    })    
  }

  useEffect(() => {
    setNodes((oldNodes) => {
      let newNodes = [...oldNodes]
      newNodes.forEach((node) => {
        if (node.id == activeNode){
          node.data.styles = nodeStyles;
        }
      })

      return newNodes;
    })
  }, [nodeStyles.rerenderId])

  

  return (
    <div id="nodegraph">
      <ReactFlowProvider>
        <ReactFlow nodes={nodes} edges={edges} fitView
        nodeTypes={nodeTypes} onNodesChange={onNodesChange} onNodeClick={handleNodeClick}>
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />
          <Panel position="top-left">
            <div id="navbar">
              <div className="navbar-button" onClick={() => addNewNode()}><IoAdd/></div>
            </div>
          </Panel>
          <Panel position="top-right">
            {activeNode != null && <div id="edit-panel">
                 <input
                      className="search-bar"
                      type="text"
                      name="name"
                      onChange={(e) => setSearchTerm(e.target.value)}
                      value={searchTerm}
                  />


                {styles.filter((style) => style.name.startsWith(searchTerm)).sort((a,b) => a.name > b.name).map((style, index) => (
                  <div className="selector-pair" key={index}>
                    
                    <h3>{style.name}</h3>

                    {style.type == "text" ?
                     <div>  
                       <input
                          className="text-input-node"
                          type="text"
                          name="name"
                          onChange={(e) => changeStyle(style.name, e.target.value)}
                          value={nodeStyles[style.name]}
                      />

                     </div> 
                    : style.type=="selector" ?
                     <div>
                      <select
                         className="text-input-node"
                         type="text"
                         name="name"
                         onChange={(e) => changeStyle(style.name, e.target.value)}
                         value={nodeStyles[style.name]}
                      >
                        {style.options.map((option, index) => (
                          <option key={index} className="options-selector">
                            {option}
                          </option>
                        ))}
                      </select>
                     </div> 
                     
                     : style.type == "color" ?
                     
                     <div className="colorIdentifierHolder">
                      <div style={{"backgroundColor": nodeStyles[style.name]}} className="colorIdentifier"
                        onClick={() => setShowColorPicker((oldVal) => oldVal == style.name ? null : style.name)} />

                      {showColorPicker == style.name && 
                      <div className="color-picker-holder">
                        <SketchPicker
                        color={ nodeStyles[style.name] }
                        onChangeComplete={ (color) => changeStyle(style.name, color.hex)}
                        />
                      </div>}
  
                     </div> 
                     
                     : <div></div>}
                  </div>
                ))}

            
              
            </div>}
          </Panel>
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  )
}

export default App
