import { InvoiceProvider } from './store/InvoiceContext';
import { InvoicePage } from './components/InvoicePage';

function App() {
  return (
    <InvoiceProvider>
      <InvoicePage />
    </InvoiceProvider>
  );
}

export default App;
