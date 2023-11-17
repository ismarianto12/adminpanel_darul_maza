// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import { useRouter } from 'next/router'
// ** Custom Component Import
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'

import { Card, CardContent } from '@mui/material'
import axios from 'axios'
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
  jenis_tagihan: yup.string().required(),
  type_pembayaran: yup.string().required(),
  jumlah_bayar: yup.string().required(),
  type_pembayaran: yup.string().required(),
})

const GetDataTagihan = async (props) => {
  await axios.post(`${proces.env.APP_API}/tagihan/detaildata/${props.id}`).then((data) => {
    props.setdataTagihan(data.data)
  }).catch((err) => {
    console.log(err, 'can\'t passing data')
  })
}

const Bayar = (props) => {
  const route = useRouter()
  const [datasiswa, setDatasiswa] = useState([])
  const [datatagihan, setdataTagihan] = useState([])

  const { params } = useRouter()
  const {
    reset,
    control,
    setValue,
    setError,
    handleSubmit,
    register,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: '', //data?.title,
      seotitle: '', // data?.seotitle,
      active: '' // data?.active,
    },
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    const CallSiswa = async () => {
      await axios.get(`${process.env.APP_API}siswa/edit/${props.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      }, {
        params: { siswa_id: props.id },
      }).then(data => {
        setDatasiswa(data.data)
      }).catch(errr => {
        setDatasiswa([])
        Swal.fire('error', 'gagal mendapatkan data siswa', 'error')
      })
    }

    CallSiswa()
    callTagihan()

  }, [])

  useEffect(() => {
    const jenisTagihan = async () => {
      axios.get(`${process.env.APP_API}/api/v1/jenistagihan`, {
        headers: {
          Authorization: `${localStorage.getItem('accessToken')}`
        }
      },).then((data) => {
        setdataTagihan(data.data)
      }).catch(err => {
        Swal.fire('error', 'gagal mengambil data tagihan', 'error')
      })
    }
    jenisTagihan()
  }, [])

  const callTagihan = async () => {
    await axios.post(`${process.env.APP_API}keuangan/detail/${props.id}`, {
      siswa_id: props.id,
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    }).then((data) => {
      setDetailTagihan(data.data)
    }).catch((err) => {
      Swal.fire('Error', 'tidak data passing data', 'error')
      setDetailTagihan([])
    })

  }
  const onSubmit = async (data) => {
    try {
      await axios.post(`${process.env.APP_API}/api/v1/update_pembayaran`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      }).then(data => {
        Swal.fire('success', 'berhasil menambahkan data tagihan siswa', 'success')
      }).catch(err => {
        Swal.fire('gagal', 'gagal menambahkan data tagihan siswa', 'error')
      })
    } catch (error) {
    }
  }

  const handleClose = () => {
    reset()
    route.push('/keuangan/tagihan/list')
  }
  const jenisBayar = {
    1: 'Cash',
    2: 'Anggsuran',
  }
  console.log(datasiswa, 'datail data')
  return (
    <>
      <Card>
        <CardContent>

          <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group mb-4">
                    <label>Jenis Tagihan</label>


                    <select
                      className={`form-control ${errors.jenis_tagihan ? 'is-invalid' : ''}`}
                      id="jenis_tagihan"
                      name="jenis_tagihan"
                      placeholder="Jenis Tagihan"
                      defaultValue=""
                      {...register('jenis_tagihan', { required: true })}
                    >
                      {datatagihan.map((data, i) => (
                        <option value={`${data.id}`}>{data.tagihan}</option>
                      ))}

                    </select>

                    {errors.jenis_tagihan && <div className="invalid-feedback">This field is required.</div>}
                  </div>

                  <div className="form-group mb-4">
                    <label>Tyope Pembayaran</label>
                    <select
                      className={`form-control ${errors.type_pembayaran ? 'is-invalid' : ''}`}
                      id="type_pembayaran"
                      name="type_pembayaran"
                      defaultValue=""
                      {...register('type_pembayaran', { required: true })}
                    >
                      {Object.entries(jenisBayar).map(([key, value]) => (
                        <option value={`${key}`}>{value}</option>
                      ))}
                    </select>
                    {errors.type_pembayaran && <div className="invalid-feedback">This field is required.</div>}

                  </div>


                  <div className="form-group mb-4">



                    <label>Nama Siswa</label>
                    <input
                      type="text"
                      className={`form-control ${errors.nis ? 'is-invalid' : ''}`}
                      id="nis"
                      name="nis"
                      placeholder="Nama Siswa"
                      defaultValue=""
                      {...register('nis', { required: true })}
                    />
                    {errors.nis && <div className="invalid-feedback">This field is required.</div>}
                  </div>

                  <div className="form-group mb-4">
                    <label>Jumlah Bayar</label>
                    <input
                      type="text"
                      className={`form-control ${errors.jumlah_bayar ? 'is-invalid' : ''}`}
                      id="jumlah_bayar"
                      name="jumlah_bayar"
                      placeholder="Jumlah Bayar"
                      defaultValue=""
                      {...register('jumlah_bayar', { required: true })}
                    />
                    {errors.jumlah_bayar && <div className="invalid-feedback">This field is required.</div>}
                  </div>
                </div>
              </div>
              <div className="_stepbackgroundalkdmsaldkma exssubmitform pt-3 form-group mb-4 row" >
                <div className="col-md-12 text-center">
                  <button type="submit" className="btn-block btn btn-success" style={{
                    'width': '40%', 'marginRight': '15px'
                  }}>Proses Pembayaran</button>
                  <button type="reset" onClick={() => confirmbatal()} className="btn-block btn btn-danger" style={{
                    'width': '40%'
                  }}>Batal</button>
                </div>
              </div>
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


export default Bayar
