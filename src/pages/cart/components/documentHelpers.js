import { Document, Packer, Paragraph, TextRun, AlignmentType } from 'docx';
import { jsPDF } from 'jspdf';
import { documentsApi } from '../api/api';

export const generateDOCX = async (orderData, cartItems, totalPrice, user) => {
  try {
    await documentsApi.create({
      type: 'DOCX',
      orderId: orderData.id
    });

    const docChildren = [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text: "ЭЛЕКТРОННЫЙ БИЛЕТ", bold: true, size: 32, color: "D4AF37" }),
        ],
      }),
      new Paragraph({ text: "" }),
      new Paragraph({
        children: [
          new TextRun({ text: `Номер заказа: `, bold: true }),
          new TextRun({ text: `${orderData.id}` }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({ text: `Покупатель: `, bold: true }),
          new TextRun({ text: `${user.firstName || ''} ${user.lastName || ''} (${user.email})` }),
        ],
      }),
      new Paragraph({ text: "" }),
      new Paragraph({
        children: [
          new TextRun({ text: "Оплаченные позиции:", bold: true, size: 24 }),
        ],
      }),
    ];

    cartItems.forEach((item, index) => {
      const dateStr = item.ticket?.eventDate 
        ? new Date(item.ticket.eventDate).toLocaleDateString('ru-RU') 
        : 'Не указана';

      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${index + 1}. Позиция: `, bold: true }),
            new TextRun({ text: `${item.ticket?.title || 'Билет'} ` }),
            new TextRun({ text: `| Дата: `, bold: true }),
            new TextRun({ text: `${dateStr} ` }),
            new TextRun({ text: `| Кол-во: `, bold: true }),
            new TextRun({ text: `${item.quantity} шт. ` }),
            new TextRun({ text: `| Цена: `, bold: true }),
            new TextRun({ text: `${item.ticket?.price || 0} ₽/шт.` }),
          ],
        })
      );
    });

    docChildren.push(new Paragraph({ text: "" }));
    docChildren.push(
      new Paragraph({
        children: [
          new TextRun({ text: `Итоговая стоимость: `, bold: true }),
          new TextRun({ text: `${totalPrice} ₽`, bold: true, color: "2ECC71" }),
        ],
      })
    );

    const doc = new Document({
      sections: [{
        properties: {},
        children: docChildren,
      }],
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ticket-${orderData.id}.docx`;
    link.click();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Ошибка при сохранении информации о DOCX или генерации файла", err);
  }
};

export const generatePDF = async (orderData, cartItems, totalPrice, user) => {
  try {
    await documentsApi.create({
      type: 'PDF',
      orderId: orderData.id
    });

    const doc = new jsPDF();
    
    doc.addFont("https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf", "Roboto", "normal");
    doc.addFont("https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf", "Roboto", "bold");
    
    doc.setFont("Roboto", "bold");
    doc.setFontSize(22);
    doc.setTextColor(212, 175, 55);
    doc.text("ЭЛЕКТРОННЫЙ БИЛЕТ", 105, 30, null, "center");

    doc.setFont("Roboto", "normal");
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);

    doc.text(`Номер заказа: ${orderData.id}`, 20, 50);
    doc.text(`Покупатель: ${user.email}`, 20, 60);
    
    doc.setFont("Roboto", "bold");
    doc.text("Оплаченные билеты:", 20, 75);
    doc.setFont("Roboto", "normal");

    let currentY = 85;
    cartItems.forEach((item, index) => {
      const dateStr = item.ticket?.eventDate 
        ? new Date(item.ticket.eventDate).toLocaleDateString('ru-RU') 
        : 'Не указана';
        
      const lineText = `${index + 1}. ${item.ticket?.title || 'Билет'} — ${item.quantity} шт. (${dateStr})`;
      doc.text(lineText, 20, currentY);
      currentY += 10;
    });
    
    currentY += 10;
    doc.setFont("Roboto", "bold");
    doc.text(`Итоговая стоимость: ${totalPrice} ₽`, 20, currentY);

    doc.save(`ticket-${orderData.id}.pdf`);
  } catch (err) {
    console.error("Ошибка при сохранении информации о PDF или генерации файла", err);
  }
};