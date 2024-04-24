window.onload = async () => {

    const URL_BASE = 'http://localhost:3031/api/';

    const query = new URLSearchParams(location.search) //Buscamos claves en la url

    if (!query.has('id')) { //Query.has es para verificar si existe la clave, en este caso id
        alert('Necesito un id'); //Si no está el ID, mostramos un error
        location.href = 'http://127.0.0.1:5500/frontend/home.html'; //Llevamos al home en caso de no tener id
    }

    const id = query.get('id'); //Recuperamos la información para poder usarla

    try {
        const selectGenres = document.getElementById('genre');//Traemos el elemento select

        const responseGenres = await fetch(`${URL_BASE}genres/`);//Traemos todos los géneros
        const resultGenres = await responseGenres.json();//Pasamos a JSON esos géneros

        resultGenres.data.forEach(genre => { //Recorremos los géneros
            const option = document.createElement('option'); //Creamos elemento option
            option.textContent = genre.name; //Le damos contenido al option
            option.setAttribute('value', genre.id); //Seteamos el atributo value, con valor genre.id
            selectGenres.appendChild(option); //Decimos que el option, es hijo del select
        });

        const response = await fetch(`${URL_BASE}movies/${id}`);
        const result = await response.json();

        const { data, meta} = result;

        const inputTitle = document.getElementById('title');
        inputTitle.setAttribute('value', data.title);
        const inputRating = document.getElementById('rating');
        inputRating.setAttribute('value', data.rating);
        const inputAwards = document.getElementById('awards');
        inputAwards.setAttribute('value', data.awards);
        const inputLength = document.getElementById('length');
        inputLength.setAttribute('value', data.length);
        const inputFecha = document.getElementById('release_date');
        inputFecha.setAttribute('value', data.release_date.split('T')[0]);
    } catch (error) {
        console.log(error);
    }

    const form = document.querySelector('form');
    const btnAgregar = document.querySelector('#btn-agregar');
    const btnEnviar = document.querySelector('#btn-enviar');
    const btnEliminar = document.querySelector('#btn-eliminar');

    btnAgregar.addEventListener('click', () => {
        for (let i = 0; i < form.elements.length; i++) {
            form.elements[i].value = null
        }//Reseteamos el formulario

        btnEnviar.textContent = 'Guardar';
        btnEliminar.style.display = 'none';
        btnAgregar.textContent = 'Cancelar';
        btnAgregar.onclick = location.href = 'http://127.0.0.1:5500/frontend/home.html';
        query.set('edit', false)
    })

    btnEliminar.addEventListener('click', async (e) => {
        e.preventDefault()
        try {
            const response = await fetch(`${URL_BASE}movies/delete/${id}`, {
                method : 'DELETE',
            })
            await response.json()

            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Película eliminada con éxito...",
                timer: 2500,
                showConfirmButton: false,
              })

              setTimeout(() => {
                location.href = 'http://127.0.0.1:5500/frontend/home.html';
              }, 2500);

        } catch (error) {
            console.log(error);
        }
    })

    form.addEventListener('submit', async function (e) {
        e.preventDefault()

        const endpoint = query.get('edit') == 'true' ? `${URL_BASE}movies/update/${id}` : `${URL_BASE}movies/create`

        try {
            const response = await fetch(endpoint, {
                method : query.get('edit') == 'true' ? 'PUT' : 'POST',
                headers : {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({
                    title : this.elements[1].value,
                    rating : this.elements[2].value,
                    awards : this.elements[3].value,
                    release_date : this.elements[4].value,
                    length : this.elements[5].value,
                    genre_id : this.elements[6].value,
                })
            })
            await response.json()

            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Cambios guardados con éxito...",
                timer: 2500,
                showConfirmButton: false,
              })

              setTimeout(() => {
                location.href = 'http://127.0.0.1:5500/frontend/home.html';
              }, 2500);

        } catch (error) {
            console.log(error);
        }
    });//Hacemos que el formulario no se envíe. Anulamos el evento submit
}