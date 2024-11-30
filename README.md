# Remates: Rincón del Olvido
######
## URL al video E1
https://www.youtube.com/watch?v=OJEKaVFXPM0&ab_channel=Basti%C3%A1nSalomon
## URL al video E2
https://youtu.be/F_bFTxb8VFI
## URL al video E3
https://youtu.be/YNRki0h2waY
# Instalación del Proyecto

Este proyecto es una aplicación web que utiliza Node.js en el backend y PostgreSQL como base de datos, con un frontend separado. Sigue estos pasos para configurar y ejecutar el proyecto localmente.

## Prerrequisitos

Asegúrate de tener instalados los siguientes programas en tu máquina:

- [Node.js](https://nodejs.org) (versión 14 o superior)
- [PostgreSQL](https://www.postgresql.org) (versión 12 o superior)

## Pasos de instalación

1. Clona este repositorio en tu máquina local:
    ```bash
    git clone <URL del repositorio>
    ```

2. Instala las dependencias del **frontend**:
    ```bash
    cd PB_RinconOlvido
    cd remates-client
    npm install
    ```

3. Instala las dependencias del **backend**:
    ```bash
    cd PB_RinconOlvido
    cd remates-server
    npm install
    ```

4. Crea una base de datos en PostgreSQL para el proyecto.

5. Configura las variables de entorno en el archivo `.env` del **backend** con los detalles de conexión a tu base de datos PostgreSQL, como también un secreto JWT. (Puedes encontrar el detalle en el `.env.example`)

6. Para correr el proyecto, inicia el **frontend** y el **backend**:

    - En el **frontend**:
        ```bash
        cd PB_RinconOlvido
        cd remates-client
        npm run dev
        ```

    - En el **backend**:
        ```bash
        cd PB_RinconOlvido
        cd remates-server
        npm run dev
        ```

## Ejecutar el proyecto

Una vez que hayas seguido los pasos anteriores, el frontend estará disponible en [http://localhost:5000](http://localhost:3000) y el backend en [http://localhost:3000](http://localhost:5000).

¡Listo! Ahora deberías poder ver la aplicación ejecutándose en tu navegador.

