import { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useRouter } from 'next/router'
import CustomTextField from 'src/@core/components/mui/text-field'
import InputAdornment from '@mui/material/InputAdornment'
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
import getAlbum from 'src/@core/utils/getcategory'
import axios from 'axios'
import toast from 'react-hot-toast'
import Editordata from 'src/@core/components/Editordata'
import Swal from 'sweetalert2'

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
  // deskripsiId: yup.string().required(),
  // deskripsiEn: yup.string().required(),
  // title: yup.string().required(),
  // id_album: yup.string().required(),
  // gambar: yup.string().required(),
})

const defaultValues = {
  deskripsiId: '',
  deskripsiEn: '',
  title: '',
  id_album: "",
  gambar: '',
}
const Index = props => {
  const route = useRouter();
  const { open, toggle } = props
  const [album, setAlbum] = useState([]);
  const [fileupload, setFileupload] = useState('')
  const [file, setFile] = useState('')
  const [deskripsiEn, setDeskripsiEn] = useState('')
  const [deskripsiId, setDeskripsiId] = useState('')

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
  useEffect(() => {
    const call = async () => {
      await getAlbum({ album, setAlbum })
    }
    call();
  }, [])
  const onSubmit = async (data) => {
    try {

      const formData = new FormData();
      const user_id = getUserlogin('id')
      const level = getUserlogin('role')

      formData.append('title', data.title);
      formData.append('deskripsiId', deskripsiId);
      formData.append('deskripsiEn', deskripsiEn);
      formData.append('id_album', data.id_album);
      formData.append('user_id', user_id);
      formData.append('level', level);

      if (data.gambar[0]) {
        formData.append('gambar', fileupload);
      }
      await axios.post(`${process.env.APP_API}galery/insert`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }).then(() => {
        Swal.fire('succes', 'data berhasil disimpan', 'success');
        route.push('/galery/list')
      })
    } catch (error) {
      if (error.response) {
        Swal.fire('error', error.message, 'error');
        console.error('Server responded with:', error.response.status);
        console.error('Response data:', error.response.data);
      } else if (error.request) {
        console.error('No response received');
      } else {
        console.error('Error:', error.message);
      }
    }
  }
  const uploadFile = (e) => {
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'bmp'];
    const fileExtension = e.target.files[0]?.name.split('.').pop().toLowerCase();
    if (allowedExtensions.includes(fileExtension)) {
      setFile(URL.createObjectURL(e.target.files[0]));
      setFileupload(e.target.files[0])
    } else {
      toast.error("Erro silahkan koreksi , File yang di izinkan adalah png jpg dan bmp")
    }
  }
  const handleClose = () => {
    route.push('/galery/list');
  }

  return (
    <>
      <Headtitle title={'List galery'} />
      <Card>
        <CardContent>
          <Header>
            <Typography variant='h5'>

              <Icon icon='tabler:edit' />
              Tambah Galery</Typography>
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
              <Controller
                name='title'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    sx={{ mb: 4 }}
                    label='Judul Galery'
                    onChange={onChange}
                    placeholder='Judul Galery'
                    error={Boolean(errors.title)}
                    {...(errors.title && { helperText: errors.title.message })}
                  />
                )}
              />
              <br /><br /><br />

              <Controller
                name='deskripsiId'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <>
                    <span style={{ 'fontWeight': 'bold' }}>Deskripsi (Bahasa Indonesia)</span>
                    <Editordata content={deskripsiId} setContent={setDeskripsiId} />
                  </>
                )}
              />
              <br /><br />
              <Controller
                name='deskripsiEn'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <>
                    <span style={{ 'fontWeight': 'bold' }}>Deskripsi (Bahasa Indonesia)</span>
                    <Editordata content={deskripsiEn} setContent={setDeskripsiEn} />
                  </>

                )}
              />
              <br /><br />

              <Controller
                name='id_album'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField select fullWidth label='Pilih Album :' id='form-layouts-tabs-select'
                    value={value}
                    onChange={onChange}
                    error={Boolean(errors.id_album)}
                    placeholder='Album'
                    {...(errors.id_album && { helperText: errors.id_album.message })}
                  >
                    {album.map((albums) => (
                      <MenuItem key={albums.id} value={albums.title}>
                        {albums.title}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
              <br /><br />
              <Controller
                name='gambar'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    type='file'
                    label='Gambar'
                    value={value}
                    sx={{ mb: 4 }}
                    onChange={(e) => {
                      onChange(e)
                      uploadFile(e)
                    }}
                    error={Boolean(errors.gambar)}
                    placeholder='Gambar'
                    {...(errors.gambar && { helperText: errors.gambar.message })}
                  />
                )}
              />
              <br /><br />

              <img src={file} style={{
                'width': '50%'
              }} />

              <br /> <br />
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button type='submit' variant='contained' sx={{ mr: 3, 'width': '50%' }}>
                  Save
                </Button>
                <Button variant='tonal' color='secondary' onClick={handleClose} sx={{ mr: 3, 'width': '50%' }}>
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

export default Index
