// ** React Imports
import { useEffect, useState, useCallback } from 'react'

// ** MUI Imports
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid } from '@mui/x-data-grid'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import axios from 'axios'
import Link from 'next/link'
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { getInitials } from 'src/@core/utils/get-initials'
import Icon from 'src/@core/components/icon'
import { Button, Divider, FormLabel } from '@mui/material'
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TableHeader from './Tableheader';
import Head from 'next/head';
import { useRouter } from 'next/router';
import CardStatsVertical from 'src/@core/components/card-statistics/card-stats-vertical'
import CardContent from '@mui/material/CardContent';
import CustomTextField from 'src/@core/components/mui/text-field';
import Comheader from 'src/@core/components/Comheader';
import { getparamPend } from 'src/@core/utils/encp';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const renderClient = params => {
  const { row } = params
  const stateNum = Math.floor(Math.random() * 6)
  const states = ['success', 'error', 'warning', 'info', 'primary', 'secondary']
  const color = states[stateNum]

}

const statusObj = {
  1: { title: 'current', color: 'primary' },
  2: { title: 'professional', color: 'success' },
  3: { title: 'rejected', color: 'error' },
  4: { title: 'resigned', color: 'warning' },
  5: { title: 'applied', color: 'info' }
}

const Jenjang = [
  {
    'id': 1,
    'value': 'TKA',

  },
  {
    'id': 2,
    'value': 'TKB',
  },
  {
    'id': 3,
    'value': 'SD',

  }, {
    'id': 4,
    'value': 'MTSI',

  },
]

const RowOptions = ({ id, status }) => {
  // ** Hooks
  // const dispatch = useDispatch()

  // ** State
  console.log(status, 'status ppdb')
  const [anchorEl, setAnchorEl] = useState(null)
  const rowOptionsOpen = Boolean(anchorEl)



  const handleRowOptionsClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const router = useRouter()

  const handleRowOptionsClose = (id, params) => {
    if (params === 'edit') {
      router.push(`/ppdb/edit/${id}`)
    } else if (params === 'view') {
      router.push(`/ppdb/edit/${id}`)
    } else if (params === 'confirm') {
      router.push(`/ppdb/confirm/${id}`)
    } else if (params === 'delete') {
      router.push(`/ppdb/edit/${id}`)

    }
    setAnchorEl(null)
  }

  const handleDelete = () => {
    // dispatch(deleteUser(id))
    handleRowOptionsClose(id, 'delete')
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
          // component={Link}
          sx={{ '& svg': { mr: 2 } }}
          onClick={() => handleRowOptionsClose(id, 'view')}
        >
          <Icon icon='tabler:eye' fontSize={20} />
          View
        </MenuItem>
        {status === 1 ? '' :
          (
            <>
              <MenuItem onClick={() => handleRowOptionsClose(id, 'confirm')} sx={{ '& svg': { mr: 2 } }}>
                <Icon icon='tabler:check' fontSize={20} />
                Verifikasi
              </MenuItem>
              <MenuItem href={`/ppdb/edit/${id}`} onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
                <Icon icon='tabler:trash' fontSize={20} />
                Delete
              </MenuItem>
            </>
          )
        }
      </Menu>
    </>
  )
}

const columns = [
  {
    flex: 0.2,
    field: 'id',
    minWidth: 100,
    headerName: 'ID',
    renderCell: ({ row }) => (
      <Typography href={`/apps/invoice/preview/${row.id}`}>{`#${row.id}`}</Typography>
    )
  },
  {
    flex: 0.25,
    minWidth: 290,
    field: 'date_inv',
    headerName: 'Tgl & Jam'
  },
  {
    flex: 0.25,
    minWidth: 290,
    field: 'nama',
    headerName: 'Nama'
  },
  {
    flex: 0.25,
    minWidth: 290,
    field: 'no_telp',
    headerName: 'Handphone'
  },
  {
    flex: 0.25,
    minWidth: 290,
    field: 'nis',
    headerName: 'Nis',
  },

  {
    flex: 0.25,
    minWidth: 290,
    field: 'jk',
    headerName: 'JK',
    renderCell: ({ row }) => {
      if (row.jk === 'P') {
        return (<b>Perempuan</b>)
      } else {
        return 'Laki - Laki'
      }
    }
  },
  {
    flex: 0.25,
    minWidth: 290,
    field: 'id_majors',
    headerName: 'Majors',
    renderCell: ({ row }) => {
      return getparamPend(row.id_majors)
    }
  },
  {
    flex: 0.25,
    minWidth: 290,
    field: 'status',
    headerName: 'Status',
    renderCell: ({ row }) => {
      if (row.status === '1') {
        return <CustomChip
          rounded
          skin='light'
          size='small'
          label={'Approved'}
          color={'success'}
          sx={{ textTransform: 'capitalize' }}
        />
      } else if (row.status === '2') {
        return <CustomChip
          rounded
          skin='light'
          size='small'
          label={'Tolak'}
          color={'error'}
          sx={{ textTransform: 'capitalize' }}
        />
      } else {
        return <CustomChip
          rounded
          skin='light'
          size='small'
          label={'Baru'}
          color={'error'}
          sx={{ textTransform: 'capitalize' }}
        />
      }


    }
  },
  {
    flex: 0.25,
    minWidth: 290,
    field: 'username',
    headerName: 'User id'
  },
  {
    flex: 0.1,
    minWidth: 100,
    sortable: false,
    field: 'staff_konfirmasi',
    headerName: 'Actions',
    renderCell: ({ row }) => <RowOptions id={row.id} status={row.status} />
  }
]

const datastatus = [
  {
    'id': '1', 'status': 'Diterima',

  },
  {
    'id': '2', 'status': 'Di tolak',
  }
]

const List = () => {
  // ** States
  const [total, setTotal] = useState(0)
  const [sort, setSort] = useState('asc')
  const [rows, setRows] = useState([])
  const [role, setRole] = useState('')
  const [plan, setPlan] = useState('')
  const [value, setValue] = useState('')

  const [takademik, setTakademik] = useState('')
  const [status, setStatus] = useState('')
  const [jenjang, setJenjang] = useState('')

  const [tahunakademik, setTahunakademik] = useState([])

  const [searchValue, setSearchValue] = useState('')
  const [sortColumn, setSortColumn] = useState('full_name')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 7 })
  function loadServerRows(currentPage, data) {
    return data.slice(currentPage * paginationModel.pageSize, (currentPage + 1) * paginationModel.pageSize)
  }

  const fetchTableData = useCallback(
    async (sort, q, column) => {
      await axios
        .get(`${process.env.APP_API}ppdb/list`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`
          }
        }, {
          params: {
            q,
            sort,
            column
          }
        })
        .then(res => {
          console.log(res.data[0], 'response server')
          setTotal(res.data.length)

          // const filteredData = res.data.filter((item) => {
          //   if (
          //     (status || item.status === status) &&
          //     (jenjang || item.id_majors.includes(jenjang))
          //   ) {
          //     return true;
          //   }
          //   return false;
          // })
          // setRows(loadServerRows(paginationModel.page, filteredData))

          if (status === '' || jenjang === '') {
            const filteredData = res.data
            setRows(loadServerRows(paginationModel.page, filteredData))

          } else {
            const filteredData = res?.data?.filter(posts => (
              posts.status?.toLowerCase().includes(status) || posts.jenjang?.toLowerCase().includes(jenjang)
            ))
            setRows(loadServerRows(paginationModel.page, filteredData))
          }
        })
    },
    [paginationModel]
  )

  useEffect(() => {
    const calltahun = async () => {
      await axios.post(`${process.env.APP_API}tahunakademik/list`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
      }).then((res) => {
        setTahunakademik(res.data)
      }).catch((err) => {
        console.log('gagal mengabil data tahun akademik', err)
      })
    }
    calltahun()
  }, [])

  useEffect(() => {
    fetchTableData(sort, searchValue, sortColumn)
  }, [fetchTableData, searchValue, sort, sortColumn])
  const handleFilter = useCallback(val => {
    setValue(val)
  }, [])

  const filterByjenjang = (e) => {
    console.log('filter bya je' + e.target.value)
    setJenjang(e.target.value)
    fetchTableData(sort, searchValue, sortColumn)
  }

  const filterByStatus = (e) => {
    setStatus(e.target.value)
    fetchTableData(sort, searchValue, sortColumn)
  }

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

  const fhandleRoleChange = (e) => {
    const level = e.target.value

  }

  return (
    <>
      <Head>
        <title>Master - PPDB</title>
      </Head>
      <Grid container spacing={6}>
        <Grid item xs={6} sm={4} lg={3}>
          <CardStatsVertical
            stats={rows.length}
            chipText='-12.2%'
            chipColor='default'
            avatarColor='info'
            title='Total Peserta'
            subtitle='Last week'
            avatarIcon='tabler:currency-dollar'
          />
        </Grid>
        <Grid item xs={6} sm={4} lg={3}>
          <CardStatsVertical
            stats={rows.length}
            chipText='-12.2%'
            chipColor='default'
            avatarColor='error'
            title='Total List'
            subtitle='Last week'
            avatarIcon='tabler:currency-dollar'
          />
        </Grid>
        <Grid item xs={6} sm={4} lg={3}>
          <CardStatsVertical
            stats='1.28k'
            chipText='-12.2%'
            chipColor='default'
            avatarColor='error'
            title='Total List'
            subtitle='Last week'
            avatarIcon='tabler:currency-dollar'
          />
        </Grid>
        <Grid item xs={6} sm={4} lg={3}>
          <CardStatsVertical
            stats='24.67k'
            chipText='+25.2%'
            avatarColor='info'
            chipColor='default'
            title='Total Sales'
            subtitle='Last week'
            avatarIcon='tabler:chart-bar'
          />
        </Grid>
      </Grid>
      <br /><br />
      <Card>

        <Divider sx={{ m: '0 !important' }} />
        {/* <TableHeader value={value} handleFilter={handleFilter} /> */}
        <CardContent>
          <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
            <Grid container spacing={4} paddingBottom={10}>
              <Grid item xs={12} sm={4}>
                <FormLabel>Jenjang : </FormLabel>
                <CustomTextField
                  select
                  fullWidth
                  SelectProps={{
                    displayEmpty: true,
                    onChange: e => filterByjenjang(e)
                  }}
                >
                  <MenuItem key={0} value={''}>
                    --Semua data--
                  </MenuItem>
                  {Jenjang.map((level) => (
                    <MenuItem key={level.value} value={level.id}>
                      {level.value.toUpperCase()}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormLabel>Tahun Akademik : </FormLabel>

                <CustomTextField
                  select
                  fullWidth
                  SelectProps={{
                    displayEmpty: true,
                    onChange: e => setTakademik(e.target.value)
                  }}
                >
                  <MenuItem key={0} value={null}>
                    --Semua data--
                  </MenuItem>
                  {tahunakademik.map((takademik) => (
                    <MenuItem key={takademik.id} value={takademik.id}>
                      {takademik.tahun} - {takademik.Semester}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </Grid>
              <Grid item xs={12} sm={4}>

                <FormLabel>Status : </FormLabel>

                <CustomTextField
                  select
                  fullWidth
                  // value={role} // Ganti defaultValue dengan value
                  SelectProps={{
                    displayEmpty: true,
                    onChange: e => filterByStatus(e)
                  }}
                >
                  <MenuItem key={0} value={''}>
                    --Status--
                  </MenuItem>
                  {datastatus.map((level) => (
                    <MenuItem key={level.id} value={level.status}>
                      {level.status.toUpperCase()}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </Grid>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Comheader addUserOpen={null} setAddUserOpen={null}
                handleFilter={handleSearch} setAction={''}
              />
            </Grid>
          </Box>
        </CardContent>
        <DataGrid
          autoHeight
          pagination
          rows={rows}
          rowCount={total}
          columns={columns}
          checkboxSelection
          sortingMode='server'
          paginationMode='server'
          pageSizeOptions={[7, 10, 25, 50]}
          paginationModel={paginationModel}
          onSortModelChange={handleSortModel}
          // slots={{ toolbar: ServerSideToolbar }}
          // onPaginationModelChange={setPaginationModel}
          onPaginationModelChange={newModel => {
            setPaginationModel(newModel);
            fetchTableData(sort, searchValue, sortColumn, newModel.page);
          }}

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
      </Card >
    </>
  )
}

export default List
