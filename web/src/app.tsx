import { lazy, Suspense } from 'react'
import { Outlet, Routes, Route } from "react-router"
const Welcome = lazy(() => import("@/pages/welcome"))
const Flow = lazy(() => import("@/pages/flow"))
import "@arco-design/web-react/dist/css/arco.css"

const App = () => {
  return (
    <Routes>
      <Route path="/" element={(
        <div>
          <Suspense fallback={<div>Loading...</div>}>
            <Outlet />
          </Suspense>
        </div>
      )}>
        <Route path="flow" element={<Flow />} />
        <Route index element={<Welcome />} />
      </Route>
    </Routes>
  )
}

export default App