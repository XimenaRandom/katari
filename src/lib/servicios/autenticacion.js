import bcrypt from 'bcryptjs'
import { supabase } from '../lib/supabase'

// Registro de usuario
export async function registrarUsuario({ nombre_completo, ci, correo, contrasena }) {
  // Encriptar contraseña
  const contrasenaEncriptada = bcrypt.hashSync(contrasena, 10)

  // Validar correo único
  const { data: usuarioExistente } = await supabase
    .from('Usuario')
    .select('id_usuario')
    .eq('correo', correo)
    .single()

  if (usuarioExistente) {
    return { exito: false, mensaje: 'El correo ya está registrado' }
  }

  // Insertar usuario
  const { data, error } = await supabase
    .from('Usuario')
    .insert([
      {
        nombre_completo,
        ci,
        correo,
        contrasena: contrasenaEncriptada,
        estado_usuario: 'activo',
        id_rol: 1 // rol por defecto
      }
    ])

  if (error) return { exito: false, mensaje: error.message }
  return { exito: true, datos: data }
}

// Inicio de sesión
export async function iniciarSesion({ correo, contrasena }) {
  const { data: usuario, error } = await supabase
    .from('Usuario')
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

  return { exito: true, usuario }
}
