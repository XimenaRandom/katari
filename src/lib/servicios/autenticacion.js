import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { supabase } from '../supabase.js'

// Clave secreta global
const SECRET_KEY = process.env.SECRET_KEY

// Registro de usuario
export async function registrarUsuario({ nombre_completo, ci, correo, contrasena, id_rol }) {
  const contrasenaEncriptada = bcrypt.hashSync(contrasena, 10)

  const { data: usuarioExistente } = await supabase
    .from('usuario')
    .select('id_usuario')
    .eq('correo', correo)
    .single()

  if (usuarioExistente) {
    return { exito: false, mensaje: 'El correo ya está registrado' }
  }

  const { data, error } = await supabase
    .from('usuario')
    .insert([
      {
        nombre_completo,
        ci,
        correo,
        contrasena: contrasenaEncriptada,
        estado_usuario: 'activo',
        id_rol 
      }
    ])

  if (error) return { exito: false, mensaje: error.message }
  return { exito: true, datos: data }
}

// Inicio de sesión
export async function iniciarSesion({ correo, contrasena }) {
  const { data: usuario, error } = await supabase
    .from('usuario')
    .select('*')
    .eq('correo', correo)
    .single()

  if (error || !usuario) {
    return { exito: false, mensaje: 'Usuario no encontrado' }
  }

  const contrasenaValida = bcrypt.compareSync(contrasena, usuario.contrasena)
  if (!contrasenaValida) {
    return { exito: false, mensaje: 'Contraseña incorrecta' }
  }

  // Generar token JWT
  const token = jwt.sign(
    { id_usuario: usuario.id_usuario, rol: usuario.id_rol },
    SECRET_KEY,
    { expiresIn: '2h' }
  )

  return { exito: true, usuario, token }
}
