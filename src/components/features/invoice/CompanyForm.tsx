import React from 'react';
import { useInvoice } from '../../../store/InvoiceContext';
import { Input } from '../../ui/Input';
import { Card } from '../../ui/Card';
import { ImagePlus, X } from 'lucide-react';

export const CompanyForm: React.FC<{ hideHeader?: boolean }> = ({ hideHeader }) => {
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
        <Card title={hideHeader ? "" : "YOUR COMPANY"} noPadding={hideHeader}>
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    {invoice.company.logo ? (
                        <div className="relative w-24 h-24 rounded-apple overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 group">
                            <img src={invoice.company.logo} alt="Logo" className="w-full h-full object-contain" />
                            <button
                                onClick={() => updateCompany({ logo: undefined })}
                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ) : (
                        <label className="flex flex-col items-center justify-center w-24 h-24 rounded-apple border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-brand-primary cursor-pointer transition-colors bg-neutral-50 dark:bg-neutral-900">
                            <ImagePlus size={20} className="text-neutral-400" />
                            <span className="text-[10px] font-bold text-neutral-400 mt-2 uppercase tracking-tighter">Add Logo</span>
                            <input type="file" className="hidden" accept="image/*" onChange={handleLogoChange} />
                        </label>
                    )}
                    <div className="flex-1">
                        <Input
                            label="Company Name"
                            placeholder="e.g. Dangote Group"
                            value={invoice.company.name}
                            onChange={(e) => updateCompany({ name: e.target.value })}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Email Address"
                        placeholder="hello@company.com.ng"
                        type="email"
                        value={invoice.company.email}
                        onChange={(e) => updateCompany({ email: e.target.value })}
                    />
                    <Input
                        label="Phone Number"
                        placeholder="+234 803 000 0000"
                        value={invoice.company.phone}
                        onChange={(e) => updateCompany({ phone: e.target.value })}
                    />
                </div>
                <Input
                    label="Address"
                    placeholder="1 Victoria Island, Lagos, Nigeria"
                    value={invoice.company.address}
                    onChange={(e) => updateCompany({ address: e.target.value })}
                />
            </div>
        </Card>
    );
};
