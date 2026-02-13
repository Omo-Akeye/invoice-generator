import { InvoiceProvider } from './store/InvoiceContext';
import { InvoicePage } from './components/InvoicePage';
import { ErrorBoundary } from './components/ui/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <InvoiceProvider>
        <InvoicePage />
      </InvoiceProvider>
    </ErrorBoundary>
  );
}

export default App;
