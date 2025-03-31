import { lazy, Suspense } from 'react';
import { Outlet, Routes, Route } from 'react-router';
const Welcome = lazy(() => import('@/pages/welcome'));
const Flow = lazy(() => import('@/pages/flow'));
import '@arco-design/web-react/dist/css/arco.css';
import { ConfigProvider } from '@arco-design/web-react';
import enUS from '@arco-design/web-react/es/locale/en-US';

const App = () => {
  return (
    <ConfigProvider locale={enUS}>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <Suspense fallback={<div>Loading...</div>}>
                <Outlet />
              </Suspense>
            </div>
          }
        >
          <Route path="flow/:flowId?" element={<Flow />} />
          <Route path="flow" element={<Flow />} />
          <Route index element={<Welcome />} />
        </Route>
      </Routes>
    </ConfigProvider>
  );
};

export default App;
