import { Outlet, Link } from 'react-router'

function App() {
  return (
    <div className='app-container'>
      <div className='side-bar'>
        <h1>RawgZone</h1>
        <div className='side-bar-list'>
          <Link to='/'><h1>Home 🏡</h1></Link>
          <a><h1>Search 🔍</h1></a>
          <a><h1>About ❔</h1></a>
        </div>
      </div>
      <Outlet />
    </div>
  )
}

export default App
