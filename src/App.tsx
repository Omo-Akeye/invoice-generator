import { lazy, Suspense } from 'react';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { LandingPage } from './components/landing/LandingPage';
import { EditorSkeleton } from './components/ui/EditorSkeleton';
import { usePathname } from './lib/navigation';

const EditorApp = lazy(() => import('./EditorApp'));

function App() {
  const pathname = usePathname();
  const isEditor = pathname.replace(/\/+$/, '') === '/app';

  return (
    <ErrorBoundary>
      {isEditor ? (
        <Suspense fallback={<EditorSkeleton />}>
          <EditorApp />
        </Suspense>
      ) : (
        <LandingPage />
      )}
    </ErrorBoundary>
  );
}

export default App;
