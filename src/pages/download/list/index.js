// ** React Imports
import { useEffect, useState, useCallback } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { DataGrid } from '@mui/x-data-grid'
import axios from 'axios'
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
//
import { getInitials } from 'src/@core/utils/get-initials'
import Icon from 'src/@core/components/icon'
import Link from 'next/link'
import Comheader from './Comheader'
import Headtitle from 'src/@core/components/Headtitle'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { fetchData } from 'src/store/apps/download'

const Download = () => {
  const [total, setTotal] = useState(0)
  const [sort, setSort] = useState('asc')
  const [rows, setRows] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [sortColumn, setSortColumn] = useState('title')
  const [value, setValue] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [sequentialId, setSequentialId] = useState(1); // Inisialisasi dengan nilai 1


  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 7 })
  function loadServerRows(currentPage, data) {
    return data.slice(currentPage * paginationModel.pageSize, (currentPage + 1) * paginationModel.pageSize)
  }

  const fetchTableData = useCallback(
    async (sort, q, column) => {
      setLoading(true)
      await axios
        .get(`${process.env.APP_API}download/list`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }, {
          params: {
            q,
            sort,
            column
          }
        },)
        .then(res => {
          console.log(res.data, 'response server')
          setLoading(false)
          setTotal(res.data.length)
          setRows(loadServerRows(paginationModel.page, res.data))
        }).finally(() => {
          setLoading(false)
        })
    },
    [paginationModel]
  )
  const dispatch = useDispatch()
  const store = useSelector(state => state.download)

  useEffect(() => {
    fetchTableData(sort, searchValue, sortColumn)
  }, [fetchTableData, searchValue, sort, sortColumn])

  const handleSortModel = newModel => {
    if (newModel.length) {
      setSort(newModel[0].sort)
      setSortColumn(newModel[0].field)
      fetchTableData(newModel[0].sort, searchValue, newModel[0].field)
    } else {
      setSort('asc')
      setSortColumn('title')
    }
  }
  const handleSearch = value => {
    setSearchValue(value)
    fetchTableData(sort, value, sortColumn)
  }

  const RowOptions = ({ id, setLoading }) => {
    const [anchorEl, setAnchorEl] = useState(null)
    const rowOptionsOpen = Boolean(anchorEl)

    const handleRowOptionsClick = event => {
      setAnchorEl(event.currentTarget)
    }

    const handleRowOptionsClose = () => {
      setAnchorEl(null)
    }

    const DeleteCat = (id) => {
      setLoading(true)
      axios.delete(`${process.env.APP_API}download/destroy/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
        .then((response) => {
          fetchTableData()
          setLoading(false)
          toast.success('Data Download Berhasil di hapus')
        })
        .catch(error => {
          toast.error(`gagal di hapus ${error}`)
          // onDeleteSuccess()
        }).finally(() => {
          setLoading(false)
        });
    }

    const handleDelete = (id) => {
      DeleteCat(id)
      handleRowOptionsClose()
    }

    return (
      <>
        <IconButton size='small' onClick={handleRowOptionsClick}>
          <Icon icon='tabler:dots-vertical' />
        </IconButton>
        <Menu
          keepMounted
          anchorEl={anchorEl}
          open={rowOptionsOpen}
          onClose={handleRowOptionsClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          PaperProps={{ style: { minWidth: '8rem' } }}
        >
          <MenuItem
            component={Link}
            sx={{ '& svg': { mr: 2 } }}
            href={`/download/edit/${id}`}
            onClick={handleRowOptionsClose}
          >
            <Icon icon='tabler:eye' fontSize={20} />
            {`View`}
          </MenuItem>
          <MenuItem
            component={Link}
            onClick={handleRowOptionsClose}
            href={`/download/edit/${id}`}
            sx={{ '& svg': { mr: 2 } }}>
            <Icon icon='tabler:edit' fontSize={20} />
            {`Edit`}
          </MenuItem>
          <MenuItem onClick={() => handleDelete(id)}
            sx={{ '& svg': { mr: 2 } }}>
            <Icon icon='tabler:trash' fontSize={20} />
            {`Delete`}
          </MenuItem>
        </Menu>
      </>
    )
  }

  const sequentialData = store.data
    ? store.data.map((item, index) => ({ ...item, id: sequentialId + index }))
    : [];
  return (
    <Card>
      <Headtitle title="Master Download" />
      <CardHeader title={
        (<>
          <Icon fontSize='1.25rem' icon='tabler:download' />
          {`Master Download`}
        </>)
      } />



      <Comheader
        value={searchValue}
        handleFilter={handleSearch}

      />
      <DataGrid
        autoHeight
        pagination
        rows={rows}
        rowCount={total}
        columns={
          [

            {
              flex: 0.25,
              minWidth: 290,
              field: 'judul',
              headerName: 'Judul',
              renderCell: ({ row }) => {
                if (row.judul === null) {
                  return (<b>Kosong</b>)
                } else {
                  return row.judul
                }
              }
            },
            {
              flex: 0.25,
              minWidth: 290,
              field: 'category',
              headerName: 'Category',
              renderCell: ({ row }) => {
                if (row.category === '') {
                  return (<b>Kosong</b>)
                } else {
                  return row.category
                }
              }
            },
            {
              flex: 0.25,
              minWidth: 290,
              field: 'gambar',
              headerName: 'File',
              renderCell: ({ row }) => {
                if (row.gambar === null) {
                  return (<b>Kosong</b>)
                } else {
                  return (<IconButton size='small'>
                    <Icon icon='tabler:download' />
                  </IconButton>)
                }
              }
            },
            {
              flex: 0.25,
              minWidth: 290,
              field: 'created_at',
              headerName: 'Created at',
              renderCell: ({ row }) => {
                if (row?.created_at === null || row?.created_at === undefined) {
                  return (<b>Kosong</b>)
                } else {
                  return row.created_at
                }
              }
            },
            {
              flex: 0.25,
              minWidth: 290,
              field: 'updated_at',
              headerName: 'Updated at',
              renderCell: ({ row }) => {
                if (row?.updated_at === null || row?.update_at === undefined) {
                  return (<b>Kosong</b>)
                } else {
                  return row.updated_at
                }
              }
            },
            {
              flex: 0.25,
              // minWidth: 290,
              field: 'created_by',
              headerName: 'Created By',
              renderCell: ({ row }) => {
                if (row?.created_by === null || row?.created_by === undefined) {
                  return (<b>Kosong</b>)
                } else {
                  return row.created_by
                }
              }
            },


            {
              flex: 0.1,
              minWidth: 100,
              sortable: false,
              field: 'actions',
              headerName: 'Actions',
              renderCell: ({ row }) => <RowOptions id={row.id} setLoading={setLoading} />
            }
          ]
        }
        loading={loading}
        checkboxSelection
        sortingMode='server'
        paginationMode='server'
        pageSizeOptions={[7, 10, 25, 50]}
        paginationModel={paginationModel}
        onSortModelChange={handleSortModel}
        onPaginationModelChange={setPaginationModel}
        slotProps={{
          baseButton: {
            size: 'medium',
            variant: 'tonal'
          },
          toolbar: {
            value: searchValue,
            clearSearch: () => handleSearch(''),
            onChange: event => handleSearch(event.target.value)
          }
        }}
      />
    </Card>
  )
}

export default Download
