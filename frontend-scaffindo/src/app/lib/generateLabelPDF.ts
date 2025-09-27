// utils/pdf/generateLabelPDF.ts
import { jsPDF } from "jspdf";
import QRCode from "qrcode";

type InvoiceForPdf = {
    id: string;             // invoiceId, ex: "INVOICE-1-Aqua-001"
    labelIds: string[];     // ex: ["INVOICE-...-0001", ...]
};

type Options = {
    titleText?: string;     // optional heading on page 1
    fontFamily?: string;    // default: "helvetica"
    invoiceTextSize?: number; // pt, for invoice page text (default 16)
    labelTextSize?: number;   // pt, for grid text (default 10 for "sedang")
    marginMm?: number;
};

export async function generateLabelPDF(
    invoice: InvoiceForPdf,
    opts: Options = {}
) {
    const {
        titleText = "Invoice QR",
        fontFamily = "helvetica",
        invoiceTextSize = 16,
        labelTextSize = 10,
        marginMm = 10,
    } = opts;

    const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();

    doc.setFont(fontFamily, "bold");
    doc.setFontSize(invoiceTextSize + 2);
    doc.text(titleText, pageW / 2, marginMm + 2, { align: "center" });

    const invoiceQrDataUrl = await QRCode.toDataURL(invoice.id, {
        errorCorrectionLevel: "M",
        margin: 1,
        scale: 12,
    });

    const bigQRSize = Math.min(pageW, pageH) * 0.55;
    const bigQrX = (pageW - bigQRSize) / 2;
    const bigQrY = (pageH - bigQRSize) / 2 - 6;

    doc.addImage(invoiceQrDataUrl, "PNG", bigQrX, bigQrY, bigQRSize, bigQRSize);
    doc.setFont(fontFamily, "normal");
    doc.setFontSize(invoiceTextSize);
    const invoiceTextY = bigQrY + bigQRSize + 10;
    doc.text(invoice.id, pageW / 2, invoiceTextY, { align: "center" });

    // ------------ Pages 2+: 5x5 grid of label QR ------------
    const labels = invoice.labelIds || [];
    if (labels.length > 0) {
        const cols = 5;
        const rows = 5;
        const perPage = cols * rows;

        const gridW = pageW - marginMm * 2;
        const gridH = pageH - marginMm * 2;
        const cellW = gridW / cols;
        const cellH = gridH / rows;

        const qrSize = Math.min(cellW, cellH) * 0.72;
        const textGap = 2.2;

        for (let start = 0; start < labels.length; start += perPage) {
            doc.addPage();

            const pageSlice = labels.slice(start, start + perPage);

            doc.setFont(fontFamily, "bold");
            doc.setFontSize(10);
            doc.text(
                `Labels ${start + 1}–${start + pageSlice.length} / ${labels.length}`,
                pageW / 2,
                marginMm - 2 < 6 ? 6 : marginMm - 2,
                { align: "center" }
            );

            doc.setFont(fontFamily, "normal");
            doc.setFontSize(labelTextSize);

            for (let idx = 0; idx < pageSlice.length; idx++) {
                const _id = pageSlice[idx];
                const r = Math.floor(idx / cols);
                const c = idx % cols;

                const cellX = marginMm + c * cellW;
                const cellY = marginMm + r * cellH;

                const qrX = cellX + (cellW - qrSize) / 2;
                const qrY = cellY + (cellH - (qrSize + labelTextSize * 0.5 + textGap)) / 2;

                const dataUrl = await QRCode.toDataURL(_id, {
                    errorCorrectionLevel: "M",
                    margin: 0,
                    scale: 6,
                });

                doc.addImage(dataUrl, "PNG", qrX, qrY, qrSize, qrSize);

                const textY = qrY + qrSize + textGap + labelTextSize * 0.35;
                doc.text(_id, cellX + cellW / 2, textY, { align: "center" });
            }
        }
    }
    const filename = `${invoice.id}_labels.pdf`;
    doc.save(filename);
}
