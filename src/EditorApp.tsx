import { InvoiceProvider } from './store/InvoiceContext';
import { InvoicePage } from './components/InvoicePage';

export default function EditorApp() {
  return (
    <InvoiceProvider>
      <InvoicePage />
    </InvoiceProvider>
  );
}
