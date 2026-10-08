document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('clienteForm');
  const respuestaDiv = document.getElementById('respuesta');
  const listaClientes = document.getElementById('listaClientes');

  const cargarClientes = async () => {
    try {
      const res = await fetch('/clientes');
      const clientes = await res.json();

      listaClientes.innerHTML = '';
      if (clientes.length === 0) {
        listaClientes.innerHTML = '<li>No hay registros guardados aún.</li>';
        return;
      }

      clientes.reverse().forEach(c => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${c.nombre}</strong> (${c.edad} años) - <em>${c.ciudad}</em>`;
        listaClientes.appendChild(li);
      });
    } catch (error) {
      listaClientes.innerHTML = '<li>Error al cargar la lista de clientes.</li>';
    }
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const edad = document.getElementById('edad').value;
    const ciudad = document.getElementById('ciudad').value;

    try {
      const res = await fetch('/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, edad, ciudad })
      });

      const data = await res.json();

      respuestaDiv.style.display = 'block';
      if (res.ok) {
        respuestaDiv.className = 'alert alert-success';
        respuestaDiv.textContent = data.mensaje;
        form.reset();
        cargarClientes();
      } else {
        respuestaDiv.className = 'alert alert-error';
        respuestaDiv.textContent = data.error || 'Ocurrió un error al guardar.';
      }
    } catch (error) {
      respuestaDiv.style.display = 'block';
      respuestaDiv.className = 'alert alert-error';
      respuestaDiv.textContent = 'Error de conexión con el servidor.';
    }
  });

  cargarClientes();
});
