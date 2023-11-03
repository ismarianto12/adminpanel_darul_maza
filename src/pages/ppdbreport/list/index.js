// ** React Imports
import { useEffect, useState, useCallback } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CustomTextField from 'src/@core/components/mui/text-field'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { DataGrid } from '@mui/x-data-grid'
import axios from 'axios'
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import Grid from '@mui/material/Grid'
import { getInitials } from 'src/@core/utils/get-initials'
import Icon from 'src/@core/components/icon'
import Link from 'next/link'
import Comheader from './Comheader'
import Headtitle from 'src/@core/components/Headtitle'
import toast from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'
import { getparamPend } from 'src/@core/utils/encp'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
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





const Kelas = () => {
  const [total, setTotal] = useState(0)
  const [sort, setSort] = useState('asc')
  const [rows, setRows] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [sortColumn, setSortColumn] = useState('title')

  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 7 })
  function loadServerRows(currentPage, data) {
    return data.slice(currentPage * paginationModel.pageSize, (currentPage + 1) * paginationModel.pageSize)
  }

  const onDeleteSuccess = () => {
    fetchTableData();
  }


  const schema = yup.object().shape({
    nama_biaya: yup.string().required(),
    nominal: yup.string().required(),
    // description: yup.string().required(),
    // tingkat: yup.string().required()
  })
  const defaultValues = {

  }

  const {
    reset,
    control,
    setValue,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const fetchTableData = useCallback(
    async (sort, q, column) => {
      await axios
        .get(`${process.env.APP_API}report/detail`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }, {
          params: {
            q,
            sort,
            column
          }
        })
        .then(res => {
          setTotal(res.data.length)
          const filteredData = res.data.filter(galery => (
            galery.kelas?.toLowerCase().includes(search) || galery.tingkat?.toLowerCase().includes(search)
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
  const RowOptions = ({ id, setLoading }) => {
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
      axios.delete(`${process.env.APP_API}ppdb/destroy/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        }

      })
        .then(succes => {
          // onDeleteSuccess()
          // fetchTableData()
          fetchTableData(sort, searchValue, sortColumn)
          setLoading(true)
          toast.success('Berhasil hapus data')
        }).catch(() => {
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
            href={`/ppdb/edit/${id}`}
            onClick={handleRowOptionsClose}
          >
            <Icon icon='tabler:eye' fontSize={20} />
            {`View`}
          </MenuItem>
          <MenuItem
            component={Link}
            sx={{ '& svg': { mr: 2 } }}
            href={`/ppdb/edit/${id}`}
            onClick={handleRowOptionsClose}
          >
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
    <Card>
      <div style={{ 'display': 'inline' }}>
        <Headtitle title="Master Keuangan" />
        <CardHeader title={
          (<>
            <Grid container alignItems="center" spacing={1}>
              <Grid item>
                <Icon fontSize='3.25rem' icon='tabler:list' />

              </Grid>
              <Grid item>
                <Typography variant="h6">:::Report PPDB:::</Typography>
              </Grid>
            </Grid>

          </>)
        }
          style={{ display: 'inline' }}
        />
      </div>



      <Grid container spacing={2} xs={8}>
        <Grid item xs={12} sm={4} sx={{
          'marginLeft': '10px'
        }}>

          <Controller
            name='Dari'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                type="date"
                value={value}
                sx={{ mb: 4 }}
                label=''
                onChange={onChange}
                // placeholder=''
                error={Boolean(errors.nama_institusi)}
                {...(errors.nama_institusi && { helperText: errors.nama_institusi.message })}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Controller
            name='sampai'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                type="date"
                value={value}
                sx={{ mb: 4 }}
                label=''
                onChange={onChange}
                // placeholder='No Legalitas'
                error={Boolean(errors.no_legalitas)}
                {...(errors.no_legalitas && { helperText: errors.no_legalitas.message })}
              />
            )}
          />
        </Grid>

      </Grid>

      <DataGrid
        autoHeight
        pagination
        rows={rows}
        rowCount={total}
        columns={
          [
            {
              flex: 0.2,
              field: 'id',
              minWidth: 100,
              headerName: 'ID',
              renderCell: ({ row }) => (
                <Typography href={`/ppdb/edit/${row.id}`}>{`#${row.id}`}</Typography>
              )
            },
            {
              flex: 0.25,
              minWidth: 290,
              field: 'nama_biaya',
              headerName: 'Nama Biaya'
            },
            {
              flex: 0.25,
              minWidth: 290,
              field: 'nominal',
              headerName: 'Nominal'
            },
            {
              flex: 0.25,
              minWidth: 290,
              field: 'tingkat',
              headerName: 'Tingkat',
              renderCell: ({ row }) => {
                return getparamPend(row.tingkat)
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
    </Card >
  )
}

export default Kelas
