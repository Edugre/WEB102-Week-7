import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { ResponsiveContainer, PieChart, Pie, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts'

const Dashboard = () => {
    const [games, setGames] = useState([])
    const [average, setAverage] = useState(0.00)
    const [mostCommonGenre, setMostCommonGenre] = useState("")
    const [genreList, setGenreList] = useState([])
    const [title, setTitle] = useState("")
    const [genre, setGenre] = useState("")
    const [genreCount, setGenreCount] = useState(null)
    const [yearRatingData, setYearRatingData] = useState([])

    useEffect(() => {
        try {
        const fetchData = async () => {
            const response = await fetch (`https://api.rawg.io/api/games?key=${import.meta.env.VITE_RAWG_API_KEY}&page_size=11&page=${Math.floor((Math.random() * 100) + 1)}`)
            const data = await response.json()
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
        const genres = getGenreCount()
        setMostCommonGenre(getMostCommonGenre(genres))
        const chartData = Object.entries(genres).map(([name, value]) => ({name, value}))
        console.log('Chart data:', chartData)
        setGenreCount(chartData)
        setGenreList(getGenres())
        setYearRatingData(getYearRatingData())
    }, [games])

    const calculateAverage = () => {
        if (games.length === 0) return 0.00
        let sum = 0;
        games.forEach((game) => 
        sum += game.rating
        )
        return (sum/games.length).toFixed(2)
    }
    const getMostCommonGenre = (genreCount) => {
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
    const getGenreCount = () => {
      const genreCount = {}
        games.forEach(game => {
        game.genres.forEach(genre => {
            genreCount[genre.name] = (genreCount[genre.name] || 0) + 1
        })
        })
      return genreCount
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

    const getYearRatingData = () => {
        const yearData = {}
        games.forEach(game => {
            if (game.released) {
                const year = new Date(game.released).getFullYear()
                if (!yearData[year]) {
                    yearData[year] = { totalRating: 0, count: 0 }
                }
                yearData[year].totalRating += game.rating
                yearData[year].count += 1
            }
        })
        
        return Object.entries(yearData)
            .map(([year, data]) => ({
                year: parseInt(year),
                averageRating: (data.totalRating / data.count).toFixed(2)
            }))
            .sort((a, b) => a.year - b.year)
    }

    const filteredGames = games.filter((game) => {
        const matchesTitle = game.name.toLowerCase().includes(title.toLowerCase());
        const matchesGenre = genre === "" || game.genres.some(g => g.name === genre);
        return matchesTitle && matchesGenre;
    });

    const toggleCharts = () => {
        const charts = document.getElementsByClassName("charts-container")[0]
        if (charts.style.display === 'none') {
          charts.style.display = 'flex'
        }
        else {
          charts.style.display = 'none'
        }
    }

    return (
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
        <div className='dashboard-charts'>
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
              <button type="button" onClick={toggleCharts}>📊 Toggle charts</button>
            </form>
            <table className='games_table'>
              <thead>
                <tr>
                  <th style={{width: "35%"}}>Game Title</th>
                  <th style={{width: "25%"}}>Genres</th>
                  <th style={{width: "25%"}}>Release Date</th>
                  <th style={{width: "15%"}}>Rating</th>
                </tr>
              </thead>
              <tbody>
                {filteredGames.map((game) => (
                  <tr key={game.name}>
                    <td><Link to={`game/${game.id}`}>{game.name}</Link></td>
                    <td>{game.genres.map(genre => (genre.name + " "))}</td>
                    <td>{game.released}</td>
                    <td>{game.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className='charts-container' style={{display: 'none'}}>
              <div className='chart'>
                <h4>Average Rating by Release Year</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={yearRatingData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" fontSize={10} />
                    <YAxis domain={[3.5, 5]} fontSize={10} />
                    <Tooltip />
                    <Line 
                      type="monotone"
                      dataKey="averageRating" 
                      stroke="#82ca9d"
                      strokeWidth={2}
                      dot={{fill: '#82ca9d'}}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className='chart'>
                <h4>Genre Distribution</h4>
                <ResponsiveContainer width={300} height={200} className='chart-responsive'>
                  <PieChart>
                    <Pie
                      dataKey="value"
                      data={genreCount || []}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
          </div>
        </div>
      </div>
    );
}
export default Dashboard;