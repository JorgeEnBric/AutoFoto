
AutoFoto es un servidor web que permite subir y mostrar fotos en una galeria.

Funciona sin https, debe ajustarse en el navegador para que funcione correctamente en chrome:

chrome://flags/
Y buscar "Insecure content allowed" y activarla para la Ip del servidor donde está corriendo AutoFoto
Ejemplo: http://IP:3000

Para inicializar el proyecto:
1. Instalar dependencias: npm install
2. Iniciar el servidor: npm start

El servidor se iniciará en http://IP:3000

El directorio de las fotos se encuentra en la carpeta "Galeria"

Para consumir la app 
1. En el celular, abrir el navegador e ir a 
http://IP:3000
