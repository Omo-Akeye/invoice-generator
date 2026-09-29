import React from 'react';
import { useInvoice } from '../../../store/InvoiceContext';
import { Input } from '../../ui/Input';
import { ImagePlus, X } from 'lucide-react';
import { sanitizeText, sanitizeEmail } from '../../../utils/sanitize';

export const CompanyForm: React.FC<{ hideHeader?: boolean }> = () => {
    const { invoice, updateCompany } = useInvoice();

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 500 * 1024) {
                alert('Logo file is too large. Please use an image under 500KB.');
                return;
            }

            if (!file.type.startsWith('image/')) {
                alert('Please upload a valid image file.');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                updateCompany({ logo: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <fieldset className="space-y-3">
            <legend className="mb-3 text-[13px] font-medium text-ink">From</legend>
            <div className="flex items-end gap-3">
                {invoice.company.logo ? (
                    <div className="group relative h-[62px] w-[62px] shrink-0 overflow-hidden rounded-control border border-line bg-white">
                        <img src={invoice.company.logo} alt="Your logo" className="h-full w-full object-contain p-1" />
                        <button
                            type="button"
                            onClick={() => updateCompany({ logo: undefined })}
                            aria-label="Remove logo"
                            className="absolute inset-0 flex items-center justify-center bg-ink/60 text-canvas opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ) : (
                    <label className="flex h-[62px] w-[62px] shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-control border border-dashed border-line-strong text-ink-faint transition-colors hover:border-ink-faint hover:text-ink-muted focus-within:border-accent">
                        <ImagePlus size={16} strokeWidth={1.75} />
                        <span className="text-[10px] font-medium">Logo</span>
                        <input type="file" className="sr-only" accept="image/*" onChange={handleLogoChange} />
                    </label>
                )}
                <div className="flex-1">
                    <Input
                        label="Business name"
                        placeholder="Lumen Studio"
                        autoComplete="organization"
                        value={invoice.company.name}
                        onChange={(e) => updateCompany({ name: sanitizeText(e.target.value, 100) })}
                    />
                </div>
            </div>
            <Input
                label="Email"
                placeholder="hello@business.com"
                autoComplete="email"
                type="email"
                value={invoice.company.email}
                onChange={(e) => updateCompany({ email: sanitizeEmail(e.target.value) })}
            />
            <Input
                label="Phone"
                placeholder="+234 803 000 0000"
                type="tel"
                autoComplete="tel"
                value={invoice.company.phone}
                onChange={(e) => updateCompany({ phone: sanitizeText(e.target.value, 30) })}
            />
            <Input
                label="Address"
                placeholder="1 Victoria Island, Lagos"
                autoComplete="street-address"
                value={invoice.company.address}
                onChange={(e) => updateCompany({ address: sanitizeText(e.target.value, 200) })}
            />
        </fieldset>
    );
};
