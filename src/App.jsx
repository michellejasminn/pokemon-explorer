//Import React Hooks
import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [search, setSearch] = useState('') //This one is to save the teks yang uda user ketik di search bar nya.
  const [pokemonList, setPokemonList] = useState([]) //Nyimpan data Pokémon from API.
  const [selectedPokemon, setSelectedPokemon] = useState(null) //Pokémon yang dipilih, kalo kita ga put ini, kita belum punya State buat menyimpan Pokémon yang detailnya akan di show.
  const [loading, setLoading] = useState(true) //Ini buat menandai apakah data masih loading?
  const [error, setError] = useState(null) //Ini buat nyimpan pesan error kalo API gagal.

  //This one is to take the Pokémon list dari API nya.
  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=26&offset=0')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch Pokémon')
        }
        return response.json() //Baca response JSON.
      })
      .then((data) => setPokemonList(data.results)) //Nyimpan hasil API ke State.
      .catch((error) => {
        console.error(error) //Showing the error di console.
        setError('Failed to load Pokémon.') //Ini buat nyimpan pesan error untuk user.
      })
      .finally(() => setLoading(false)) //Loading selesai.
  }, [])

  function fetchPokemonDetail(name) { //Ini function buat ngambil detail Pokémon nya.
    fetch(`https://pokeapi.co/api/v2/pokemon/${name}`) //Ini buat ngambil data Pokémon sesuai nama yang dipilih user, for example Pikachu, ${name} bakal jadi "pikachu".
      .then((response) => response.json()) //Baca response JSON.
      .then((data) => {
        console.log(data) //Ini buat ngecheck apakah detail Pokémon nya diterima dari API.
        setSelectedPokemon(data) //Ini buat nyimpan detail ke State.
      })
      .catch((error) => console.error(error)) //Ini buat menampilkan error di console.
  }

  //Ini function buat delete Pokémon dari list.
  function deletePokemon(name) {
    const deletedPokemon = pokemonList.find((pokemon) => pokemon.name === name)

    setPokemonList((currentList) =>
      currentList.filter((pokemon) => pokemon.name !==name)
    )

    //Ini buat tutup detail kalo Pokémon yang sedang dipilih dihapus.
    if (selectedPokemon &&
        deletedPokemon?.url.endsWith(`/${selectedPokemon.id}/`)) {
      setSelectedPokemon(null)
    }
  }

  //Ini function buat edit name Pokémon di list.
  function editPokemon(name) {
    const newName = prompt('Enter new Pokémon name:')

    if (newName ===null || newName.trim() === '') {
      return
    }

    setPokemonList((currentList) =>
      currentList.map((pokemon) =>
        pokemon.name === name
          ? { ...pokemon, name: newName.trim() }
          : pokemon
      )
    )
  }

  const filteredPokemon = pokemonList.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <h1>Pokémon Explorer</h1>
      <p>Explore your favorite Pokémon!</p>

      {/* Ini search bar buat nyari Pokémon nya. */}
      <input
        type="text"
        placeholder="Search Pokémon..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Showing the Pokémon list. */}
      <h2>Pokémon List</h2>

      {/* Showing loading message saat data masih diambil. */}
      {loading && <p>Loading Pokémon...</p>}

      {/* Shows error message kalo API gagal. */}
      {error && <p>{error}</p>}

      {loading || error ? null : filteredPokemon.length > 0 ? (
        <ul>
          {filteredPokemon.map((pokemon) => (
            <li key={pokemon.name}>
              <button onClick={() => fetchPokemonDetail(pokemon.url.split('/')[6])}>
                {pokemon.name}
              </button>

              {/* Ini button buat edit nama Pokémon. */}
              <button onClick={() => editPokemon(pokemon.name)}>
                Edit
              </button>

              {/* Ini button buat delete Pokémon dari list. */}
              <button onClick={() => deletePokemon(pokemon.name)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No Pokémon found.</p>
      )}

      {/* Shows detail Pokémon yang user pilih */}
      {selectedPokemon && (
        <div>
          <h2>{selectedPokemon.name}</h2>
          <img
            src={selectedPokemon.sprites.front_default}
            alt={selectedPokemon.name}
          />
          <p>Height: {selectedPokemon.height}</p>
          <p>Weight: {selectedPokemon.weight}</p>
        </div>
      )}
    </div>
  )
}

export default App //Ini biar App bisa dipake sama file lain.