document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('exampleModal');

    // Agregar un evento cuando el modal se muestre
    modal.addEventListener('shown.bs.modal', function () {
        const registroForm = document.getElementById('registroForm');

        // Verificar que el formulario exista
        if (registroForm) {
            registroForm.addEventListener('submit', function (event) {
                event.preventDefault(); // Prevenir el comportamiento por defecto

                // Obtener los datos del formulario
                const nombre = document.getElementById('nombre').value;
                const apellido = document.getElementById('apellido').value;
                const matricula = document.getElementById('matricula').value;
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const grupo = document.getElementById('grupo').value;
                const salon = document.getElementById('salon').value;

                // Crear el objeto con los datos
                const data = {
                    nombre: nombre,
                    apellido: apellido,
                    matricula: matricula,
                    email: email,
                    password: password,
                    grupo: grupo,
                    salon: salon,
                };

                // Enviar los datos con una petición POST
                fetch('http://192.168.100.7:3000/api/v3.4/acces/users/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Éxito:', data);
                    alert('Formulario enviado exitosamente');
                    // Opcional: Cerrar el modal después de enviar
                    const bootstrapModal = bootstrap.Modal.getInstance(modal);
                    bootstrapModal.hide();
                })
                .catch((error) => {
                    console.error('Error:', error);
                    alert('Hubo un error al enviar el formulario');
                });
            });
        }
    });
});
