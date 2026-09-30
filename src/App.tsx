import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, Outlet, RouterProvider, ScrollRestoration } from 'react-router';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { LandingPage } from './components/landing/LandingPage';
import { EditorSkeleton } from './components/ui/EditorSkeleton';

const EditorApp = lazy(() => import('./EditorApp'));

function RootLayout() {
  return (
    <ErrorBoundary>
      {/* Scrolls to the top on new pages, restores position on back/forward, and jumps to #hash targets. */}
      <ScrollRestoration />
      <Outlet />
    </ErrorBoundary>
  );
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <LandingPage /> },
      {
        path: '/app',
        element: (
          <Suspense fallback={<EditorSkeleton />}>
            <EditorApp />
          </Suspense>
        ),
      },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
