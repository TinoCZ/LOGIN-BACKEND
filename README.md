# Este proyecto es una API REST desarrollada con Node.js y Express, que implementa un sistema de autenticación y autorización basado en JWT. Utiliza MongoDB como base de datos mediante Mongoose y sigue una arquitectura MVC para mantener una correcta separación de responsabilidades. La aplicación permite el registro y login de usuarios, el acceso a rutas protegidas mediante middleware de autenticación y el manejo centralizado de errores.


# Instalación:

-npm install (para instalar los modulos de node, express, bcrypt, jswebtoken, cors, dotenv, etc)


-npm run dev (para correr el servidor)


# Importante:

En el package.json aclarar en type
que sea de tipo "module", ya que por
defecto, dependiendo la version de node
que tengas puede no tener el type y venir
ya con "CommonJS" preestablecido.

Para versiones viejas se puede añadir la extension de Nodemon
y si tenes a partir de la version 22 podes usar  "dev": "node --watch main.js" (en el package.json en 
la parte de scripts) para no tener que recargar tu servidor constantemente.


# Ejemplos de Request:


------------------------------------------------------------------

{
    "username": "Valen",
    "email": "hypemix07@gmail.com",
    "password": "1233211"
}



{
    "status": 400,
    "ok": false,
    "message": "El email ya esta registrado",
    "data": null
}


------------------------------------------------------------------


{
     "email": "ste@steve.com",
    "password": "123321"
}




{
    "status": 401,
    "ok": false,
    "message": "Credenciales invalidas",
    "data": null
}


------------------------------------------------------------------


{
  "email": "usuario@test.com",
  "password": "123456"
}



 

{
  "ok": true,
  "data": {
    "token": "abvñpoqibqnivqrtghpiof9013it0p91"
  }
}


------------------------------------------------------------------

{
  "title": "Mi Workspace",
  "description": "Workspace de prueba"
}





{
  "ok": true,
  "data": {
    "workspace": {
      "title": "Mi Workspace"
    }
  }
}
