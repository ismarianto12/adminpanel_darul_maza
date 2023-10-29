import { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import CustomTextField from 'src/@core/components/mui/text-field'
import InputAdornment from '@mui/material/InputAdornment'
import CardHeader from '@mui/material/CardHeader'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import { Table, TableBody, TableCell, TableRow } from '@mui/material';

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Actions Imports
import { addUser } from 'src/store/apps/user'
import { Card, CardContent } from '@mui/material'
import Headtitle from 'src/@core/components/Headtitle'
import axios from 'axios'
import Swal from 'sweetalert2'
import { prosesPpdb } from 'src/@core/utils/encp'

const showErrors = (field, valueLen, min) => {
  if (valueLen === 0) {
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
  id_provinsi: yup.string().required(),
  nama_ppdb: yup.string().required(),
  alamat1: yup.string().required(),
  alamat2: yup.string().required(),
  no_telp: yup.string().required(),
  email: yup.string().required(),
  latitude: yup.string().required(),
  longitude: yup.string().required(),
  tipe: yup.string().required(),
})


const parsingStatus = [
  { 'Y': 'Approve' },
  { 'N': 'Reject' }
]

const getParsing = parsingStatus.map(obj => {
  const key = Object.keys(obj)[0]; // Mengambil kunci (key) dari objek
  const value = obj[key]; // Mengambil nilai (value) dari objek

  return { key, value }; // Membentuk objek baru dengan kunci dan nilai
});


const Index = props => {
  // ** Props
  const route = useRouter();
  const { open, toggle } = props
  const [ppdbdata, setPpdbdata] = useState([])
  // ** State
  const [plan, setPlan] = useState('basic')
  const [role, setRole] = useState('subscriber')

  // ** Hooks
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
    defaultValues: {
      id_provinsi: ppdbdata.id_provinsi,
      nama_ppdb: ppdbdata.nama_ppdb,
      alamat1: ppdbdata?.alamat1,
      alamat2: ppdbdata?.alamat2,
      no_telp: ppdbdata?.no_telp,
      email: ppdbdata?.email,
      latitude: ppdbdata?.latitude,
      longitude: ppdbdata?.longitude,
      tipe: ppdbdata?.tipe
    },
    mode: 'onChange',
    resolver: yupResolver(schema)
  })
  useEffect(() => {
    const calledit = async () => {
      const config = {
        method: 'POST',
        url: `${process.env.APP_API}ppdb/siswadetail/` + props.id,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        },
      }
      await axios(config)
        .then((res) => {
          console.log(res.data, 'detail data response')
          setPpdbdata(res.data)
        })
        .catch((err) => {
          // toast.message("error can't " + err)
          console.error(err);
        });
    }
    calledit()
  }, [])

  const konfirmasi = (e) => {
    const status = e.target.value;
    const idpdb = props.id
    const parsingdata = status === 'N' ? 'Reject' : 'Proses Terima'
    Swal.fire({
      html: 'Status PPDB Akan di proses :' + parsingdata,
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Lanjutkan',
      denyButtonText: `Batal`,
    }).then((result) => {
      if (result.isConfirmed) {
        prosesPpdb({
          status,
          idpdb,
          route
        })
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })
  }

  const handleClose = () => {
    reset()
    route.push('/ppdb/list');
  }

  console.log(ppdbdata, 'detail')
  return (
    <>
      <Headtitle title="Konfirmasi Pendaftaran"
        style={{
          'fontSize': '15px',
          'fontWeight': 'bold'
        }}
      />
      <Card>
        <CardContent>
          <Header>
            <Typography variant='h5'>
              <Icon icon='tabler:check' fontSize='1.125rem' />
              {`Konfirmasi Pendaftaran`}</Typography>
            <IconButton
              size='small'
              onClick={handleClose}
              sx={{
                p: '0.438rem',
                borderRadius: 1,
                color: 'text.primary',
                backgroundColor: 'action.selected',
                '&:hover': {
                  backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.16)`
                }
              }}
            >
              <Icon icon='tabler:x' fontSize='1.125rem' />
            </IconButton>
          </Header>
          <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
            <table style={{ width: '100%' }}>
              <tbody>
                <tr>
                  <td className="header" style={{ textAlign: 'center' }}>
                    <img
                      className="logo"
                      src="https://darulmaza.sch.id/wp-content/uploads/2019/08/Header-SIT-512-1030x258.png"
                      alt="Logo Surat"
                      style={{ width: '200px', height: 'auto', marginBottom: '20px' }}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="alamat" style={{ textAlign: 'center' }}>
                    <b> Jl. Gapin, Jatisari, Jatiasih, Kota Bekasi, Jawa Barat 17426</b>
                  </td>
                </tr>
              </tbody>
            </table>
            <hr />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} style={{
                'marginLeft': '-14px'
              }}
              >
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell
                        style={{
                          verticalAlign: 'top',
                        }}
                      >
                        <TableRow>
                          <TableCell>Kelas:</TableCell>
                          <TableCell>:</TableCell>
                          <TableCell>{ppdbdata.id_kelas}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Img Siswa:</TableCell>
                          <TableCell>:</TableCell>
                          <TableCell>/Applications/XAMPP/xamppfiles/temp/phpritjcl</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Img KK:</TableCell>
                          <TableCell>:</TableCell>
                          <TableCell>/Applications/XAMPP/xamppfiles/temp/phppPHyzI</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>No Pendaftaran:</TableCell>
                          <TableCell>:</TableCell>
                          <TableCell>{ppdbdata.no_daftar}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>NIK:</TableCell>
                          <TableCell>:</TableCell>
                          <TableCell>{ppdbdata.nik}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>NIS:</TableCell>
                          <TableCell>:</TableCell>
                          <TableCell>{ppdbdata.nis}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Nama:</TableCell>
                          <TableCell>:</TableCell>
                          <TableCell>{ppdbdata.nama}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Email:</TableCell>
                          <TableCell>:</TableCell>
                          <TableCell>{ppdbdata.email}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>No HP:</TableCell>
                          <TableCell>:</TableCell>
                          <TableCell>{ppdbdata.no_hp}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Jenis Kelamin:</TableCell>
                          <TableCell>:</TableCell>
                          <TableCell>{ppdbdata.jk === 'P' ? 'Perempuan' : 'Laki - laki'}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>TTL:</TableCell>
                          <TableCell>:</TableCell>
                          <TableCell>{ppdbdata.ttl}</TableCell>
                        </TableRow>
                      </TableCell>

                    </TableRow>
                  </TableBody>
                </Table>
              </Grid>
              <Grid item xs={12} sm={6} style={{
                'marginLeft': '-14px'
              }}>
                <Table>
                  <TableBody>
                    <TableRow>

                      <TableCell>
                        <TableRow>
                          <TableCell>Provinsi:</TableCell>
                          <TableCell>:</TableCell>
                          <TableCell>15</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Kabupaten:</TableCell>
                          <TableCell>:</TableCell>
                          <TableCell>1502</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Kecamatan:</TableCell>
                          <TableCell>:</TableCell>
                          <TableCell>1502021</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Kelurahan:</TableCell>
                          <TableCell>:</TableCell>
                          <TableCell>1502021005</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Alamat:</TableCell>
                          <TableCell>:</TableCell>
                          <TableCell>{ppdbdata.alamat}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Nama Ayah:</TableCell>
                          <TableCell>:</TableCell>
                          <TableCell>{ppdbdata.nama_ayah}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Nama Ibu:</TableCell>
                          <TableCell>:</TableCell>
                          <TableCell>{ppdbdata.nama_ibu}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Pekerjaan Ayah:</TableCell>
                          <TableCell>:</TableCell>
                          <TableCell>{ppdbdata.pek_ayah}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Pekerjaan Ibu:</TableCell>
                          <TableCell>:</TableCell>
                          <TableCell>{ppdbdata.pek_ibu}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Nama Wali:</TableCell>
                          <TableCell>:</TableCell>
                          <TableCell>{ppdbdata.pek_ayah}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Pekerjaan Wali:</TableCell>
                          <TableCell>:</TableCell>
                          <TableCell>{ppdbdata.pek_wali}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Penghasilan Orang Tua:</TableCell>
                          <TableCell>:</TableCell>
                          <TableCell>{ppdbdata.peng_ortu}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>No Telp:</TableCell>
                          <TableCell>:</TableCell>
                          <TableCell>{ppdbdata.no_telp}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Tahun Masuk:</TableCell>
                          <TableCell>:</TableCell>
                          <TableCell>2</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Sekolah Asal:</TableCell>
                          <TableCell>:</TableCell>
                          <TableCell>13123</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Tahun Lulus:</TableCell>
                          <TableCell>:</TableCell>
                          <TableCell>21313</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Kelas:</TableCell>
                          <TableCell>:</TableCell>
                          <TableCell>Blum Set</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>ID Pendidikan:</TableCell>
                          <TableCell>:</TableCell>
                          <TableCell>1</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>ID Majors:</TableCell>
                          <TableCell>:</TableCell>
                          <TableCell>1</TableCell>
                        </TableRow>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

              </Grid>
            </Grid>
            <h4>Bukti bayar</h4>
            <img
              src={`${process.env.ASSETS_API}/konfirmasi/${ppdbdata?.bukti_bayar}`}
              className='img-responsive'
            // onError={(e) => {
            //   e.target.src = 'https://jia.stialanbandung.ac.id/plugins/themes/pajardevr/image/no-image-available.jpg';
            // }}
            />

            <Grid container spacing={5}>
              <Grid item xs={12} sm={5}>
                <CustomTextField select fullWidth label='Status Konfirmasi :' id='form-layouts-tabs-select'
                  onChange={(e) => konfirmasi(e)}
                  error={Boolean(errors.protect)}
                  placeholder='Pilih Status Approval :'
                  {...(errors.protect && { helperText: errors.protect.message })}
                >
                  <MenuItem key={``} value={``}>
                    {`Pilih Status Approval`}
                  </MenuItem>
                  <MenuItem key={`Y`} value={`Y`}>
                    {`Approve`}
                  </MenuItem>
                  <MenuItem key={`N`} value={`N`}>
                    {`Reject`}
                  </MenuItem>
                </CustomTextField>

              </Grid>
              <Grid item xs={12} sm={5}>
                <Button variant='contained'
                  sx={{
                    width: '100%',
                    mt: 5,
                  }}
                  onClick={() =>
                    route.push(`/ppdb/edit/${props.id}`)
                  }
                >
                  <Icon fontSize='1.125rem' icon='tabler:edit' />
                  Edit
                </Button>
              </Grid>
            </Grid>
          </Box >
        </CardContent >
      </Card >
    </>
  )
}



export async function getServerSideProps(context) {
  const id = context.query.confirm;
  return {
    props: {
      id
    },
  };
}


export default Index
