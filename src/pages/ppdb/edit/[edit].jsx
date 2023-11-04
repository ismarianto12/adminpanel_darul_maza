import { useState, useEffect } from 'react'

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

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Actions Imports
import { addUser } from 'src/store/apps/user'
import { Card, CardContent } from '@mui/material'
import Headtitle from 'src/@core/components/Headtitle'
import axios from 'axios'

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

const Index = props => {
  // ** Props
  const route = useRouter();
  const { open, toggle } = props
  const [ppdbdata, setppdbdata] = useState([])
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
    calledit()
  }, [])
  const calledit = () => {
    const config = {
      method: 'get',
      url: '/admin/api/ppdb/' + props.id,
      headers: {
        'Content-Type': 'application/json',
        'token': '123'
      },
    }
    axios(config)
      .then((res) => {
        console.log(res.data[0].id_ppdb, 's')
        setppdbdata(res.data[0])
        reset(res.data[0])
      })
      .catch((err) => {
        console.error(err);
      });
  }


  const onSubmit = data => {
    const config = {
      method: 'put',
      url: '/admin/api/ppdb/' + props.id,
      headers: {
        'Content-Type': 'application/json',
      },
      data: data
    }
    axios(config)
      .then((res) => {
        toast.success("Data ppdb berhasil di edit")
        route.push('/ppdb/list');
      })
      .catch((err) => {
        console.error(err);
      });
    reset()
  }
  const handleClose = () => {
    reset()
    route.push('/ppdb/list');
  }

  return (
    <>
      <Headtitle title="Tambah data PPDB" />
      <Card>
        <CardContent>
          <Header>
            <Typography variant='h5'>
              <Icon icon='tabler:edit' fontSize='1.125rem' />
              {`Data PPDB`}</Typography>
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
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='no_hp'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label="No HP"
                        onChange={onChange}
                        placeholder="Field Required"
                        error={Boolean(errors.no_hp)}
                        helperText={errors.no_hp?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='password'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label="Password"
                        onChange={onChange}
                        placeholder="Field Required"
                        error={Boolean(errors.password)}
                        helperText={errors.password?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='jk'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label="JK"
                        onChange={onChange}
                        placeholder="Field Required"
                        error={Boolean(errors.jk)}
                        helperText={errors.jk?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='ttl'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label="TTL"
                        onChange={onChange}
                        placeholder="Field Required"
                        error={Boolean(errors.ttl)}
                        helperText={errors.ttl?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='prov'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label="Prov"
                        onChange={onChange}
                        placeholder="Field Required"
                        error={Boolean(errors.prov)}
                        helperText={errors.prov?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='kab'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label="Kab"
                        onChange={onChange}
                        placeholder="Field Required"
                        error={Boolean(errors.kab)}
                        helperText={errors.kab?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='kec'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label="Kec"
                        onChange={onChange}
                        placeholder="Field Required"
                        error={Boolean(errors.kec)}
                        helperText={errors.kec?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='kel'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label="Kel"
                        onChange={onChange}
                        placeholder="Field Required"
                        error={Boolean(errors.kel)}
                        helperText={errors.kel?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='alamat'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label="Alamat"
                        onChange={onChange}
                        placeholder="Field Required"
                        error={Boolean(errors.alamat)}
                        helperText={errors.alamat?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='nama_ayah'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label="Nama Ayah"
                        onChange={onChange}
                        placeholder="Field Required"
                        error={Boolean(errors.nama_ayah)}
                        helperText={errors.nama_ayah?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='nama_ibu'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label="Nama Ibu"
                        onChange={onChange}
                        placeholder="Field Required"
                        error={Boolean(errors.nama_ibu)}
                        helperText={errors.nama_ibu?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='pek_ayah'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label="Pek Ayah"
                        onChange={onChange}
                        placeholder="Field Required"
                        error={Boolean(errors.pek_ayah)}
                        helperText={errors.pek_ayah?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='pek_ibu'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label="Pek Ibu"
                        onChange={onChange}
                        placeholder="Field Required"
                        error={Boolean(errors.pek_ibu)}
                        helperText={errors.pek_ibu?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='nama_wali'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label="Nama Wali"
                        onChange={onChange}
                        placeholder="Field Required"
                        error={Boolean(errors.nama_wali)}
                        helperText={errors.nama_wali?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='pek_wali'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label="Pek Wali"
                        onChange={onChange}
                        placeholder="Field Required"
                        error={Boolean(errors.pek_wali)}
                        helperText={errors.pek_wali?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='peng_ortu'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label="Peng Ortu"
                        onChange={onChange}
                        placeholder="Field Required"
                        error={Boolean(errors.peng_ortu)}
                        helperText={errors.peng_ortu?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='no_telp'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label="No Telp"
                        onChange={onChange}
                        placeholder="Field Required"
                        error={Boolean(errors.no_telp)}
                        helperText={errors.no_telp?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='thn_msk'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label="Thn Msk"
                        onChange={onChange}
                        placeholder="Field Required"
                        error={Boolean(errors.thn_msk)}
                        helperText={errors.thn_msk?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='sekolah_asal'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label="Sekolah Asal"
                        onChange={onChange}
                        placeholder="Field Required"
                        error={Boolean(errors.sekolah_asal)}
                        helperText={errors.sekolah_asal?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='thn_lls'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label="Thn Lls"
                        onChange={onChange}
                        placeholder="Field Required"
                        error={Boolean(errors.thn_lls)}
                        helperText={errors.thn_lls?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='kelas'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label="Kelas"
                        onChange={onChange}
                        placeholder="Field Required"
                        error={Boolean(errors.kelas)}
                        helperText={errors.kelas?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='id_pend'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label="ID PEND"
                        onChange={onChange}
                        placeholder="Field Required"
                        error={Boolean(errors.id_pend)}
                        helperText={errors.id_pend?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <br /><br /><br />
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button type='submit' variant='contained' sx={{
                  mr: 3,
                  width: '50%'

                }}>
                  Save
                </Button>
                <Button variant='tonal' color='secondary' sx={{
                  width: '50%'
                }} onClick={handleClose}>
                  Cancel
                </Button>
              </Box>

            </form>
          </Box>
        </CardContent>
      </Card>
    </>
  )
}



export async function getServerSideProps(context) {
  const id = context.query.edit;
  return {
    props: {
      id
    },
  };
}


export default Index
