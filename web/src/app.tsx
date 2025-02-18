import { Outlet, Routes, Route } from "react-router"
import Welcome from "./pages/welcome"

const App = () => {
  return (
    <Routes>
      <Route path="/" element={(
        <div>
          <h1>Notebook</h1>
          <Outlet />
        </div>
      )}>
        <Route index element={<Welcome />} />
      </Route>
    </Routes>
  )
}

export default App