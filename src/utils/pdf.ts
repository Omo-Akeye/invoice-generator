import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

export type ExportFormat = 'pdf' | 'png';

const renderCanvas = async (elementId: string, scale: number): Promise<HTMLCanvasElement> => {
    const element = document.getElementById(elementId);
    if (!element) throw new Error(`Element #${elementId} not found.`);

    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    clone.style.top = '0';
    clone.style.display = 'block';
    clone.style.width = `${element.scrollWidth || 800}px`;
    clone.style.visibility = 'visible';
    clone.style.opacity = '1';
    document.body.appendChild(clone);

    try {
        await document.fonts.ready;
        const canvas = await html2canvas(clone, {
            scale,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
        });
        if (canvas.width === 0 || canvas.height === 0) throw new Error('Captured canvas is empty.');
        return canvas;
    } finally {
        document.body.removeChild(clone);
    }
};

const createPDFBlob = async (elementId: string): Promise<Blob> => {
    const canvas = await renderCanvas(elementId, 1.5);
    const imgData = canvas.toDataURL('image/jpeg', 0.85);
    if (!imgData.startsWith('data:image/jpeg')) throw new Error('Canvas produced an invalid image.');

    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
    });

    const a4Width = pdf.internal.pageSize.getWidth();
    const a4Height = pdf.internal.pageSize.getHeight();

    const imgProps = pdf.getImageProperties(imgData);
    const scaledWidth = a4Width;
    const scaledHeight = (imgProps.height * a4Width) / imgProps.width;

    const pageCount = Math.ceil(scaledHeight / a4Height);

    for (let i = 0; i < pageCount; i++) {
        if (i > 0) pdf.addPage();
        const yOffset = -(i * a4Height);
        pdf.addImage(imgData, 'JPEG', 0, yOffset, scaledWidth, scaledHeight, undefined, 'FAST');
    }

    return pdf.output('blob');
};

const createPNGBlob = async (elementId: string): Promise<Blob> => {
    const canvas = await renderCanvas(elementId, 2); // Higher scale for better PNG quality
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Could not encode PNG.'))), 'image/png');
    });
};

/** Renders the invoice into a File, ready to download or hand to the share sheet. */
export const createInvoiceFile = async (elementId: string, filename: string, format: ExportFormat): Promise<File> => {
    const blob = format === 'pdf' ? await createPDFBlob(elementId) : await createPNGBlob(elementId);
    return new File([blob], `${filename}.${format}`, { type: format === 'pdf' ? 'application/pdf' : 'image/png' });
};

export const downloadFile = (file: File) => {
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // Give the browser a moment to start the download before releasing the blob.
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
};

export const exportToPDF = async (elementId: string, filename: string) => {
    downloadFile(await createInvoiceFile(elementId, filename, 'pdf'));
};

export const exportToPNG = async (elementId: string, filename: string) => {
    downloadFile(await createInvoiceFile(elementId, filename, 'png'));
};

/** True when this browser can send a PDF through the native share sheet (most phones, some desktops). */
export const canShareFiles = (): boolean => {
    try {
        const probe = new File([''], 'invoice.pdf', { type: 'application/pdf' });
        return typeof navigator.share === 'function' && !!navigator.canShare?.({ files: [probe] });
    } catch {
        return false;
    }
};

export type ShareResult = 'shared' | 'cancelled' | 'needs-gesture';

/**
 * Opens the native share sheet with the file.
 * Safari only allows share() shortly after a tap; if rendering took too long it rejects with
 * NotAllowedError, and the caller should offer a second tap using the same file.
 */
export const shareFile = async (file: File, title: string): Promise<ShareResult> => {
    try {
        await navigator.share({ files: [file], title });
        return 'shared';
    } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return 'cancelled';
        if (error instanceof DOMException && error.name === 'NotAllowedError') return 'needs-gesture';
        throw error;
    }
};
