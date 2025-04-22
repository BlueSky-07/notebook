import { lazy, Suspense } from 'react';
import { Outlet, Routes, Route } from 'react-router';
const HomePage = lazy(() => import('@/pages/home'));
const FlowPage = lazy(() => import('@/pages/flow'));
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
              <Suspense fallback={<></>}>
                <Outlet />
              </Suspense>
            </div>
          }
        >
          <Route path="flow/:flowId?" element={<FlowPage />} />
          <Route path="flow" element={<FlowPage />} />
          <Route index element={<HomePage />} />
        </Route>
      </Routes>
    </ConfigProvider>
  );
};

export default App;
