import { useState, useEffect } from 'react'

function App() {
  const [games, setGames] = useState([])
  const [average, setAverage] = useState(0.00)
  const [mostCommonGenre, setMostCommonGenre] = useState("")
  const [genreList, setGenreList] = useState([])
  const [title, setTitle] = useState("")
  const [genre, setGenre] = useState("")

  useEffect(() => {
    try {
      const fetchData = async () => {
        const response = await fetch (`https://api.rawg.io/api/games?key=${import.meta.env.VITE_RAWG_API_KEY}&page_size=12`)
        const data = await response.json()
        console.log(data)
        setGames(data.results)
      }

      fetchData();
    }
    catch (e) {
      console.log(e)
    }
  }, [])

  useEffect(() => {
    setAverage(calculateAverage())
    setMostCommonGenre(getMostCommonGenre())
    setGenreList(getGenres)
  }, [games])

  const calculateAverage = () => {
    if (games.length === 0) return 0.00
    let sum = 0;
    games.forEach((game) => 
      sum += game.rating
    )
    return (sum/games.length).toFixed(2)
  }
  const getMostCommonGenre = () => {
    const genreCount = {}
    games.forEach(game => {
      game.genres.forEach(genre => {
        genreCount[genre.name] = (genreCount[genre.name] || 0) + 1
      })
    })
    let max = 0
    let mostCommon = ''
    for (const genre in genreCount) {
      if (genreCount[genre] > max) {
        max = genreCount[genre]
        mostCommon = genre
      }
    }
    return mostCommon
  }

  const getGenres = () => {
    const genreSet = new Set()
    games.forEach(game => {
      game.genres.forEach(genre => {
        genreSet.add(genre.name)
      })
    })
    return Array.from(genreSet)
  }

  const filteredGames = games.filter((game) => {
    const matchesTitle = game.name.toLowerCase().includes(title.toLowerCase());
    const matchesGenre = genre === "" || game.genres.some(g => g.name === genre);
    return matchesTitle && matchesGenre;
  });

  return (
    <div className='app-container'>
      <div className='side-bar'>
        <h1>RawgZone</h1>
        <div className='side-bar-list'>
          <a><h1>Home 🏡</h1></a>
          <a><h1>Search 🔍</h1></a>
          <a><h1>About ❔</h1></a>
        </div>
      </div>
      <div className='dashboard-container'>
        <div className='cards-container'>
          <div className='card'>
            <h3>Total games listed 🎮</h3>
            <h3>{games.length}</h3>
          </div>
          <div className='card'>
            <h3>Average Rating ⭐️</h3>
            <h3>{average}</h3>
          </div>
          <div className='card'>
            <h3>Most Common Genre 👾</h3>
            <h3>{mostCommonGenre}</h3>
          </div>
        </div>
        <div className='dashboard'>
          <form className='search_filter'>
            <input 
              type='text' 
              name='title' 
              id='title' 
              placeholder='Enter a game by title' 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <select 
              name='genre' 
              id='genre'
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            >
              <option value="">Select a genre</option>
              {genreList.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </form>
          <table className='games_table'>
            <thead>
              <tr>
                <th style={{width: "25%"}}>Game Title</th>
                <th style={{width: "20%"}}>Genres</th>
                <th style={{width: "30%"}}>Platforms</th>
                <th style={{width: "15%"}}>Release Date</th>
                <th style={{width: "10%"}}>Rating</th>
              </tr>
            </thead>
            <tbody>
              {filteredGames.map((game) => (
                <tr key={game.name}>
                  <td>{game.name}</td>
                  <td>{game.genres.map(genre => (genre.name + " "))}</td>
                  <td>{game.parent_platforms.map(platform => (platform.platform.name + " "))}</td>
                  <td>{game.released}</td>
                  <td>{game.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default App
