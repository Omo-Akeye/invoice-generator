import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check, ChevronDown, Download, ImagePlus, KeyRound, ServerOff, UserX, WifiOff } from 'lucide-react';
import { Link } from 'react-router';
import { Logo } from '../ui/Logo';
import { Footer } from '../ui/Footer';
import { SegmentedControl } from '../ui/SegmentedControl';
import { buttonBase, buttonSizes, buttonVariants } from '../ui/buttonStyles';
import { InvoiceSheet } from '../features/invoice/InvoiceSheet';
import { SAMPLE_INVOICE } from './sampleInvoice';
import { formatCurrency } from '../../utils/formatters';
import { CURRENCIES } from '../../utils/currencies';
import { CurrencyText } from '../ui/CurrencyText';
import type { InvoiceTemplate } from '../../types/invoice';
import { cn } from '../../utils/cn';

const EASE = [0.2, 0.8, 0.2, 1] as const;

const Reveal: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ children, className, delay = 0 }) => {
    const reduce = useReducedMotion();
    return (
        <motion.div
            className={className}
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: EASE, delay }}
        >
            {children}
        </motion.div>
    );
};

const CtaLink: React.FC<{ to: string; children: React.ReactNode; variant?: 'primary' | 'secondary' | 'ghost'; className?: string }> = ({ to, children, variant = 'primary', className }) => (
    <Link to={to} className={cn(buttonBase, buttonVariants[variant], buttonSizes.lg, className)}>
        {children}
    </Link>
);

const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <p className="mb-4 text-[13px] font-medium text-accent">{children}</p>
);

const SectionHeading: React.FC<{ eyebrow: string; title: React.ReactNode; body?: React.ReactNode; className?: string }> = ({ eyebrow, title, body, className }) => (
    <div className={cn('max-w-xl', className)}>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="text-3xl font-semibold tracking-[-0.03em] text-ink text-balance sm:text-4xl">{title}</h2>
        {body && <p className="mt-4 text-[15px] leading-relaxed text-ink-muted text-pretty">{body}</p>}
    </div>
);

function useHasDraft() {
    const [hasDraft] = useState(() => {
        try {
            return !!window.localStorage.getItem('invoice-data');
        } catch {
            return false;
        }
    });
    return hasDraft;
}

/* ------------------------------------------------------------------ */

const Nav: React.FC<{ ctaLabel: string }> = ({ ctaLabel }) => {
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <header
            className={cn(
                'sticky top-0 z-40 border-b bg-canvas/80 backdrop-blur-md transition-colors duration-200',
                scrolled ? 'border-line' : 'border-transparent'
            )}
        >
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:border-x lg:border-line lg:px-10">
                <Link to="/" aria-label="InvoicePro home">
                    <Logo />
                </Link>
                <nav aria-label="Main" className="hidden items-center gap-8 text-[13px] text-ink-muted md:flex">
                    <Link to="/#how" className="transition-colors hover:text-ink">How it works</Link>
                    <Link to="/#templates" className="transition-colors hover:text-ink">Templates</Link>
                    <Link to="/#privacy" className="transition-colors hover:text-ink">Privacy</Link>
                    <Link to="/#faq" className="transition-colors hover:text-ink">FAQ</Link>
                </nav>
                <Link to="/app" className={cn(buttonBase, buttonVariants.primary, buttonSizes.sm)}>
                    {ctaLabel}
                </Link>
            </div>
        </header>
    );
};

const Hero: React.FC<{ ctaLabel: string }> = ({ ctaLabel }) => {
    const reduce = useReducedMotion();
    const rise = (delay: number) => ({
        initial: reduce ? false : { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.7, ease: EASE, delay },
    });

    return (
        <section className="relative overflow-hidden">
            <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 pb-20 pt-14 sm:px-6 sm:pt-20 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pb-28 lg:pt-24 lg:border-x lg:border-line lg:px-10">
                <div>
                    <motion.p {...rise(0)} className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs text-ink-muted">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                        Free, with no sign-up
                    </motion.p>
                    <motion.h1
                        {...rise(0.05)}
                        className="text-5xl font-semibold leading-[1.02] tracking-[-0.045em] text-ink text-balance sm:text-6xl lg:text-7xl"
                    >
                        Invoices that get you <em className="font-accent text-[1.1em] font-normal leading-none tracking-[-0.02em]">paid.</em>
                    </motion.h1>
                    <motion.p {...rise(0.12)} className="mt-6 max-w-md text-lg leading-relaxed text-ink-muted text-pretty">
                        Fill in a few details, pick a template, download a polished PDF. Everything happens in your browser, so your
                        client list stays yours.
                    </motion.p>
                    <motion.div {...rise(0.18)} className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                        <CtaLink to="/app">
                            {ctaLabel}
                            <ArrowRight size={16} strokeWidth={1.75} />
                        </CtaLink>
                        <CtaLink to="/#templates" variant="ghost">
                            See the templates
                        </CtaLink>
                    </motion.div>
                    <motion.ul {...rise(0.24)} className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-ink-muted">
                        {['No account needed', 'Works offline', 'PDF and PNG export'].map((item) => (
                            <li key={item} className="flex items-center gap-1.5">
                                <Check size={14} strokeWidth={2} className="text-accent" />
                                {item}
                            </li>
                        ))}
                    </motion.ul>
                </div>

                <motion.div
                    initial={reduce ? false : { opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
                    className="relative mx-auto w-full max-w-md lg:max-w-none"
                >
                    <div className="overflow-hidden rounded-[20px] border border-line bg-subtle p-3 sm:p-4 lg:max-h-150 lg:mask-[linear-gradient(to_bottom,black_72%,transparent)]">
                        <div className="mb-3 flex items-center justify-between px-1">
                            <span className="font-mono text-xs tabular-nums text-ink-faint">{SAMPLE_INVOICE.invoiceNumber}</span>
                            <span className={cn(buttonBase, buttonVariants.primary, 'pointer-events-none h-7 gap-1.5 px-2.5 text-xs')}>
                                <Download size={13} strokeWidth={1.75} />
                                Download
                            </span>
                        </div>
                        <InvoiceSheet invoice={SAMPLE_INVOICE} className="rounded-[10px] shadow-paper" />
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

const STEPS = [
    { title: 'Add your details', body: 'Your business, your client, and what you did. Totals, tax and discounts calculate as you type.' },
    { title: 'Choose a look', body: 'Three templates, each tuned for print. The live preview shows exactly what your client will get.' },
    { title: 'Download and send', body: 'Export a crisp PDF or PNG and send it however you like: email, WhatsApp, Slack.' },
];

const HowItWorks: React.FC = () => (
    <section id="how" className="scroll-mt-16 border-t border-line">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:border-x lg:border-line lg:px-10">
            <Reveal>
                <SectionHeading eyebrow="How it works" title="From blank page to sent in about two minutes." />
            </Reveal>
            <ol className="mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
                {STEPS.map((step, i) => (
                    <Reveal key={step.title} delay={i * 0.08}>
                        <li className="border-t border-line-strong pt-6">
                            <span className="font-mono text-xs tabular-nums text-ink-faint">0{i + 1}</span>
                            <h3 className="mt-3 text-[17px] font-medium tracking-[-0.01em] text-ink">{step.title}</h3>
                            <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">{step.body}</p>
                        </li>
                    </Reveal>
                ))}
            </ol>
        </div>
    </section>
);

const TEMPLATE_INFO: Record<InvoiceTemplate, { name: string; body: string }> = {
    classic: { name: 'Classic', body: 'Black and white with strong rules. At home in any inbox and prints well on anything.' },
    modern: { name: 'Modern', body: 'A confident colour header and airy table. Suits studios, agencies and product teams.' },
    elegant: { name: 'Elegant', body: 'Serif headings and warm tones. Right for consultants, events and hospitality.' },
};

const Templates: React.FC = () => {
    const [active, setActive] = useState<InvoiceTemplate>('modern');
    const reduce = useReducedMotion();

    return (
        <section id="templates" className="scroll-mt-16 border-t border-line bg-surface">
            <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 py-24 sm:px-6 sm:py-32 lg:grid-cols-2 lg:gap-20 lg:border-x lg:border-line lg:px-10">
                <Reveal>
                    <SectionHeading
                        eyebrow="Templates"
                        title="Three designs. All of them print-ready."
                        body="Switch templates at any time without retyping anything. Your logo, currency and payment details carry across."
                    />
                    <div className="mt-10 max-w-sm">
                        <SegmentedControl
                            ariaLabel="Preview template"
                            value={active}
                            onChange={setActive}
                            options={(Object.keys(TEMPLATE_INFO) as InvoiceTemplate[]).map((id) => ({ value: id, label: TEMPLATE_INFO[id].name }))}
                        />
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.p
                                key={active}
                                initial={reduce ? false : { opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, transition: { duration: 0.1 } }}
                                transition={{ duration: 0.2 }}
                                className="mt-5 min-h-12 text-[15px] leading-relaxed text-ink-muted"
                            >
                                {TEMPLATE_INFO[active].body}
                            </motion.p>
                        </AnimatePresence>
                    </div>
                </Reveal>

                <Reveal delay={0.1} className="mx-auto w-full max-w-md">
                    <div className="relative rounded-[20px] bg-subtle p-4 sm:p-6">
                        <AnimatePresence mode="popLayout" initial={false}>
                            <motion.div
                                key={active}
                                initial={reduce ? false : { opacity: 0, scale: 0.985 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, transition: { duration: 0.12 } }}
                                transition={{ duration: 0.35, ease: EASE }}
                            >
                                <InvoiceSheet invoice={SAMPLE_INVOICE} template={active} className="rounded-[8px] shadow-paper" />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </Reveal>
            </div>
        </section>
    );
};

const Money: React.FC<{ value: number }> = ({ value }) => (
    <CurrencyText currency={SAMPLE_INVOICE.settings.currency}>{formatCurrency(value, SAMPLE_INVOICE.settings.currency)}</CurrencyText>
);

const FeatureCard: React.FC<{ title: string; body: string; children?: React.ReactNode; className?: string }> = ({ title, body, children, className }) => (
    <div className={cn('flex flex-col rounded-card border border-line bg-surface p-6', className)}>
        {children && <div className="mb-6 flex flex-1 flex-col justify-center">{children}</div>}
        <h3 className="text-[15px] font-medium tracking-[-0.01em] text-ink">{title}</h3>
        <p className="mt-1.5 text-[14px] leading-relaxed text-ink-muted">{body}</p>
    </div>
);

const Features: React.FC = () => {
    const inv = SAMPLE_INVOICE;
    return (
        <section className="border-t border-line">
            <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:border-x lg:border-line lg:px-10">
                <Reveal>
                    <SectionHeading
                        eyebrow="What's included"
                        title="Everything a real invoice needs, nothing you have to learn."
                    />
                </Reveal>

                <div className="mt-16 grid gap-4 md:grid-cols-6">
                    <Reveal className="md:col-span-4">
                        <FeatureCard
                            className="h-full"
                            title="Tax and discounts, worked out for you"
                            body="Set a VAT rate and a percentage or fixed discount. Every total updates the moment you type."
                        >
                            <dl className="space-y-2.5 rounded-[10px] bg-subtle p-5 text-sm tabular-nums">
                                <div className="flex justify-between text-ink-muted"><dt>Subtotal</dt><dd><Money value={inv.subtotal} /></dd></div>
                                <div className="flex justify-between text-ink-muted"><dt>VAT ({inv.settings.taxRate}%)</dt><dd>+ <Money value={inv.taxAmount} /></dd></div>
                                <div className="flex justify-between text-ink-muted"><dt>Discount ({inv.settings.discountValue}%)</dt><dd>− <Money value={inv.discountAmount} /></dd></div>
                                <div className="flex items-baseline justify-between border-t border-line-strong pt-3 text-ink">
                                    <dt className="font-medium">Total due</dt>
                                    <dd className="text-xl font-semibold tracking-[-0.02em]"><Money value={inv.total} /></dd>
                                </div>
                            </dl>
                        </FeatureCard>
                    </Reveal>

                    <Reveal className="md:col-span-2" delay={0.06}>
                        <FeatureCard className="h-full" title="35 currencies" body="Naira, dollar, cedi, shilling, rand, euro and more, each with the right symbol and decimals.">
                            <div className="grid grid-cols-5 gap-2 font-currency text-lg text-ink">
                                {['₦', '$', 'GH₵', '€', `+${CURRENCIES.length - 4}`].map((symbol, i, all) => (
                                    <span
                                        key={symbol}
                                        className={cn(
                                            'flex aspect-square items-center justify-center rounded-[10px] border',
                                            i === 0 ? 'border-accent bg-accent-soft text-accent' : 'border-line bg-subtle text-ink-muted',
                                            i === all.length - 1 && 'font-sans text-[13px] font-medium'
                                        )}
                                    >
                                        {symbol}
                                    </span>
                                ))}
                            </div>
                        </FeatureCard>
                    </Reveal>

                    <Reveal className="md:col-span-2" delay={0.04}>
                        <FeatureCard className="h-full" title="Payment details on the page" body="Add bank transfer, crypto wallet or custom instructions so clients know exactly how to pay.">
                            <div className="space-y-1 rounded-[10px] bg-subtle p-4 font-mono text-xs text-ink-muted">
                                <p className="text-ink">{inv.paymentInfo?.bankName}</p>
                                <p>{inv.paymentInfo?.accountName}</p>
                                <p className="tabular-nums tracking-wider text-ink">{inv.paymentInfo?.accountNumber}</p>
                            </div>
                        </FeatureCard>
                    </Reveal>

                    <Reveal className="md:col-span-2" delay={0.08}>
                        <FeatureCard className="h-full" title="Your logo, your brand" body="Upload a logo once and it appears on every template, sized and aligned for you.">
                            <div className="flex h-full min-h-20 items-center justify-center rounded-[10px] border border-dashed border-line-strong text-ink-faint">
                                <ImagePlus size={20} strokeWidth={1.5} />
                            </div>
                        </FeatureCard>
                    </Reveal>

                    <Reveal className="md:col-span-2" delay={0.12}>
                        <FeatureCard className="h-full" title="Works without internet" body="Install it like an app. Once loaded, you can make invoices on a plane or during an outage.">
                            <div className="flex h-full min-h-20 items-center gap-3 rounded-[10px] bg-subtle px-4 text-[13px] text-ink-muted">
                                <WifiOff size={16} strokeWidth={1.75} />
                                Offline, still working
                                <span className="ml-auto h-2 w-2 rounded-full bg-accent" />
                            </div>
                        </FeatureCard>
                    </Reveal>
                </div>
            </div>
        </section>
    );
};

const PRIVACY_POINTS = [
    { icon: UserX, title: 'No account', body: 'There is no sign-up form. We never learn your name, email or who your clients are.' },
    { icon: KeyRound, title: 'Encrypted on your device', body: 'Your draft is saved with AES-256-GCM encryption, using a key that never leaves this browser.' },
    { icon: ServerOff, title: 'No server to leak', body: 'Invoices are built and exported on your device. There is no database holding them.' },
];

const Privacy: React.FC = () => (
    <section id="privacy" className="theme-dark scroll-mt-16 bg-surface text-ink">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:border-x lg:border-line lg:px-10">
            <Reveal className="max-w-2xl">
                <p className="mb-4 text-[13px] font-medium text-accent">Privacy</p>
                <h2 className="text-3xl font-semibold tracking-[-0.03em] text-balance sm:text-5xl">
                    Your invoices never leave your browser.
                </h2>
                <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ink-muted">
                    Invoices hold client names, addresses, bank details and prices. None of that should sit on someone else's
                    server, so InvoicePro doesn't have one.
                </p>
            </Reveal>
            <div className="mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
                {PRIVACY_POINTS.map(({ icon: Icon, title, body }, i) => (
                    <Reveal key={title} delay={i * 0.08}>
                        <Icon size={20} strokeWidth={1.5} className="text-accent" />
                        <h3 className="mt-4 text-[17px] font-medium tracking-[-0.01em]">{title}</h3>
                        <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">{body}</p>
                    </Reveal>
                ))}
            </div>
            <p className="mt-16 max-w-2xl border-t border-line pt-6 text-[13px] leading-relaxed text-ink-faint">
                To be precise: we count anonymous page visits so we know whether the site is useful. That count never includes
                anything you type into an invoice.
            </p>
        </div>
    </section>
);

const FAQS = [
    { q: 'Is it actually free?', a: 'Yes. There is no paid plan, no watermark and no limit on how many invoices you make.' },
    { q: 'Where is my invoice saved?', a: "In your browser's local storage, encrypted. It stays on this device only, so it won't appear if you open the site on another phone or computer." },
    { q: 'What happens if I clear my browser data?', a: 'Your saved draft is deleted along with it. Download the PDF of anything you need to keep.' },
    { q: 'How do I send the invoice to my client?', a: 'On most phones, open the Download menu and choose Share PDF to send it straight to WhatsApp, email or any other app. On a computer, download the PDF and attach it like any other file.' },
    { q: 'Can I use it offline?', a: 'Yes. After your first visit the app is cached, and you can install it to your home screen or desktop from the browser menu.' },
    { q: 'Which currencies are supported?', a: '35 currencies, including the naira, US dollar, euro, pound and yen, plus the cedi, Kenyan and Ugandan shillings, rand, CFA francs, rupee, dirham and more. Naira is the default; search the currency picker by name, code or country.' },
];

const Faq: React.FC = () => {
    const [open, setOpen] = useState<number | null>(0);
    return (
        <section id="faq" className="scroll-mt-16">
            <div className="mx-auto grid max-w-6xl gap-12 px-4 py-24 sm:px-6 sm:py-32 lg:grid-cols-[1fr_1.4fr] lg:gap-20 lg:border-x lg:border-line lg:px-10">
                <Reveal>
                    <SectionHeading eyebrow="FAQ" title="Questions, answered." />
                </Reveal>
                <Reveal delay={0.06}>
                    <ul className="border-t border-line">
                        {FAQS.map((item, i) => {
                            const isOpen = open === i;
                            return (
                                <li key={item.q} className="border-b border-line">
                                    <button
                                        type="button"
                                        onClick={() => setOpen(isOpen ? null : i)}
                                        aria-expanded={isOpen}
                                        className="flex w-full items-center justify-between gap-6 py-5 text-left text-[15px] font-medium text-ink focus-visible:outline-none focus-visible:text-accent"
                                    >
                                        {item.q}
                                        <ChevronDown
                                            size={16}
                                            strokeWidth={1.75}
                                            className={cn('shrink-0 text-ink-faint transition-transform duration-200', isOpen && 'rotate-180')}
                                        />
                                    </button>
                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.22, ease: EASE }}
                                                className="overflow-hidden"
                                            >
                                                <p className="max-w-lg pb-5 text-[15px] leading-relaxed text-ink-muted">{item.a}</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </li>
                            );
                        })}
                    </ul>
                </Reveal>
            </div>
        </section>
    );
};

const FinalCta: React.FC<{ ctaLabel: string }> = ({ ctaLabel }) => (
    <section className="border-t border-line">
        <Reveal className="mx-auto flex max-w-6xl flex-col items-center px-4 py-24 text-center sm:px-6 sm:py-32 lg:border-x lg:border-line lg:px-10">
            <h2 className="max-w-2xl text-4xl font-semibold tracking-[-0.04em] text-ink text-balance sm:text-5xl">
                Your next invoice is two minutes <em className="font-accent text-[1.1em] font-normal leading-none tracking-[-0.02em]">away.</em>
            </h2>
            <p className="mt-5 text-[15px] text-ink-muted">No sign-up. Nothing to install.</p>
            <CtaLink to="/app" className="mt-9">
                {ctaLabel}
                <ArrowRight size={16} strokeWidth={1.75} />
            </CtaLink>
        </Reveal>
    </section>
);

export const LandingPage: React.FC = () => {
    const hasDraft = useHasDraft();
    const ctaLabel = hasDraft ? 'Continue your invoice' : 'Create an invoice';

    return (
        <div className="flex min-h-screen flex-col">
            <Nav ctaLabel={hasDraft ? 'Open editor' : 'Create invoice'} />
            <main>
                <Hero ctaLabel={ctaLabel} />
                <HowItWorks />
                <Templates />
                <Features />
                <Privacy />
                <Faq />
                <FinalCta ctaLabel={ctaLabel} />
            </main>
            <Footer framed />
        </div>
    );
};
