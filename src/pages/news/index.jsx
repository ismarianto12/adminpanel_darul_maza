// ** React Imports
import { useEffect, useState, useCallback } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid } from '@mui/x-data-grid'
import toast from 'react-hot-toast'
import Comheader from 'src/@core/components/Comheader'
import axios from 'axios'
import Link from 'next/link'
import { CircularProgress } from '@mui/material'
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { getInitials } from 'src/@core/utils/get-initials'
import Icon from 'src/@core/components/icon'
import Button from '@mui/material/Button'
import TableHeader from 'src/@core/components/TableHeader'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Headtitle from 'src/@core/components/Headtitle'
import { useDispatch, useSelector } from 'react-redux'
import { fetchData } from 'src/store/apps/page'
import CardStatsHorizontalWithDetails from 'src/@core/components/card-statistics/card-stats-horizontal-with-details'
import Grid from '@mui/material/Grid'
import Swal from 'sweetalert2'
import { getUserlogin } from 'src/@core/utils/encp'
import Action from 'src/@core/utils/action'
const RowOptions = ({ id, onDeleteSuccess }) => {

  const [anchorEl, setAnchorEl] = useState(null)
  const rowOptionsOpen = Boolean(anchorEl)

  const handleRowOptionsClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }
  const DeleteCat = (id) => {

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {

        axios.delete(`${process.env.APP_API}artikel/destroy/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        })
          .then(response => {
            toast.success('Data Berita Berhasil di hapus')
            onDeleteSuccess()
          })
          .catch(error => {
            toast.error(`gagal di hapus ${error}`)
            onDeleteSuccess()

          });

      }
    })
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
          href={`/news/edit/${id}`}
          onClick={handleRowOptionsClose}
        >
          <Icon icon='tabler:eye' fontSize={20} />
          {`View`}
        </MenuItem>
        <MenuItem
          href={`/news/edit/${id}`}
          onClick={handleRowOptionsClose}
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


const News = () => {
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [sort, setSort] = useState('asc')
  const [rows, setRows] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [value, setValue] = useState('')
  const [sortColumn, setSortColumn] = useState('title')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 7 })
  function loadServerRows(currentPage, data) {
    console.log(currentPage * paginationModel.pageSize, (currentPage + 1) * paginationModel.pageSize, 'page')
    return data.slice(currentPage * paginationModel.pageSize, (currentPage + 1) * paginationModel.pageSize)
  }

  const onDeleteSuccess = () => {
    fetchTableData();
  };

  const fetchTableData = useCallback(
    async (sort, q, column) => {
      setLoading(true)
      const level = {
        level: getUserlogin('role'),
        user_id: getUserlogin('id')
      }
      await axios
        .post(`${process.env.APP_API}artikel/list`,
          {
            level: getUserlogin('role'),
            user_id: getUserlogin('id'),
            page: paginationModel.page,
            q,
            sort,
            column
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
          },)
        .then(res => {

          const getdata = res?.data?.data
          setTotal(getdata.length)
          const search = q?.toLowerCase()
          console.log(search, 'status search action after event listner')
          if (search === null || search === undefined) {
            const filteredData = getdata
            setRows(loadServerRows(paginationModel.page, filteredData))

          } else {
            const filteredData = getdata.filter(posts => (
              posts.title?.toLowerCase().includes(search) || posts.judul?.toLowerCase().includes(search) || posts.content?.toLowerCase().includes(search) || posts.isi?.toLowerCase().includes(search)
            ))
            setRows(loadServerRows(paginationModel.page, filteredData))
          }
        }).finally(() => {
          setLoading(false)
        })
    },
    [paginationModel]
  )
  // const dispatch = useDispatch()
  // const store = useSelector(state => state.post)

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
    setLoading(true)
    setSearchValue(value)
    fetchTableData(sort, value, sortColumn)
  }


  const handleNextPage = () => {
    // Increment the page number and call fetchTableData with the updated paginationModel
    const nextPage = paginationModel.page + 1;
    setPaginationModel({ ...paginationModel, page: nextPage });
    fetchTableData(sort, searchValue, sortColumn, nextPage);
  };

  const handleFilter = useCallback(val => {
    setValue(val)
  }, [])

  const confirmActive = (param, artikel_id) => {
    Swal.fire({
      title: 'Anda yakin?',
      text: param === 'N' ? 'Non Aktifkan berita' : 'Aktifkan Berita yang dipilih.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya'
    }).then((result) => {
      if (result.isConfirmed) {
        Action().activenewsNews(param, artikel_id)
        onDeleteSuccess(sort, searchValue, sortColumn)
      }
    })
  }
  return (
    <>
      <Headtitle title={`Artikel`} />
      <CardHeader title={
        (<>
          <Icon fontSize='1.25rem' icon='tabler:news' />
          {`Master Artikel`}

        </>)
      } />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <CardStatsHorizontalWithDetails
            stats={`${total}`}
            // trend='negative'
            title='Total data'
            avatarColor='success'
            icon='tabler:document-check'
          // subtitle='Last week analytics'
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <CardStatsHorizontalWithDetails
            stats={rows.length}
            // trend='negative'
            title='Artikel active'
            avatarColor='success'
            icon='tabler:list-check'
          // subtitle='Last week analytics'
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <CardStatsHorizontalWithDetails
            stats='19,860'
            // trend='negative'
            title='Hits Artikel'
            avatarColor='success'
            icon='tabler:user-check'
          // subtitle='Last week analytics'
          />
        </Grid>
      </Grid>
      <br /><br />

      <Card>
        <Comheader
          value={searchValue}

          handleFilter={handleSearch}
          url={`/news/create`}
        />
        <DataGrid
          autoHeight
          pagination
          rows={rows}
          onClick={handleNextPage}
          rowCount={total}
          columns=
          {

            [

              {
                flex: 0.25,
                minWidth: 290,
                field: 'formatted_title',
                headerName: 'Judul'
              },
              {
                flex: 0.125,
                field: 'picture',
                minWidth: 290,
                headerName: 'Picture',
                renderCell: ({ row }) => {
                  <img src={`${process.env.ASSETS_API}/files/${row.picture}`} style={{ width: '100%' }}
                    onError={(e) => {
                      e.target.src = '/logo_new1.png';
                      e.target.style.width = '100%';
                    }}
                  />

                }
              },
              {
                // flex: 0.25,
                field: 'active',
                headerName: 'active',
                renderCell: ({ row }) => {
                  if (row.active === 'Y') {
                    return (<b>Active</b>)
                  } else {
                    return 'Un Active'
                  }
                }
              },
              {
                flex: 0.25,
                field: 'created_at',
                headerName: 'created at '
              },
              {
                flex: 0.25,
                field: 'updated_at',
                headerName: 'udataed at'
              },
              {
                flex: 0.25,
                field: 'user_id',
                headerName: 'User id',
                renderCell: ({ row }) => {
                  if (row.user_id) {
                    return row.user_id
                  } else {
                    return (<b>Kosong</b>)
                  }
                }

              },
              getUserlogin('role') === '1' ?
                {

                  flex: 0.25,
                  field: 'status',
                  headerName: 'Status',
                  renderCell: ({ row }) => {
                    if (row.active === 'N') {
                      return <Button
                        variant='contained' sx={{
                          'background': 'red',
                          'padding': '3px 3px', // Sesuaikan dengan ukuran yang Anda inginkan
                        }}
                        onClick={() =>
                          confirmActive('Y', row.id)
                        }
                      >
                        <Icon fontSize='20px' icon='tabler:list' />
                      </Button>

                    } else {
                      return <Button variant='contained' sx={{
                        'background': 'green',
                        'padding': '3px 3px', // Sesuaikan dengan ukuran yang Anda inginkan
                      }}
                        onClick={() =>
                          confirmActive('N', row.id)
                        }
                      >
                        <Icon fontSize='20px' icon='tabler:check' />

                      </Button>

                    }
                  }

                } :
                {


                  flex: 0.25,
                  field: 'status',
                  headerName: 'Status',
                  renderCell: ({ row }) => {
                    if (row.active === 'N') {
                      return 'Non Active'
                    } else {
                      return (<b>Active</b>)
                    }
                  }

                },
              {
                flex: 0.1,
                sortable: false,
                field: 'actions',
                headerName: 'Actions',
                renderCell: ({ row }) => <RowOptions id={row.id} onDeleteSuccess={onDeleteSuccess} />
              }
            ]

          }
          checkboxSelection
          sortingMode='server'
          paginationMode='server'
          pageSizeOptions={[7, 10, 25, 50]}
          paginationModel={paginationModel}
          onSortModelChange={handleSortModel}
          // slots={{ toolbar: ServerSideToolbar }}
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
          loading={loading}

        />
      </Card >
    </>
  )
}

export default News
