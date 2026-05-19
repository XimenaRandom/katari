import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { supabase } from '../supabase.js'

// Clave secreta global
const SECRET_KEY = process.env.SECRET_KEY

// Registro de usuario
export async function registrarUsuario({ nombre_completo, ci, correo, contrasena, id_rol }) {
  // 🔹 Validaciones básicas
  if (!nombre_completo || nombre_completo.trim() === '') {
    return { exito: false, mensaje: 'El nombre completo es obligatorio' }
  }
  if (!ci || ci.trim() === '') {
    return { exito: false, mensaje: 'El CI es obligatorio' }
  }
  if (!correo || correo.trim() === '') {
    return { exito: false, mensaje: 'El correo es obligatorio' }
  }
  if (!contrasena || contrasena.trim() === '') {
    return { exito: false, mensaje: 'La contraseña es obligatoria' }
  }
  if (contrasena.length < 8) {
    return { exito: false, mensaje: 'La contraseña debe tener al menos 8 caracteres' }
  }
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/
  if (!regex.test(contrasena)) {
    return { exito: false, mensaje: 'La contraseña debe contener mayúsculas, minúsculas, números y caracteres especiales' }
  }
  if (!id_rol) {
    return { exito: false, mensaje: 'Debe seleccionar un rol válido' }
  }

  const contrasenaEncriptada = bcrypt.hashSync(contrasena, 10)

  const { data: ciExistente } = await supabase
    .from('usuario')
    .select('id_usuario')
    .eq('ci', ci)
    .single()

  if (ciExistente) {
    return { exito: false, mensaje: 'El CI ya está registrado' }
  }

  const { data: correoExistente } = await supabase
    .from('usuario')
    .select('id_usuario')
    .eq('correo', correo)
    .single()

  if (correoExistente) {
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
export async function iniciarSesion({ ci, contrasena }) {
  // Validaciones básicas
  if (!ci || ci.trim() === '') {
    return { exito: false, mensaje: 'El CI es obligatorio' }
  }
  if (!contrasena || contrasena.trim() === '') {
    return { exito: false, mensaje: 'La contraseña es obligatoria' }
  }

  // Buscar usuario por CI
  const { data: usuario, error } = await supabase
    .from('usuario')
    .select('*')
    .eq('ci', ci)
    .single()

  if (error || !usuario) {
    return { exito: false, mensaje: 'Usuario no encontrado' }
  }

  // Validar contraseña
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
