import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

export const exportToPDF = async (elementId: string, filename: string) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    try {
        const clone = element.cloneNode(true) as HTMLElement;
        clone.style.position = 'absolute';
        clone.style.left = '-9999px';
        clone.style.top = '0';
        clone.style.display = 'block';
        clone.style.width = `${element.scrollWidth || 800}px`;
        clone.style.visibility = 'visible';
        clone.style.opacity = '1';
        document.body.appendChild(clone);

        const canvas = await html2canvas(clone, {
            scale: 1.5,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
        });

        document.body.removeChild(clone);

        if (canvas.width === 0 || canvas.height === 0) {
            console.error('PDF export failed: captured canvas is empty.');
            return;
        }

        const imgData = canvas.toDataURL('image/jpeg', 0.85);

        if (!imgData || !imgData.startsWith('data:image/jpeg')) {
            console.error('PDF export failed: canvas produced an invalid image.');
            return;
        }

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

        pdf.save(`${filename}.pdf`);
    } catch (error) {
        console.error('Error generating PDF:', error);
    }
};
