import React, { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState,convertToRaw ,ContentState} from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html"
import htmlToDraft from "html-to-draftjs"
import TextareaAutosize from '@mui/material/TextareaAutosize';
import axios from "axios"
import Box from '@mui/material/Box';
import { FormControl, FormLabel, Grid } from "@mui/material";
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from '@mui/material/TableBody';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import Paper from '@mui/material/Paper';

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const TextEditor = () =>{
    
    const [convertedContent,setConvertedContent]=useState()
    const [editorState,setEditorState] = useState(()=>{
        EditorState.createEmpty()
    })  
  useEffect(()=>{
     convertContentToHTML();
  
  },[editorState])
const handleChange=(e)=>{
setEditorState(e)

}
const convertContentToHTML=()=>{
  
  if(editorState)
  { var selectionState = editorState.getCurrentInlineStyle();
  //  var anchorKey = selectionState.getAnchorKey();
    console.log("anchor",draftToHtml(selectionState))
    const data=draftToHtml(
    convertToRaw(editorState.getCurrentContent())
    )
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
      </Grid>
      <Grid item md={12}>
      <TextareaAutosize style={{width:'100%'}}disabled value={convertedContent} />
      </Grid>
      </Grid>
      <FormControl>
         
          {/* <TableContainer component={Paper}>
          <Table sx={{ wisth:'100%'}}>
       <TableBody>
        {<ul><TableRow>
          <TableCell><li>test <ul><li>helo2</li><li>helo2</li></ul></li></TableCell>
         
        </TableRow></ul>}
        {<ul><TableRow>
          <TableCell><li>test2 <ul><li>helo2</li><li>helo2</li></ul></li></TableCell>
         
        </TableRow></ul>}
       </TableBody>
          </Table>

          </TableContainer> */}
    
      </FormControl>
  </div></>
}
export default TextEditor;