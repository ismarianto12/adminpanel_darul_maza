// ** React Imports
import { useEffect, useState, useCallback } from 'react'
import Grid from '@mui/material/Grid'

// ** MUI Imports
import Box from '@mui/material/Box'
import { Card, Button } from '@mui/material'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { DataGrid } from '@mui/x-data-grid'
import axios from 'axios'
import CustomTextField from 'src/@core/components/mui/text-field'
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
// import CardStatsHorizontalWithedits from 'src/@core/components/card-statistics/card-stats-horizontal-with-edits'


import { getInitials } from 'src/@core/utils/get-initials'
import Icon from 'src/@core/components/icon'
import Link from 'next/link'
import Comheader from './Comheader'
import Headtitle from 'src/@core/components/Headtitle'
import toast from 'react-hot-toast'
import CardStatsVertical from 'src/@core/components/card-statistics/card-stats-vertical'
import { useForm, Controller } from 'react-hook-form'

import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'



const fetchDivisi = (setDivisi) => {
  axios.post(`${process.env.APP_API}divisi/list`).then((data) => {
    setDivisi(data.data)
  }).then((err) => {
    toast.error('data divisi tidak bisa di tampilkan')
  })
}

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
    axios.delete(`${process.env.APP_API}promo/${id}`, {
      headers: {
        Authorization: `Bearer :${localStorage.getItem('accessToken')}`
      }
    })
      .then(e => {
        toast.success('Data Kategory Berhasil di hapus')
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
          href={`/keuangan/tagihan/edit/${id}`}
          onClick={handleRowOptionsClose}
        >
          <Icon icon='tabler:eye' fontSize={20} />
          {`View`}
        </MenuItem>
        <MenuItem
          component={Link}
          onClick={handleRowOptionsClose}
          href={`/keuangan/tagihan/edit/${id}`}
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
  const [rows, setRows] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [sortColumn, setSortColumn] = useState('nama_siswa')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [divis, setDivisi] = useState([])
  const [datadivisi, setDatadivisi] = useState([])
  const [show, setShow] = useState(false)


  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 7 })
  function loadServerRows(currentPage, data) {
    return data.slice(currentPage * paginationModel.pageSize, (currentPage + 1) * paginationModel.pageSize)
  }
  const onDeleteSuccess = () => {
    fetchTableData();
  }

  const schema = yup.object().shape({
    title: yup.string().required(),
    seotitle: yup.string().required(),
    active: yup.string().required(),

  })

  const {
    reset,
    control,
    setValue,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      id_category: "",
      title: "",
      judul: "",
      content: "",
      isi: "",
      tags: "",  //editdata.tags === undefined ? [] : JSON.parse(JSON.stringify(editdata?.tags)),
      protect: "", //'Y',
      picture: "" //editdata?.picture,
    },
    mode: 'onChange',
    resolver: yupResolver(schema)
  })





  const onSubmit = async (data) => {
    const queryParams = {
      divisi: data.divisi
    }
    setSubmit(false)
    await axios
      .get(`${process.env.APP_API}karyawan/list`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        params: queryParams, // Pass the queryParams here
      })
      .then((res) => {
        setSubmit(true)
        console.log(res.data)
        setTotal(res.data.length);
        const filteredData = res.data.filter((datares) =>
          datares.nama?.toLowerCase().includes(searchValue) ||
          datares.email?.toLowerCase().includes(searchValue)
        )
        setRows(loadServerRows(paginationModel.page, filteredData))
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchTableData = useCallback(
    async (sort, q, column) => {
      await axios
        .get(`${process.env.APP_API}pembayaran/list`, {
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
    fetchDivisi(setDivisi)

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
      <Headtitle title="Tagihan Siswa" />


      {/* <Grid container spacing={2}>
        <Grid item xs={12} sm={3}>
          <CardStatsHorizontalWithedits
            stats={`${total}`}
            // trend='negative'
            title='Total Dibayar'
            avatarColor='info'
            icon='tabler:file-dollar'
            subtitle='Keseluruhan'
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <CardStatsHorizontalWithedits
            stats={`${total}`}
            // trend='negative'
            title='Total Dibayar'
            avatarColor='success'
            icon='tabler:file-dollar'
            subtitle='Periode Bulan Ini (November 2023)'
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <CardStatsHorizontalWithedits
            stats='19,860'
            // trend='negative'
            title='Total Tunggakan'
            avatarColor='success'
            icon='tabler:user-check'
          // subtitle='Last week analytics'
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <CardStatsHorizontalWithedits

            stats='19,860'
            // trend='negative'
            title='Total Tunggakan'
            avatarColor='success'
            icon='tabler:user-check'
          // subtitle='Last week analytics'
          />
        </Grid>
      </Grid> */}
      <br /><br />
      <Card>
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
                    <div className="col-sm-6 col-md-2 mb-3">
                      <label className="form-label">Kata Kunci</label>
                      <input type="text" name="keyword" id="keyword" className="form-control" placeholder="Masukan kata kunci pencarian" maxLength={64} />
                    </div>
                    <div className="col-sm-6 col-md-2 mb-3">
                      <label className="form-label">
                        Pilih Unit
                      </label>
                      <select name="unit" id="filter-unit" className="form-select">
                        <option value />
                        <option value="MU1iSCtrTSs4amFmQmlYcCtIampNQT09">
                          MA
                        </option>
                        <option value="bkIzcUI0UlNWcmp6NmQxUnBTTklJZz09">
                          MTS
                        </option>
                        <option value="ZzhhN3BLc3luWGRmNW1HZzVhdExPdz09">
                          PAUD AA
                        </option>
                      </select>
                    </div>
                    <div className="col-sm-6 col-md-2 mb-3">
                      <label className="form-label">
                        Pilih Kelas
                      </label>
                      <select name="class_name" id="class-name" className="form-select">
                        <option value />
                        <option value="10 - A">
                          10 - A
                        </option>
                        <option value="10 - B">
                          10 - B
                        </option>
                        <option value="11 - A">
                          11 - A
                        </option>
                        <option value="TES KELAS">
                          TES KELAS
                        </option>
                        <option value="7 - A">
                          7 - A
                        </option>
                        <option value="7 - B">
                          7 - B
                        </option>
                      </select>
                    </div>
                    <div className="col-sm-6 col-md-2 mb-4">
                      <label className="form-label">
                        Tahun Ajaran
                      </label>
                      <select name="class_year" id="class-year" className="form-select">
                        <option />
                        <option value="2022/2023">2022/2023</option>
                        <option value="2023/2024">2023/2024</option>
                      </select>
                    </div>
                    <div className="col-sm-6 col-md-2 mb-4">
                      <label className="form-label">
                        Status Siswa
                      </label>
                      <select name="status" id="status" className="form-select">
                        <option />
                        <option value="A" selected>Aktif</option>
                        <option value="L">Lulus</option>
                        <option value="K">Keluar</option>
                        <option value="D">Dihapus</option>
                        <option value="all">Semua</option>
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
      </Card>
      <br /><br />
      <Card>
        <CardHeader title={
          (<>
            <Icon fontSize='1.25rem' icon='tabler:list' />
            {`Tagihan Siswa`}
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
          columns={[
            { field: 'id', headerName: '#' },
            {
              field: 'tingkat', headerName: 'Nama Unit',
              renderCell: ({ row }) => {
                if (row.tingkat) {
                  return (<b>{row.tingkat}</b>)
                } else {
                  return 'Kosong'
                }
              }
            },
            { field: 'nis', headerName: 'Nomor Induk' },
            { field: 'nama', headerName: 'Nama Lengkap' },
            {
              field: 'kelas', headerName: 'Kelas Sekarang',
              renderCell: ({ row }) => {
                if (row.kelas) {
                  return (<b>{row.kelas}</b>)
                } else {
                  return 'Kosong'
                }
              }

            },
            {
              field: 'tahun_ajaran', headerName: 'Tahun Ajaran',
              renderCell: ({ row }) => {
                if (row.tahun_ajaran) {
                  return (<b>{row.tahun_ajaran}</b>)
                } else {
                  return 'Kosong'
                }
              }

            },
            { field: 'status', headerName: 'Status' },
            {
              field: 'total_tagihan', headerName: 'Total Tagihan', renderCell: ({ row }) => {
                if (row.total_tagihan) {
                  return (<b>{row.total_tagihan}</b>)
                } else {
                  return 'Kosong'
                }
              }
            },
            {
              field: 'total_dibayar', headerName: 'Total Dibayar',
              renderCell: ({ row }) => {
                if (row.total_dibayar) {
                  return (<b>{row.total_dibayar}</b>)
                } else {
                  return 'Kosong'
                }
              }
            },
            {
              field: 'total_tunggakan', headerName: 'Total Tunggakan',
              renderCell: ({ row }) => {
                if (row.total_tunggakan) {
                  return (<b>{row.total_tunggakan}</b>)
                } else {
                  return 'Kosong'
                }
              }
            },
            {
              flex: 0.1,
              minWidth: 100,
              sortable: false,
              // field: 'actions',
              headerName: 'Actions',
              renderCell: ({ row }) => <RowOptions id={row.id} setLoading={setLoading} />
            }
          ]}
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
