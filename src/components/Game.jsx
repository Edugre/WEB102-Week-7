import { useEffect, useState } from "react";
import { useParams } from "react-router";

const Game = () => {
    const params = useParams();
    const [gameInfo, setGameInfo] = useState(null);
    const [gameScreenshots, setgameScreenshots] = useState(null);

    useEffect(() => {
        try {
            const fetchData = async () => {
                const response = await fetch(`https://api.rawg.io/api/games/${params.id}?key=${import.meta.env.VITE_RAWG_API_KEY}`)
                const data = await response.json()
                console.log(data)
                setGameInfo(data)
            }

            const fetchScreenshots = async () => {
                const response = await fetch(`https://api.rawg.io/api/games/${params.id}/screenshots?key=${import.meta.env.VITE_RAWG_API_KEY}`)
                const data = await response.json()
                console.log(data)
                setgameScreenshots(data)
            }

            fetchData()
            fetchScreenshots()
        } catch (e) {
            console.log(e)
        }
    }, [])
    
    return (
        <div className="game-container">
            <div className="game-info">
                <div className="release-platforms">
                    <p><strong>Release Date:</strong> {gameInfo?.released || 'N/A'}</p>
                    <p><strong>Platforms:</strong> {gameInfo?.platforms?.map(p => p.platform.name).join(', ') || 'N/A'}</p>
                </div>
                <h1>{gameInfo?.name}</h1>
                <h2>About</h2>
                <p>{gameInfo?.description_raw?.slice(0, 500)}...</p>
                <div className="description-grid">
                    <div className="title-desc">
                        <p><strong>Genres</strong></p>
                        <p>{gameInfo?.genres.map(genre => genre.name).join(', ')}</p>
                    </div>
                    <div className="title-desc">
                        <p><strong>Developers</strong></p>
                        <p>{gameInfo?.developers.map(developer => developer.name).join(', ')}</p>
                    </div>
                    <div className="title-desc">
                        <p><strong>Rating</strong></p>
                        <p>{gameInfo?.rating} ⭐️</p>
                    </div>
                </div>
            </div>
            <div className="screenshots">
                <div className="screenshot-grid">
                    {gameScreenshots?.results.length > 0 && 
                        <img src={gameScreenshots.results[0].image} className="main-screenshot"/>    
                    }
                    <div className="grid-2x2">
                        {gameScreenshots?.results.slice(1, 5).map(screenshot => 
                            <img className="small-screenshot" src={screenshot.image} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Game