let photoCount = 0;
let captureInterval;
let stream = null;
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const videoContainer = document.getElementById('video-container');
const videoPreview = document.getElementById('video-preview');
const gallery = document.getElementById('gallery');

// Función para guardar la foto en el servidor
async function guardarFoto(blob) {
    const formData = new FormData();
    formData.append('foto', blob, `foto-${Date.now()}.jpg`);

    try {
        const response = await fetch('/guardar-foto', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        console.log('Foto guardada:', data);
        return data;
    } catch (error) {
        console.error('Error al guardar la foto:', error);
        return { error: 'Error al guardar la foto' };
    }
}

// Función para mostrar notificaciones
function mostrarEstado(mensaje, esError = false) {
    const status = document.getElementById('status');
    status.textContent = mensaje;
    status.style.color = esError ? '#ff6b6b' : 'white';
    status.style.display = 'block';
    status.style.animation = 'none';
    status.offsetHeight; // Trigger reflow
    status.style.animation = 'fadeIn 0.3s';
    
    setTimeout(() => {
        status.style.animation = 'fadeOut 0.5s forwards';
    }, 2500);
}

// Función para detener la cámara
function detenerCamara() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
    if (captureInterval) {
        clearInterval(captureInterval);
        captureInterval = null;
    }
    
    videoContainer.style.display = 'none';
    startButton.style.display = 'block';
    stopButton.style.display = 'none';
    mostrarEstado('Cámara detenida');
}

// Función para capturar foto
async function capturePhoto() {
    const canvas = document.createElement('canvas');
    canvas.width = videoPreview.videoWidth;
    canvas.height = videoPreview.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoPreview, 0, 0, canvas.width, canvas.height);
    
    // Crear elemento de imagen para la galería
    const img = document.createElement('img');
    img.src = canvas.toDataURL('image/jpeg');
    img.style.width = '120px';
    img.style.height = '160px';
    img.style.objectFit = 'cover';
    img.style.borderRadius = '8px';
    img.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    gallery.insertBefore(img, gallery.firstChild);
    
    // Actualizar contador
    photoCount++;
    document.getElementById('photoCount').textContent = photoCount;
    
    // Guardar la foto en el servidor
    try {
        canvas.toBlob(async (blob) => {
            const resultado = await guardarFoto(blob);
            if (resultado.error) {
                mostrarEstado('Error al guardar', true);
            } else {
                mostrarEstado('Foto guardada');
            }
        }, 'image/jpeg', 0.9);
    } catch (error) {
        console.error('Error al guardar la foto:', error);
        mostrarEstado('Error al guardar', true);
    }
}

// Iniciar cámara
async function startCamera() {
    try {
        // Solicitar acceso a la cámara trasera
        const constraints = {
            video: {
                facingMode: { exact: 'environment' },
                width: { ideal: 1920 },
                height: { ideal: 1080 }
            },
            audio: false
        };
        
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        
        // Configurar el elemento de video
        videoPreview.srcObject = stream;
        videoPreview.play();
        
        // Mostrar el contenedor del video y ocultar el botón de inicio
        videoContainer.style.display = 'block';
        startButton.style.display = 'none';
        stopButton.style.display = 'block';
        
        // Iniciar captura automática cada 5 segundos
        captureInterval = setInterval(capturePhoto, 5000);
        
        // Tomar primera foto después de 1 segundo
        setTimeout(capturePhoto, 1000);
        
        mostrarEstado('Cámara iniciada');
        
    } catch (err) {
        console.error('Error al acceder a la cámara:', err);
        mostrarEstado('Error al acceder a la cámara: ' + err.message, true);
        startButton.style.display = 'block';
        stopButton.style.display = 'none';
    }
}

// Event Listeners
startButton.addEventListener('click', startCamera);
stopButton.addEventListener('click', detenerCamara);

// Detener la cámara cuando se cierre la pestaña
window.addEventListener('beforeunload', () => {
    detenerCamara();
});

// Añadir animación de fadeOut
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-10px); }
    }
`;
document.head.appendChild(style);