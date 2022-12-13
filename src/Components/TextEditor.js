import React, { useEffect, useState ,useRef} from "react";

import { FormControl, Grid } from "@mui/material";

import { Editor } from '@tinymce/tinymce-react';
const TextEditor = () =>{
    

  
    const editorRef = useRef(null);
    const log = () => {
      if (editorRef.current) {
        console.log(typeof editorRef.current.getContent());
      }
    }; 
 


    return <> <div style={{ padding: '2px',minheight:'300px'}}>
      <br/>
      <Grid container>
      <Grid item md={12} >
    <Editor
        onInit={(evt, editor) => editorRef.current = editor}
        init={{
          height: 200,
          menubar: true,
          branding:false
        }}
      />
      </Grid>
      <Grid item md={12}>
     
      </Grid>
      </Grid>
      <FormControl></FormControl>
  </div></>
}
export default TextEditor;