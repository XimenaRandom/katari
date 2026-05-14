import { iniciarSesion, registrarUsuario } from './autenticacion.js'

async function probarAuth() {
  // 🔹 Probar registro como Administrador
  const registroAdmin = await registrarUsuario({
    nombre_completo: 'Juan Pérez',
    ci: '123456',
    correo: 'admin@test.com',
    contrasena: '12345678',
    id_rol: 1 //  Administrador
  })
  console.log('Resultado registro admin:', registroAdmin)

  //  Probar registro como Usuario normal
  const registroUsuario = await registrarUsuario({
    nombre_completo: 'María López',
    ci: '654321',
    correo: 'usuario@test.com',
    contrasena: '87654321',
    id_rol: 2 //  Usuario
  })
  console.log('Resultado registro usuario:', registroUsuario)

  //  Probar login del usuario normal
  const login = await iniciarSesion({
    correo: 'usuario@test.com',
    contrasena: '87654321'
  })
  console.log('Resultado login:', login)
}

probarAuth()
