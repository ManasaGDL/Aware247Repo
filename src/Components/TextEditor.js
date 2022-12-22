import React, { useEffect, useState ,useRef} from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState,convertToRaw ,ContentState} from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html"
import { FormControl, Grid } from "@mui/material";
const TextEditor = ({message}) =>{
    
  const [convertedContent,setConvertedContent]=useState()
  const [editorState,setEditorState] = useState(()=>{
      EditorState.createEmpty()
  })
  
    const editorRef = useRef(null);
    const log = () => {
      if (editorRef.current) {
        console.log(typeof editorRef.current.getContent());
        
      }
    }; 
    useEffect(()=>{
      convertContentToHTML();
   
   },[editorState])
 const handleChange=(e)=>{
 setEditorState(e)
 
 }
 useEffect(()=>{
  if(convertedContent)
message(convertedContent)
 },[convertedContent])
 const convertContentToHTML=()=>{
   
   if(editorState)
   { var selectionState = editorState.getCurrentInlineStyle();
   //  var anchorKey = selectionState.getAnchorKey();
 
     const data=draftToHtml(
     convertToRaw(editorState.getCurrentContent())
     )
    
     message(data);
   setConvertedContent(data)
   }
 }



    return <> <div style={{ padding: '2px',minheight:'300px'}}>
      <br/>
      <Grid container>
      <Grid item md={12} >
      <Editor
      editorState={editorState}
      onEditorStateChange={handleChange}
      wrapperClassName="wrapper-class"
      editorClassName="editor-class"
      toolbarClassName="toolbar-class"
      defaultEditorState={editorState}
    /> 
    {/* <Editor
        onInit={(evt, editor) => editorRef.current = editor}
        init={{
          height: 200,
          menubar: true
          //'file edit insert view format table tools help',
          // branding:false
        }}
        onChange={handleChange}
      /> */}
      </Grid>
      <Grid item md={12}>
      {/* <TextareaAutosize style={{width:'100%'}}disabled value={convertedContent} /> */}
      </Grid>
      </Grid>
      <FormControl></FormControl>
  </div></>
}
export default TextEditor;