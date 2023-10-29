// ** React Imports
import { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
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
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import { useDispatch, useSelector } from 'react-redux'

import { addUser } from 'src/store/apps/user'
import { Card, CardContent } from '@mui/material'
import Headtitle from 'src/@core/components/Headtitle'
import getAlbum from 'src/@core/utils/getcategory'
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
  deskripsiId: yup.string().required(),
  deskripsiEn: yup.string().required(),
  title: yup.string().required(),
  id_album: yup.string().required(),
  gambar: yup.string().required(),
})



const Index = props => {
  const route = useRouter();
  const { open, toggle } = props
  const [plan, setPlan] = useState('basic')
  const [role, setRole] = useState('subscriber')
  const [album, setAlbum] = useState([]);
  const [fileupload, setFileupload] = useState('')
  const [file, setFile] = useState('')
  const dispatch = useDispatch()
  const store = useSelector(state => state.user)
  const [data, setData] = useState([]);


  const {
    reset,
    control,
    setValue,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: data?.title,
      deskripsiId: data?.deskripsiId,
      deskripsiEn: data?.deskripsiEn,
      id_album: data?.id_album,
      gambar: data?.gambar
    },
    mode: 'onChange',
    resolver: yupResolver(schema)
  })
  useEffect(() => {
    const call = async () => {
      await getAlbum({ album, setAlbum })
    }
    call();
    calledit()
  }, []);

  const calledit = () => {
    const config = {
      method: 'get',
      url: '/admin/api/galeri/' + props.id,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    }
    axios(config)
      .then((res) => {
        setData(res.data)
        reset(res.data)
      })
      .catch((err) => {
        console.error(err);
      });
  }

  const onSubmit = async (data) => {
    console.log('submit')
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('deskripsiId', data.deskripsiId);
      formData.append('deskripsiEn', data.deskripsiEn);
      formData.append('id_album', data.id_album);
      if (data.gambar[0]) {
        formData.append('gambar', fileupload);
      }
      await axios.post(`${process.env.APP_API}galery/update/${props.id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }).then(() => {
        toast.success('Data Galery berhasil ditambahkan')
        route.push('/galery/list')
      })
    } catch (error) {
      if (error.response) {
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
    setPlan('basic')
    setRole('subscriber')
    setValue('contact', Number(''))
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
              Edit Galery {data[0]?.title}</Typography>
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
              <br /><br />

              <Controller
                name='deskripsiId'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    multiline
                    minRows={3}
                    label='Deskripsi Indo'
                    onChange={onChange}
                    value={value}
                    placeholder='Bio...'
                    sx={{ '& .MuiInputBase-root.MuiFilledInput-root': { alignItems: 'baseline' } }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <Icon fontSize='1.25rem' icon='tabler:message' />
                        </InputAdornment>
                      )
                    }}
                    error={Boolean(errors.deskripsiId)}
                    {...(errors.deskripsiId && { helperText: errors.deskripsiId.message })}
                  />
                )}
              />
              <br /><br />

              <Controller
                name='deskripsiEn'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    multiline
                    onChange={onChange}
                    value={value}
                    minRows={3}
                    label='Isi Bahasa English'
                    placeholder='Bio...'
                    sx={{ '& .MuiInputBase-root.MuiFilledInput-root': { alignItems: 'baseline' } }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <Icon fontSize='1.25rem' icon='tabler:message' />
                        </InputAdornment>
                      )
                    }}
                    error={Boolean(errors.deskripsiEn)}
                    {...(errors.deskripsiEn && { helperText: errors.deskripsiEn.message })}
                  />
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

export async function getServerSideProps(context) {
  const id = context.query.index;
  return {
    props: {
      id
    },
  };
}

export default Index
