import React, { useEffect, useState ,useRef} from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState,convertToRaw ,ContentState,convertFromHTML,convertFromRaw} from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html"
import { FormControl, Grid } from "@mui/material";
const TextEditor = ({message , messageObject}) =>{
    
  const [convertedContent,setConvertedContent]=useState()
  const [data,setData]=useState()
  const [editorState,setEditorState] = useState(
    ()=>{
      EditorState.createEmpty()
    //  const blocksFromHTML = convertFromHTML(messageObject);
    //  const contentState = ContentState.createFromBlockArray(
    //   blocksFromHTML.contentBlocks,
    //   blocksFromHTML.entityMap
    //  )
    //  return EditorState.createWithContent(contentState)
  }

  ) 
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
   { 
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