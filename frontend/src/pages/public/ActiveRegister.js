import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import path from '../../ultils/path'
import Swal from 'sweetalert2'

const ActiveRegister = () => {
   const { status } = useParams()
   const navigate = useNavigate()
   useEffect(() => {
      if (status === 'error') Swal.fire('Error!', 'Active register failed', 'error').then(() => navigate(`/${path.LOGIN}`))
      if (status === 'success') Swal.fire('Congratulation!', 'Register successfully', 'success').then(() => navigate(`/${path.LOGIN}`))
   }, [navigate, status])
   return <></>
}

export default ActiveRegister
