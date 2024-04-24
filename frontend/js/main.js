const favoriteChange = (e, id) => {
  e.target.classList.toggle('fa-solid');
  e.target.classList.toggle('fa-regular');

  const favorites = sessionStorage.getItem('favorites22') ? JSON.parse(sessionStorage.getItem('favorites22')) : sessionStorage.setItem('favorites22', JSON.stringify([]));

  if (favorites.includes(id)) {
    const favoritesUpdated = favorites.filter(f => f != id);
    sessionStorage.setItem('favorites22', JSON.stringify(favoritesUpdated));
  } else {
    favorites.push(id);
    sessionStorage.setItem('favorites22', JSON.stringify(favorites));
  }
};

window.onload = async () => {
  const app = document.getElementById("root"); //captura elemente con id root
  const container = document.createElement("div"); //crea el elemento, etiqueta div
  container.setAttribute("class", "container"); //setea al div creado el atributo class con valor container
  app.appendChild(container); //agrega a container como hijo de root

  // Aqui debemos agregar nuestro fetch

  try {
    const response = await fetch('http://localhost:3031/api/movies');
    const result = await response.json();
    const { meta, data } = result;

    data.forEach((movie) => {
      const card = document.createElement("div");
      card.setAttribute("class", "card");

      const h1 = document.createElement("h1");
      h1.textContent = movie.title;

      const p = document.createElement("p");
      p.textContent = `Rating: ${movie.rating}`;

      const duracion = document.createElement("p");
      duracion.textContent = `Duración: ${movie.length}`;

      container.appendChild(card);
      card.appendChild(h1);
      card.appendChild(p);
      if (movie.genre !== null) {
        const genero = document.createElement("p");
        genero.textContent = `Genero: ${movie.genre.name}`;
        card.appendChild(genero);
      }
      card.appendChild(duracion);

      const link = document.createElement('a');
      link.textContent = 'Editar';
      link.setAttribute('href', `formulario.html?id=${movie.id}&edit=${true}`);

      card.appendChild(link);

      const favoriteLink = document.createElement('a');
      favoriteLink.setAttribute('href', '#');
      favoriteLink.setAttribute('class', 'favorite');
      favoriteLink.setAttribute('onClick', `favoriteChange(event, ${movie.id})`)
      favoriteLink.innerHTML = `<i class="${favorites.includes(movie.id) ? 'fa-solid' : 'fa-regular'} fa-heart fa-lg"></i>`;

      card.appendChild(favoriteLink);
    });
  } catch (error) {
    console.log(error);
  }
};