// ** React Imports
import { useEffect, useState, useCallback } from 'react'
import Grid from '@mui/material/Grid'

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

import { getInitials } from 'src/@core/utils/get-initials'
import Icon from 'src/@core/components/icon'
import Link from 'next/link'
import Comheader from './Comheader'
import Headtitle from 'src/@core/components/Headtitle'
import toast from 'react-hot-toast'
import CardStatsVertical from 'src/@core/components/card-statistics/card-stats-vertical'
import CardStatsHorizontalWithDetails from 'src/@core/components/card-statistics/card-stats-horizontal-with-details'

const RowOptions = ({ id, onDeleteSuccess }) => {
  // ** Hooks
  // const dispatch = useDispatch()
  // ** State
  const [anchorEl, setAnchorEl] = useState(null)
  const rowOptionsOpen = Boolean(anchorEl)

  const handleRowOptionsClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }
  const DeleteCat = (id) => {
    axios.delete(`${process.env.APP_API}guru/destroy/${id}`, {
      headers: {
        Authorization: `Bearer :${localStorage.getItem('accessToken')}`
      }
    })
      .then(e => {
        toast.success('Data Guru Berhasil di hapus')
        onDeleteSuccess()
      })
      .catch(error => {
        toast.error(`gagal di hapus ${error}`)
        onDeleteSuccess()
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
          href={`/promo/edit/${id}`}
          onClick={handleRowOptionsClose}
        >
          <Icon icon='tabler:eye' fontSize={20} />
          {`View`}
        </MenuItem>
        <MenuItem
          component={Link}
          onClick={handleRowOptionsClose}
          href={`/promo/edit/${id}`}
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

const Index = () => {
  const [total, setTotal] = useState(0)
  const [sort, setSort] = useState('asc')
  const [show, setShow] = useState()
  const [rows, setRows] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [sortColumn, setSortColumn] = useState('title')
  const [value, setValue] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)

  const [unitdata, setUnitdata] = useState([])
  const [kelas, setKelas] = useState([])
  const [tahunajaaran, setTahunajaran] = useState([])


  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 7 })
  function loadServerRows(currentPage, data) {
    return data.slice(currentPage * paginationModel.pageSize, (currentPage + 1) * paginationModel.pageSize)
  }
  const onDeleteSuccess = () => {
    fetchTableData();
  };
  const fetchTableData = useCallback(
    async (sort, q, column) => {
      await axios
        .get(`${process.env.APP_API}mapel/list`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
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


          // const
          const search = q.toLowerCase()
          const resdata = res.data[0]

          const filteredData = res.data.filter(galery => (
            galery.nama?.toLowerCase().includes(search) || galery.deskripsiId?.toLowerCase().includes(search) || galery.deskripsiEn?.toLowerCase().includes(search)
          ))

          setRows(loadServerRows(paginationModel.page, filteredData))
        }).finally(() => {
          setLoading(false)
        })
    },
    [paginationModel]
  )
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

  return (
    <>
      <Headtitle title="List Data pegawai" />

      <div className="accordion mb-3">
        <div className="accordion-item">
          <div className="accordion-header">
            <h2 className="accordion-button" data-bs-toggle="collapse" data-bs-target="#tab-filter" aria-expanded="true" style={{ cursor: 'pointer' }} onClick={() => setShow((show) => !show)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-filter" width={24} height={24} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M5.5 5h13a1 1 0 0 1 .5 1.5l-5 5.5l0 7l-4 -3l0 -4l-5 -5.5a1 1 0 0 1 .5 -1.5" />
              </svg>
              Filter Data
            </h2>
          </div>
          <div id="tab-filter" className={`accordion-collapse collapse ${show ? '' : 'show'}`} style={{}}>
            <div className="accordion-body pt-0">
              <form id="filter-form" action="javascript:void(0)">
                <div className="row">

                  <div className="col-sm-6 col-md-4 mb-3">
                    <label className="form-label">
                      Pilih Unit
                    </label>
                    <select name="unit" id="filter-unit" className="form-select">
                      {unitdata?.map((data) => {
                        return (
                          <option value=""></option>
                        )
                      }
                      )}
                    </select>
                  </div>
                  <div className="col-sm-6 col-md-4 mb-3">
                    <label className="form-label">
                      Pilih Kelas
                    </label>
                    <select name="class_name" id="class-name" className="form-select">
                      {kelas?.map((data) => {
                        return (
                          <option value=""></option>
                        )
                      }
                      )}
                    </select>
                  </div>
                  <div className="col-sm-6 col-md-4 mb-4">
                    <label className="form-label">
                      Tahun Ajaran
                    </label>
                    <select name="class_year" id="class-year" className="form-select">
                      {tahunajaaran?.map((data) => {
                        return (
                          <option value={data.id} key={data.id}>{data.tahun}</option>
                        )
                      }
                      )}
                    </select>
                  </div>

                  <div className="col-12">
                    <button type="button" id="btn-apply-filter" className="btn btn-primary">
                      Terapkan Filter
                    </button>
                    <button type="button" id="btn-reset-filter" className="btn btn-default ms-2">
                      Reset Filter
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <br /><br />
      <Card>
        <CardHeader title={
          (<>
            <Icon fontSize='1.25rem' icon='tabler:list' />
            {`Mata Pelajaran`}
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
                field: 'kode',
                headerName: 'Kode Mapel',
                renderCell: ({ row }) => {
                  if (row.nama === null) {
                    return (<b>Kosong</b>)
                  } else {
                    return row.nama
                  }
                }

              },
              {
                flex: 0.25,
                minWidth: 290,
                field: 'kelas',
                headerName: 'Kelas',
                renderCell: ({ row }) => {
                  if (row.kelas) {
                    return (<b>Kosong</b>)
                  } else {
                    return row.kelas
                  }
                }
              },
              {
                flex: 0.25,
                minWidth: 290,
                field: 'nama_mapel',
                headerName: 'Nama Mapel'

              },
              {
                flex: 0.25,
                minWidth: 290,
                field: 'kkm',
                headerName: 'Nama Mapel'

              },
              {
                flex: 0.25,
                minWidth: 290,
                field: 'create_at',
                headerName: 'created at ',
                renderCell: ({ row }) => {
                  if (row.created_at === null) {
                    return (<b>Kosong</b>)
                  } else {
                    return row.created_at
                  }
                }
              },
              {
                flex: 0.25,
                minWidth: 290,
                field: 'update_at',
                headerName: 'udataed at',
                renderCell: ({ row }) => {
                  if (row.updated_at === null) {
                    return (<b>Kosong</b>)
                  } else {
                    return row.updated_at
                  }
                }
              },
              {
                flex: 0.25,
                minWidth: 290,
                field: 'user_id',
                headerName: 'User id',
                renderCell: ({ row }) => {
                  if (row.user_id === null) {
                    return (<b>Kosong</b>)
                  } else {
                    return row.user_id
                  }
                }
              },
              {
                flex: 0.1,
                minWidth: 100,
                sortable: false,
                field: 'actions',
                headerName: 'Actions',
                renderCell: ({ row }) => <RowOptions id={row.id} onDeleteSuccess={onDeleteSuccess} />
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
    </>
  )
}

export default Index
