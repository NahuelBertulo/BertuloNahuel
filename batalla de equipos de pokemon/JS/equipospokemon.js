const MAX_POKEMON = 898;
const NUM_POKEMON_POR_EQUIPO = 3;

async function obtenerPokemonAleatorio() {
  const id = Math.floor(Math.random() * MAX_POKEMON) + 1;
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const data = await response.json();
  return {
    nombre: data.name,
    hp: data.stats.find(stat => stat.stat.name === 'hp').base_stat,
    ataque: data.stats.find(stat => stat.stat.name === 'attack').base_stat,
    defensa: data.stats.find(stat => stat.stat.name === 'defense').base_stat,
    imagen: data.sprites.front_default
  };
}

async function crearEquipo() {
  const equipo = [];
  while (equipo.length < NUM_POKEMON_POR_EQUIPO) {
    const pokemon = await obtenerPokemonAleatorio();
    equipo.push(pokemon);
  }
  return equipo;
}

function mostrarEquipo(equipo, contenedorId) {
  const contenedor = document.getElementById(contenedorId);
  contenedor.innerHTML = `<h2>${contenedorId === 'equipo1' ? 'Equipo 1' : 'Equipo 2'}</h2>`;
  equipo.forEach(p => {
    const div = document.createElement('div');
    div.innerHTML = `
      <img src="${p.imagen}" alt="${p.nombre}">
      <strong>${p.nombre}</strong><br>
      HP: ${p.hp} | Ataque: ${p.ataque} | Defensa: ${p.defensa}
    `;
    contenedor.appendChild(div);
  });
}

function tirarDado() {
  return Math.floor(Math.random() * 6) + 1;
}

function mostrarDados(dado1, dado2) {
  const div = document.getElementById('dados');
  div.innerHTML = `
    <h3>Desempate con dados</h3>
    <p>Equipo 1 sacó: <strong>${dado1}</strong></p>
    <p>Equipo 2 sacó: <strong>${dado2}</strong></p>
  `;
}

function calcularGanador(equipo1, equipo2) {
  const puntaje1 = equipo1.reduce((acc, p) => acc + p.hp + p.ataque + p.defensa, 0);
  const puntaje2 = equipo2.reduce((acc, p) => acc + p.hp + p.ataque + p.defensa, 0);

  if (puntaje1 > puntaje2) return ' ¡Equipo 1 gana!';
  if (puntaje2 > puntaje1) return ' ¡Equipo 2 gana!';

  const dado1 = tirarDado();
  const dado2 = tirarDado();
  mostrarDados(dado1, dado2);

  if (dado1 > dado2) return ' Empate en puntaje, pero  ¡Equipo 1 gana por dado!';
  if (dado2 > dado1) return ' Empate en puntaje, pero  ¡Equipo 2 gana por dado!';
  return ' ¡Empate total, incluso en el dado! 🤯';
}

async function iniciarBatalla() {
  document.getElementById('resultado').textContent = 'Cargando Pokémon...';
  document.getElementById('dados').innerHTML = '';
  const equipo1 = await crearEquipo();
  const equipo2 = await crearEquipo();

  mostrarEquipo(equipo1, 'equipo1');
  mostrarEquipo(equipo2, 'equipo2');

  const resultado = calcularGanador(equipo1, equipo2);
  document.getElementById('resultado').textContent = resultado;
}

//  Activamos el botón
document.getElementById('btn-generar').addEventListener('click', iniciarBatalla);
