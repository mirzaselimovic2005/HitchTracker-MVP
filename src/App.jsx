import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import "./App.css";
import LiveTracking from './components/Livetracking'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <LiveTracking></LiveTracking>
    </div>
  )
}

export default App
