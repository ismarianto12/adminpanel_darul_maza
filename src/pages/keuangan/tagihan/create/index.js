// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useRouter } from 'next/router'
// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'
import InputAdornment from '@mui/material/InputAdornment'
// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Actions Imports
import { addUser } from 'src/store/apps/user'
import { Card, CardContent } from '@mui/material'
import axios from 'axios'
import Headtitle from 'src/@core/components/Headtitle'

const showErrors = (field, valueLen, min) => {
  if (valueLen === null) {
    return `${field} field is required`
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`
  } else {
    return ''
  }
}

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))
const schema = yup.object().shape({
  title: yup.string().required(),
  seotitle: yup.string().required(),
  active: yup.string().required(),

})
const defaultValues = {
  title: '',
  seotitle: '',
  active: '',
}
const Index = props => {
  // ** Props
  const route = useRouter();
  const { open, toggle } = props

  const dispatch = useDispatch()
  const store = useSelector(state => state.user)
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

  const onSubmit = data => {
    const config = {
      method: 'post',
      url: `${process.env.APP_API}/tagihan/terbit`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
      data: data
    }
    axios(config)
      .then((res) => {
        route.push('/category/list');
      })
      .catch((err) => {
        console.error(err);
      });
    reset()
  }
  const handleClose = () => {
    reset()
    route.push('/category/list');
  }


  return (
    <>
      <Headtitle title={`Tambah halaman`} />
      <Card>
        <CardContent>
          <Header>
            <Typography variant='h5'>
              <Icon icon='tabler:edit' />
              Terbitkan tagihan </Typography>
            <IconButton
              size='small'
              onClick={handleClose}
              sx={{
                p: '.438rem',
                borderRadius: 1,
                color: 'text.primary',
                backgroundColor: 'action.selected',
                '&:hover': {
                  backgroundColor: theme => `rgba(${theme.palette.customColors.main}, .16)`
                }
              }}
            >
              <Icon icon='tabler:x' fontSize='1.125rem' />
            </IconButton>
          </Header>
          <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
            <form onSubmit={handleSubmit(onSubmit)}>

              <div className="row">
                <div className="col-sm-12 col-md-6">
                  <form id="form" action="javascript:void()">
                    <div className="mb-4">
                      <label className="form-label required">
                        Pilih Unit
                      </label>
                      <select name="unit" id="unit" className="form-select tomselected ts-hidden-accessible" tabIndex={-1}>
                        <option value />
                        <option value="MU1iSCtrTSs4amFmQmlYcCtIampNQT9">
                          MA
                        </option>
                        <option value="bkIzcUIUlNWcmp6NmQxUnBTTklJZz9">
                          MTS
                        </option>
                      </select>
                      <p id="unit-feedback" className="mt-2" style={{ display: 'none' }} />
                    </div>
                    <div id="select-classroom" className="mb-4" style={{ display: 'none' }}>
                      <label className="form-label">
                        Daftar Kelas
                      </label>
                      <label className="form-check form-switch">
                        <input type="checkbox" id="input-select-classroom" className="form-check-input" />
                        <span className="form-check-label">Memilih</span>
                      </label>
                      <small className="form-hint">
                        Memilih daftar kelas untuk menambahkan tagihan terhadap kelas yang dipilih
                      </small>
                      <div id="table-select-classroom" className="mt-3 p-2" style={{ border: '1px solid #d9dbde', borderRadius: 4, display: 'none' }}>
                        <table className="table table-sm table-hover">
                          <thead>
                            <tr>
                              <th className="col-1 text-center">
                                <input type="checkbox" id="classroom-checks" className="form-check-input" />
                              </th>
                              <th className="col-1 text-center">#</th>
                              <th className="col-2">
                                Nama Unit
                              </th>
                              <th className="col-2">
                                Kode Kelas
                              </th>
                              <th className="col-2">
                                Nama Kelas
                              </th>
                              <th className="col-2">
                                Tahun Ajaran
                              </th>
                              <th className="col-1">
                                Jml. Siswa
                              </th>
                              <th className="col-1">
                                Status
                              </th>
                            </tr>
                          </thead>
                        </table>
                        <div className="table-responsive" style={{ maxHeight: 3 }}>
                          <table className="table table-sm table-hover">
                            <tbody id="classroom-list">
                              <tr>
                                <td colSpan={6} />
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    <div id="select-student" className="mb-4" style={{ display: 'none' }}>
                      <label className="form-label">
                        Daftar Siswa
                      </label>
                      <label className="form-check form-switch">
                        <input type="checkbox" id="input-select-student" className="form-check-input" />
                        <span className="form-check-label">Memilih</span>
                      </label>
                      <small className="form-hint">
                        Memilih daftar siswa untuk menambahkan tagihan terhadap siswa dari kelas yang dipilih
                      </small>
                      <div id="table-select-student" className="mt-3 p-2" style={{ border: '1px solid #d9dbde', borderRadius: 4, display: 'none' }}>
                        <table className="table table-sm table-hover">
                          <thead>
                            <tr>
                              <th className="col-1 text-center">
                                <input type="checkbox" id="student-checks" className="form-check-input" />
                              </th>
                              <th className="col-1 text-center">#</th>
                              <th className="col-2">
                                Nama Kelas
                              </th>
                              <th className="col-2">
                                Nomor Induk
                              </th>
                              <th className="col-5">
                                Nama Lengkap
                              </th>
                              <th className="col-1">
                                Status
                              </th>
                            </tr>
                          </thead>
                        </table>
                        <div className="table-responsive" style={{ maxHeight: 3 }}>
                          <table className="table table-sm table-hover">
                            <tbody id="student-list">
                              <tr>
                                <td colSpan={7} />
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="form-label required">
                        Jangka Waktu Penagihan
                      </label>
                      <select name="bill_time" id="bill-time" className="form-select">
                        <option value />
                        <optgroup label="Bulanan">
                          <option value={1}>1 Bulan</option>
                          <option value={2}>2 Bulan</option>
                          <option value={3}>3 Bulan</option>
                          <option value={4}>4 Bulan</option>
                          <option value={5}>5 Bulan</option>
                          <option value={6}>6 Bulan</option>
                          <option value={7}>7 Bulan</option>
                          <option value={8}>8 Bulan</option>
                          <option value={9}>9 Bulan</option>
                          <option value={1}>1 Bulan</option>
                          <option value={11}>11 Bulan</option>
                        </optgroup>
                        <optgroup label="Tahunan">
                          <option value={12}>1 Tahun</option>
                          <option value={24}>2 Tahun</option>
                          <option value={36}>3 Tahun</option>
                          <option value={48}>4 Tahun</option>
                        </optgroup>
                      </select>
                      <p id="bill-time-feedback" className="mt-2" style={{ display: 'none' }} />
                    </div>
                    <div className="mb-4">
                      <div className="row g-2">
                        <label className="form-label required">
                          Bulan dan Tahun Mulai
                        </label>
                        <div className="col-6">
                          <select name="bill_month" id="bill-month" className="form-select">
                            <option value />
                            <option value={1}>Januari</option>
                            <option value={2}>Februari</option>
                            <option value={3}>Maret</option>
                            <option value={4}>April</option>
                            <option value={5}>Mei</option>
                            <option value={6}>Juni</option>
                            <option value={7}>Juli</option>
                            <option value={8}>Agustus</option>
                            <option value={9}>September</option>
                            <option value={10}>Oktober</option>
                            <option value={11}>November</option>
                            <option value={12}>Desember</option>
                          </select>
                          <p id="bill-month-feedback" className="mt-2" style={{ display: 'none' }} />
                        </div>
                        <div className="col-6">
                          <input type="text" name="bill_year" id="bill-year" className="form-control" data-mask={''} data-mask-visible="true" placeholder={'Masukan tahun'} autoComplete="off" />
                          <p id="bill-year-feedback" className="mt-2" style={{ display: 'none' }} />
                        </div>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="form-label  required ">
                        Item Tagihan 1
                      </label>
                      <select name="bill_category_1" id="bill-category-1" className="form-select tomselected ts-hidden-accessible" tabIndex={-1}>
                        <option value />
                        <option value="dlRBSjdrSTBwUU8wWUNqL3RYMlBkMjlhYJwUDRLWTY5bC9sTHRzcVBObVZ5MlBjOUZvVlZTdFhwWVM4WHRCVQ==">
                          Buku Paket MA -- Rp 2,
                        </option>
                        <option value="OUppYzFJcUVsWmV4b3VTWUhEeEo4UnJ2V1drZW5YZGVicXY4Z21nbk1tTmZoSTNneHVwdm1obW5QNXhHYVJsOA==">
                          Buku Paket MTS -- Rp 18,
                        </option>
                        <option value="R2dWDQ3TGROQjhxbjR3UVR5Q3FPdmNKRFJHMWcvaHhOb1ZxZmZCcG1meGN4YUFheGxaMlhczkL1hkZTB4Zw==">
                          Infaq Bangunan -- Rp 35,
                        </option>
                        <option value="SFNIbk5lNTBwWjRkNt1aHlERXl2bXRocVljYzdmNVFicUE4azFtSUc1YmFmVXlpNmlTcXZISHVVUjNvWWhmLw==">
                          IURAN JALAN JALAN -- Rp 5,
                        </option>
                        <option value="T2FXNTJYNVlDLzZQchIQUdFaWlMY29qeGRVQmFDSUpBODFYR1RBVUNCZz=">
                          SPP -- Rp 25,
                        </option>
                        <option value="eEo5VVhkallQbFdNRDBmMmdOYXNkKys1NzJOeEtYdXJSQ3h6TkFUQRpaz=">
                          SPP MA -- Rp 35,
                        </option>
                        <option value="VURyUkkySEU4bDl1WDVjSU55N1ptOGYwaGVPemozUVVSaVl2TnlScmhFUT=">
                          SPP MTS -- Rp 275,
                        </option>
                        <option value="NG1nTit3YnYrWmhQVDYwbXgrS2NyUzNIVmRkcWRlQmRreEFRZDFKR21rSi8yelBRcmo1TU1WS1JUbTVwaEFNQg==">
                          UAS-GANJIL -- Rp 2,
                        </option>
                        <option value="Wmx4QnhEdURqM2dCZmtJWkpQZlCbmlldUkrb2xcUZFRjhPTjhGR9OQ3Z6bys3WUpiMnZWb1l5Y3RnNlA2Tg==">
                          UAS-GENAP -- Rp 25,
                        </option>
                      </select>

                      <p id="bill-category-1-feedback" className="mt-2" style={{ display: 'none' }} />
                    </div>
                    <div className="mb-4">
                      <label className="form-label ">
                        Item Tagihan 2
                      </label>
                      <select name="bill_category_2" id="bill-category-2" className="form-select tomselected ts-hidden-accessible" tabIndex={-1}>
                        <option value />
                        <option value="dlRBSjdrSTBwUU8wWUNqL3RYMlBkMjlhYJwUDRLWTY5bC9sTHRzcVBObVZ5MlBjOUZvVlZTdFhwWVM4WHRCVQ==">
                          Buku Paket MA -- Rp 2,
                        </option>
                        <option value="OUppYzFJcUVsWmV4b3VTWUhEeEo4UnJ2V1drZW5YZGVicXY4Z21nbk1tTmZoSTNneHVwdm1obW5QNXhHYVJsOA==">
                          Buku Paket MTS -- Rp 18,
                        </option>
                        <option value="R2dWDQ3TGROQjhxbjR3UVR5Q3FPdmNKRFJHMWcvaHhOb1ZxZmZCcG1meGN4YUFheGxaMlhczkL1hkZTB4Zw==">
                          Infaq Bangunan -- Rp 35,
                        </option>
                        <option value="SFNIbk5lNTBwWjRkNt1aHlERXl2bXRocVljYzdmNVFicUE4azFtSUc1YmFmVXlpNmlTcXZISHVVUjNvWWhmLw==">
                          IURAN JALAN JALAN -- Rp 5,
                        </option>
                        <option value="T2FXNTJYNVlDLzZQchIQUdFaWlMY29qeGRVQmFDSUpBODFYR1RBVUNCZz=">
                          SPP -- Rp 25,
                        </option>
                        <option value="eEo5VVhkallQbFdNRDBmMmdOYXNkKys1NzJOeEtYdXJSQ3h6TkFUQRpaz=">
                          SPP MA -- Rp 35,
                        </option>
                        <option value="VURyUkkySEU4bDl1WDVjSU55N1ptOGYwaGVPemozUVVSaVl2TnlScmhFUT=">
                          SPP MTS -- Rp 275,
                        </option>
                        <option value="NG1nTit3YnYrWmhQVDYwbXgrS2NyUzNIVmRkcWRlQmRreEFRZDFKR21rSi8yelBRcmo1TU1WS1JUbTVwaEFNQg==">
                          UAS-GANJIL -- Rp 2,
                        </option>
                        <option value="Wmx4QnhEdURqM2dCZmtJWkpQZlCbmlldUkrb2xcUZFRjhPTjhGR9OQ3Z6bys3WUpiMnZWb1l5Y3RnNlA2Tg==">
                          UAS-GENAP -- Rp 25,
                        </option>
                      </select>
                    </div>
                    <div className="d-grid mb-3">
                      <button type="submit" id="btn-submit" className="btn btn-primary btn-block">
                        <svg xmlns="http://www.w3.org/2/svg" id="btn-svg" className="icon icon-tabler icon-tabler-circle-check" width={24} height={24} viewBox="  24 24" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path stroke="none" d="M h24v24Hz" fill="none" />
                          <circle cx={12} cy={12} r={9} />
                          <path d="M9 12l2 2l4 -4" />
                        </svg>
                        <span id="btn-icon" />
                        <span id="btn-text">Proses Tambah Tagihan</span>
                      </button>
                    </div>
                  </form>
                </div>
                <div className="col-sm-12 col-md-6">
                  <img src="https://png.pngtree.com/png-vector/20200312/ourmid/pngtree-modern-flat-design-concept-of-ui-ux-design-with-characters-and-png-image_2157890.jpg" className='img-reponsive' />

                </div>
              </div>
            </form>
          </Box>
        </CardContent>
      </Card >
    </>
  )
}

export default Index
