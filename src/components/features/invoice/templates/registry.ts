import type React from 'react';
import type { Invoice, InvoiceTemplate } from '../../../../types/invoice';
import {
    BoldTemplate,
    BoutiqueTemplate,
    ClassicTemplate,
    CorporateTemplate,
    ElegantTemplate,
    GeometricTemplate,
    LedgerTemplate,
    MinimalTemplate,
    ModernTemplate,
    StudioTemplate,
} from './index';

export interface TemplateDefinition {
    id: InvoiceTemplate;
    name: string;
    description: string;
    component: React.FC<{ invoice: Invoice }>;
}

/** Every invoice design, in picker order. The first three are shown before "More templates". */
export const TEMPLATES: TemplateDefinition[] = [
    { id: 'classic', name: 'Classic', description: 'Clean and minimal', component: ClassicTemplate },
    { id: 'ledger', name: 'Ledger', description: 'Spreadsheet grid', component: LedgerTemplate },
    { id: 'boutique', name: 'Boutique', description: 'Cream, serif, thank-you', component: BoutiqueTemplate },
    { id: 'modern', name: 'Modern', description: 'Bold header', component: ModernTemplate },
    { id: 'elegant', name: 'Elegant', description: 'Serif and warm', component: ElegantTemplate },
    { id: 'bold', name: 'Bold', description: 'Big type, dark waves', component: BoldTemplate },
    { id: 'minimal', name: 'Minimal', description: 'Airy and letter-spaced', component: MinimalTemplate },
    { id: 'corporate', name: 'Corporate', description: 'Navy and blue', component: CorporateTemplate },
    { id: 'geometric', name: 'Geometric', description: 'Teal and coral corners', component: GeometricTemplate },
    { id: 'studio', name: 'Studio', description: 'Swiss, type-led', component: StudioTemplate },
];

export const FEATURED_TEMPLATE_COUNT = 3;

const BY_ID = new Map(TEMPLATES.map((t) => [t.id, t]));

/** Unknown ids (e.g. from an edited draft) fall back to Classic. */
export const getTemplate = (id: string): TemplateDefinition => BY_ID.get(id as InvoiceTemplate) ?? TEMPLATES[0];
