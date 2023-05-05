import React, { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom";
import { DataGrid } from '@mui/x-data-grid'
import Box from "@mui/material/Box";
import api from "../../Api"
import { Button, TextField } from "@mui/material";
import LoadingPanel from "../common/TabPanel/LoadingPanel";
import dayjs from "dayjs";
import Link from "@mui/material/Link";
import { GridActionsCellItem } from "@mui/x-data-grid";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle'
import { SnackbarContext } from "../../context/SnackbarContext";
import Backdrop from "@mui/material/Backdrop";

const ViewIncidentWithDropDown = ({ bu }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedRow, setSelectedRow] = useState({})
  const [openDialog, setOpenDialog] = useState({ flag: false, value: '' })
  const [openDeleteDialog, setOpenDeleteDialog] = useState({ flag: false, value: '' })
  const [text, setText] = useState("")
  const [ pageSize , setPageSize] = useState(15)
  const { setSnackBarConfig } = useContext(SnackbarContext)

  const navigate = useNavigate();

  const columns = [
    {
      field: 'id',
      headerName: 'Incident ID',
      headerClassName: "header",

      flex: 0.3,
      minWidth: 50,
      renderCell: (val) => {
        return <Link className="custom-link" href={`/admin/create_incident/edit/${val.value}`}>{val.value}</Link>
      }
    },
    {
      field: 'name', 
      headerName: "Summary",
      flex: 1,
      renderCell: (val) => {
        return <div className="wrap">{val.value}</div>
      }
    },

    {
      field: 'status',
      headerName: 'Status',
      flex: 0.3,
      minWidth: 50,
      renderCell : (val) =>{
        return <>{
           val.value?(val?.value).charAt(0).toUpperCase()+(val.value).slice(1):
          val.value}</>
      }
    },
    {
      field: "created_datetime",
      headerName: ' Created Date',
      flex: 0.4,
      // width:150,
      renderCell: (val) => {
        return dayjs(val.value).format("YYYY/MM/DD hh:mm:ss A")
      }
    },

    {
      field: "Actions",
      headerName: "Actions",
      width: 80,
      type: "actions",
      getActions: (params) => [

        <GridActionsCellItem
          label="Postmortem"
          onClick={(e) => { handleComments(params.id, params.row.incident_postmortem) }}
          showInMenu
        />,
        <GridActionsCellItem
          label="View Incident"
          onClick={() => handleViewIncident(params.id)}
          showInMenu
        />,
        <GridActionsCellItem
          label="Delete"
          onClick={() => handleDeleteIncidentConfirmation(params.id)}
          showInMenu
        />
      ]
    }

  ];
  const handleViewIncident = (id) => {
    const action = "edit"
    navigate(`/admin/create_incident/${action}/${id}`)
  }
  const handleDeleteIncidentConfirmation = (val) => {

    setOpenDeleteDialog({ flag: true, value: val })
  }
  const handleComments = (val, comments) => {
    setText(comments)
    setOpenDialog({ flag: true, value: val })
  }

  useEffect(() => {

    const getIncidents = async () => {
      try {
        setLoading(true)
        const res = await api.viewIncidents();
        setData(res?.data?.results)
        setLoading(false)
      }
      catch (e) {
        console.log(e)
      }
    }
    getIncidents();
  }, [bu])

  const handleRowClick = (e) => {
    setSelectedRow(e)
  }

  const handleDelete = async () => {

    try {
      const res = await api.deleteIncident(openDeleteDialog.value)
      setOpenDeleteDialog({ flag: false, value: '' })
      // window.location.reload() && loading && <LoadingPanel />
      setSnackBarConfig({ open: "true", message: "Incident Deleted Successfully", severity: "success" })
      setLoading(true)
     let res2 = await api.viewIncidents();
     setData(res2?.data?.results)
     res2 && setLoading(false)
    } catch (e) {
      console.log(e)
    } finally {

    }
  }
  const handleFormSubmit = (e) => {

    e.preventDefault();

  }
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setText(value)
  }
  const handleClose = () => {
    setOpenDialog({ flag: false, value: '' })
    setOpenDeleteDialog({ flag: false, value: '' })
    setText("")
  }
  const insertComments = async () => {
    try {
      const res = await api.addComments(openDialog.value, {
        "incident_postmortem": text
      })
      let res2 = await api.viewIncidents();
      setData(res2?.data?.results)
      res2 && setLoading(false)
      setSnackBarConfig({ open: "true", message: "Comments updated successfully", severity: "success" })
      setOpenDialog({ flag: false, value: '' })
      setText('')
    }
    catch (e) {
      console.log(e)
    }
  }

  return <><div className="pages" >
   <div >
   <Backdrop 
    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
     open={loading}>
    <LoadingPanel ></LoadingPanel>
    </Backdrop>
    </div>
    <Box 
    // sx={{ height: 700, width: '100%' }}
    sx={{ height: "auto" }}
    >    
      {data.length > 0 ? <DataGrid rows={data} columns={columns} 
        rowHeight={45}
        autoHeight={true}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10,15, 20,50]}
        pagination
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        onRowClick={handleRowClick}
        sx={{
          "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
            outline: "none !important",
          },
          '.MuiDataGrid-columnSeparator': {
            display: 'none',
          },
          '.MuiDataGrid-columnHeaderTitle': {
            fontWeight: 600
          }
        }}
      /> : ""}
    </Box>
    
    <Dialog open={openDialog.flag} onBackdropClick={handleClose} >
      <form onSubmit={handleFormSubmit}>
        <DialogTitle >Write Postmortem</DialogTitle>
        <DialogContent style={{ height: '300px' }}>
          <TextField name="comments" multiline sx={{
            width: 400
          }} InputLabelProps={{
            shrink: true
          }}
            value={text}
            onChange={(e) => {
              e.stopPropagation()
              handleInputChange(e)
            }}
            minRows={10}
          > </TextField>
        </DialogContent>
        <DialogActions sx={{ alignItems: "center" }}>
          <Button variant="contained" type="submit" sx={{ color: "white",fontWeight:"600"}}  onClick={e => insertComments()}> Write Postmortem</Button>
        </DialogActions>
      </form>
    </Dialog>
    <Dialog open={openDeleteDialog.flag} onBackdropClick={handleClose} >
      <DialogTitle sx={{ fontWeight: "700" }}> Do want to Delete Incident with ID: {openDeleteDialog.value} ? </DialogTitle>
      <DialogContent>
        WARNING! Deleting a incident cannot be undone. All associated data will be deleted as well. Please be absolutely sure this is what you want.

        {/* <br/><br/><div style={{alignItems:'center'}}>
      Type DELETE in the box below for final confirmation, then hit the delete button.
      </div> */}
        <br />
        {/* <TextField name="delete" sx={{width: 300}} value={keyword} onChange={handleDeleteConfirmation} placeholder="Write 'DELETE'"></TextField> */}
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="error"
          onClick={e => handleDelete(e)}>Yes</Button>
        <Button variant="contained" color="success"
          onClick={(e) => {
            setOpenDeleteDialog({ flag: false })
          }}
        >No</Button>
      </DialogActions>
    </Dialog>
  </div>
  </>
}
export default ViewIncidentWithDropDown;