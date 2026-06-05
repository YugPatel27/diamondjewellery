import html2pdf from 'html2pdf.js';
import { apiClient } from './api';

interface OrderData {
  orderId: string;
  _id?: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    image?: string;
    customizationPrice?: number;
    description?: string;
    customization?: {
      ringSize?: string;
      engravingText?: string;
      selectedDiamond?: {
        carat?: string;
        color?: string;
        clarity?: string;
        price?: number;
      };
    };
  }>;
  totalPrice: number;
  finalTotal?: number;
  gst?: number;
  paymentStatus?: string;
  trackingNumber?: string;
  shippingAddress?: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
  };
  createdAt?: string;
  status?: string;
  paymentMethod?: string;
  notes?: string;
  userId?: string;
}

// Company details
const COMPANY_INFO = {
  name: 'DIAMOND JEWELS',
  tagline: 'Premium Diamond & Fine Jewellery',
  address: '# 5-50, 3rd Cross PTC Building, I.T. Estate, New Delhi - 135800',
  phone: '+91-11-4575-9999',
  email: 'support@diamondjewels.com',
  website: 'www.diamondjewels.com',
  gstin: '07AABCT1234R1Z5',
  pan: 'AABCT1234R',
  cin: 'U36999DL2020PTC364123',
  bankName: 'STATE BANK OF INDIA',
  bankBranch: 'Sector 62, Noida',
  accountNo: '50012345678901',
  ifscCode: 'SBIN0015876',
  accountHolder: 'DIAMOND JEWELS PVT LTD'
};

export const generateOrderPDF = (order: OrderData) => {
  const customizationTotal = order.items?.reduce((sum, item) => {
    const perUnit = item.customizationPrice || item.customization?.selectedDiamond?.price || 0;
    return sum + perUnit * item.quantity;
  }, 0) || 0;
  
  // GST Logic: Price is inclusive of 3% GST
  const finalTotal = order.finalTotal || order.totalPrice;
  const gst = order.gst || (finalTotal - Math.round(finalTotal / 1.03));
  const baseTotal = finalTotal - gst;
  const cgst = Math.round(gst / 2);
  const sgst = Math.round(gst / 2);
  
  const invoiceDate = new Date(order.createdAt || new Date());
  const invoiceDateStr = invoiceDate.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  
  const dueDate = new Date(invoiceDate);
  dueDate.setDate(dueDate.getDate() + 30);
  const dueDateStr = dueDate.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { margin: 0; padding: 0; }
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          color: #1a1a1a; 
          background: #fff;
          line-height: 1.4;
        }
        @page {
          size: A4;
          margin: 10mm;
        }
        .page { page-break-after: always; }
        .page:last-child { page-break-after: avoid; }
        
        .header-section {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
          border-bottom: 3px solid #8B7355;
          padding-bottom: 15px;
        }
        
        .company-header {
          flex: 1;
        }
        
        .company-name {
          font-size: 28px;
          font-weight: 900;
          color: #8B7355;
          letter-spacing: 2px;
          margin-bottom: 2px;
        }
        
        .company-tagline {
          font-size: 11px;
          color: #666;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        
        .company-details {
          font-size: 9px;
          color: #555;
          line-height: 1.5;
        }
        
        .invoice-header {
          text-align: right;
        }
        
        .invoice-title {
          font-size: 22px;
          font-weight: 900;
          color: #8B7355;
          margin-bottom: 10px;
        }
        
        .invoice-number {
          background: #f5f0e8;
          border: 2px solid #8B7355;
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        
        .meta-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin: 20px 0;
        }
        
        .meta-box {
          background: #faf8f3;
          border: 1px solid #ddd;
          padding: 12px;
          border-radius: 4px;
        }
        
        .meta-label {
          font-size: 8px;
          font-weight: 900;
          color: #8B7355;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }
        
        .meta-value {
          font-size: 10px;
          color: #333;
          font-weight: 600;
        }
        
        .address-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 25px;
          margin: 20px 0 25px 0;
        }
        
        .address-block {
          background: #faf8f3;
          padding: 12px;
          border-left: 3px solid #8B7355;
          border-radius: 2px;
        }
        
        .address-title {
          font-size: 9px;
          font-weight: 900;
          color: #8B7355;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }
        
        .address-text {
          font-size: 9px;
          color: #555;
          line-height: 1.6;
        }
        
        .items-section {
          margin: 25px 0;
        }
        
        .section-title {
          font-size: 10px;
          font-weight: 900;
          color: #8B7355;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 10px;
          border-bottom: 2px solid #8B7355;
          padding-bottom: 6px;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 9px;
        }
        
        thead tr {
          background: #8B7355;
          color: white;
        }
        
        th {
          padding: 8px;
          text-align: left;
          font-weight: 700;
          font-size: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border: 1px solid #8B7355;
        }
        
        td {
          padding: 8px;
          border: 1px solid #e0e0e0;
          vertical-align: top;
          color: #333;
        }
        
        tbody tr:nth-child(even) {
          background: #faf8f3;
        }
        
        tbody tr:hover {
          background: #f5ede0;
        }
        
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        
        .item-description {
          font-size: 8px;
          color: #777;
          margin-top: 2px;
          line-height: 1.3;
        }
        
        .item-customization {
          font-size: 8px;
          color: #8B7355;
          font-weight: 600;
          margin-top: 3px;
          padding-top: 3px;
          border-top: 1px dashed #ccc;
        }
        
        .summary-section {
          margin: 20px 0;
          float: right;
          width: 280px;
        }
        
        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 6px 10px;
          font-size: 9px;
          border-bottom: 1px solid #e0e0e0;
        }
        
        .summary-row.total {
          background: #8B7355;
          color: white;
          font-weight: 900;
          border: none;
          padding: 10px;
          margin-top: 8px;
          font-size: 11px;
          border-radius: 2px;
        }
        
        .summary-row.gst {
          background: #f5f0e8;
          font-weight: 600;
        }
        
        .notes-section {
          clear: both;
          margin: 30px 0 20px 0;
          padding: 12px;
          background: #f5ede0;
          border-left: 3px solid #8B7355;
          font-size: 8px;
          color: #555;
          line-height: 1.5;
        }
        
        .terms-section {
          margin: 20px 0;
          padding: 12px;
          background: #faf8f3;
          border: 1px solid #ddd;
          font-size: 8px;
          color: #666;
          line-height: 1.5;
        }
        
        .footer-text {
          text-align: center;
          font-size: 8px;
          color: #999;
          margin-top: 15px;
          border-top: 1px solid #e0e0e0;
          padding-top: 10px;
        }
        
        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin: 15px 0;
        }
        
        .detail-box {
          background: #faf8f3;
          padding: 12px;
          border-radius: 4px;
          border: 1px solid #ddd;
        }
        
        .detail-box h4 {
          font-size: 9px;
          font-weight: 900;
          color: #8B7355;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
          border-bottom: 2px solid #8B7355;
          padding-bottom: 6px;
        }
        
        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
          font-size: 9px;
          color: #555;
          border-bottom: 1px solid #e0e0e0;
        }
        
        .detail-row:last-child {
          border-bottom: none;
        }
        
        .detail-row strong {
          color: #333;
          font-weight: 700;
        }
        
        .signature-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-top: 40px;
        }
        
        .signature-box {
          text-align: center;
          border-top: 1px solid #333;
          padding-top: 8px;
        }
        
        .signature-box .title {
          font-size: 9px;
          font-weight: 700;
          color: #333;
          margin-top: 4px;
        }
      </style>
    </head>
    <body>
      <!-- PAGE 1 -->
      <div class="page">
        <!-- Header -->
        <div class="header-section">
          <div class="company-header">
            <div class="company-name">${COMPANY_INFO.name}</div>
            <div class="company-tagline">${COMPANY_INFO.tagline}</div>
            <div class="company-details">
              ${COMPANY_INFO.address}<br>
              Phone: ${COMPANY_INFO.phone}<br>
              Email: ${COMPANY_INFO.email}<br>
              Website: ${COMPANY_INFO.website}
            </div>
          </div>
          <div class="invoice-header">
            <div class="invoice-title">TAX INVOICE</div>
            <div class="invoice-number">${order.orderId}</div>
          </div>
        </div>

        <!-- Invoice Meta -->
        <div class="meta-grid">
          <div class="meta-box">
            <div class="meta-label">Invoice Date</div>
            <div class="meta-value">${invoiceDateStr}</div>
          </div>
          <div class="meta-box">
            <div class="meta-label">Due Date</div>
            <div class="meta-value">${dueDateStr}</div>
          </div>
          <div class="meta-box">
            <div class="meta-label">Order Status</div>
            <div class="meta-value">${order.status?.toUpperCase() || 'PENDING'}</div>
          </div>
        </div>

        <!-- Address Section -->
        <div class="address-section">
          <div class="address-block">
            <div class="address-title">Ship To</div>
            <div class="address-text">
              <strong>${order.shippingAddress?.name || 'N/A'}</strong><br>
              ${order.shippingAddress?.address || ''}<br>
              ${order.shippingAddress?.city || ''}, ${order.shippingAddress?.pincode || ''}<br>
              Phone: ${order.shippingAddress?.phone || 'N/A'}<br>
              Email: ${order.shippingAddress?.email || 'N/A'}
            </div>
          </div>
          <div class="address-block">
            <div class="address-title">Payment Information</div>
            <div class="address-text">
              <strong>Payment Method:</strong> ${order.paymentMethod?.replace('_', ' ').toUpperCase() || 'N/A'}<br>
              <strong>Payment Status:</strong> ${order.paymentStatus?.toUpperCase() || 'PENDING'}<br>
              ${order.trackingNumber ? `<strong>Tracking No:</strong> ${order.trackingNumber}<br>` : ''}
              <strong>GSTIN:</strong> ${COMPANY_INFO.gstin}
            </div>
          </div>
        </div>

        <!-- Items Table -->
        <div class="items-section">
          <div class="section-title">Order Items</div>
          <table>
            <thead>
              <tr>
                <th style="width: 5%;">S.No</th>
                <th style="width: 40%;">Product Description</th>
                <th style="width: 10%;" class="text-center">Qty</th>
                <th style="width: 15%;" class="text-right">Unit Price</th>
                <th style="width: 15%;" class="text-right">HSN</th>
                <th style="width: 15%;" class="text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map((item, index) => {
                const lineTotal = (item.price + (item.customizationPrice || 0)) * item.quantity;
                const customText = item.customization ? [
                  item.customization.ringSize ? `Ring Size: ${item.customization.ringSize}` : '',
                  item.customization.engravingText ? `Engraving: "${item.customization.engravingText.substring(0, 20)}"` : '',
                  item.customization.selectedDiamond ? `Diamond: ${item.customization.selectedDiamond.carat}ct ${item.customization.selectedDiamond.color}/${item.customization.selectedDiamond.clarity}` : ''
                ].filter(Boolean).join(' | ') : '';
                
                return `
                  <tr>
                    <td class="text-center">${index + 1}</td>
                    <td>
                      <strong>${item.name}</strong>
                      ${item.description ? `<div class="item-description">${item.description}</div>` : ''}
                      ${customText ? `<div class="item-customization">${customText}</div>` : ''}
                    </td>
                    <td class="text-center">${item.quantity}</td>
                    <td class="text-right">₹${item.price.toLocaleString('en-IN')}</td>
                    <td class="text-right">7113</td>
                    <td class="text-right"><strong>₹${lineTotal.toLocaleString('en-IN')}</strong></td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>

        <!-- Summary -->
        <div class="summary-section">
          <div class="summary-row">
            <span>Subtotal (Exclusive of GST):</span>
            <span>₹${baseTotal.toLocaleString('en-IN')}</span>
          </div>
          ${customizationTotal > 0 ? `
          <div class="summary-row">
            <span>Customization:</span>
            <span>₹${customizationTotal.toLocaleString('en-IN')}</span>
          </div>
          ` : ''}
          <div class="summary-row gst">
            <span>CGST (1.5%):</span>
            <span>₹${cgst.toLocaleString('en-IN')}</span>
          </div>
          <div class="summary-row gst">
            <span>SGST (1.5%):</span>
            <span>₹${sgst.toLocaleString('en-IN')}</span>
          </div>
          <div class="summary-row total">
            <span>Total Amount Due</span>
            <span>₹${finalTotal.toLocaleString('en-IN')}</span>
          </div>
        </div>

        ${order.notes ? `
        <div class="notes-section">
          <strong>Special Instructions:</strong> ${order.notes}
        </div>
        ` : ''}

        <div class="terms-section">
          <strong>Terms & Conditions:</strong><br>
          • All jewelry items are carefully inspected before dispatch. • Colors may vary slightly due to photography. • Customization charges are non-refundable. • All items are covered under warranty. For warranty details, please refer to warranty certificate included with your order.
        </div>

        <div class="footer-text">
          Thank you for your business with Diamond Jewels | GST-Compliant Invoice - Computer Generated
        </div>
      </div>

      <!-- PAGE 2 -->
      <div class="page">
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="font-size: 18px; font-weight: 900; color: #8B7355; letter-spacing: 1px;">ORDER DETAILS & COMPANY INFORMATION</div>
          <div style="font-size: 9px; color: #666; margin-top: 5px;">Invoice #${order.orderId}</div>
        </div>

        <!-- Order Summary -->
        <div class="detail-grid">
          <div class="detail-box">
            <h4>Order Summary</h4>
            <div class="detail-row">
              <strong>Order ID:</strong>
              <span>${order.orderId}</span>
            </div>
            <div class="detail-row">
              <strong>Order Date:</strong>
              <span>${invoiceDateStr}</span>
            </div>
            <div class="detail-row">
              <strong>Due Date:</strong>
              <span>${dueDateStr}</span>
            </div>
            <div class="detail-row">
              <strong>Payment Method:</strong>
              <span>${order.paymentMethod?.replace('_', ' ').toUpperCase() || 'N/A'}</span>
            </div>
            <div class="detail-row">
              <strong>Payment Status:</strong>
              <span>${order.paymentStatus?.toUpperCase() || 'PENDING'}</span>
            </div>
            <div class="detail-row">
              <strong>Order Status:</strong>
              <span>${order.status?.toUpperCase() || 'PROCESSING'}</span>
            </div>
          </div>

          <div class="detail-box">
            <h4>Billing Address</h4>
            <div style="font-size: 9px; line-height: 1.6; color: #555;">
              <strong>${order.shippingAddress?.name || 'N/A'}</strong><br>
              ${order.shippingAddress?.address || 'N/A'}<br>
              ${order.shippingAddress?.city || ''}, ${order.shippingAddress?.pincode || ''}<br>
              <strong>Phone:</strong> ${order.shippingAddress?.phone || 'N/A'}<br>
              <strong>Email:</strong> ${order.shippingAddress?.email || 'N/A'}
            </div>
          </div>
        </div>

        <!-- Company Details -->
        <div class="detail-grid">
          <div class="detail-box">
            <h4>Company Details</h4>
            <div class="detail-row">
              <strong>Business Name:</strong>
              <span>${COMPANY_INFO.name}</span>
            </div>
            <div class="detail-row">
              <strong>GSTIN:</strong>
              <span>${COMPANY_INFO.gstin}</span>
            </div>
            <div class="detail-row">
              <strong>PAN:</strong>
              <span>${COMPANY_INFO.pan}</span>
            </div>
            <div class="detail-row">
              <strong>CIN:</strong>
              <span>${COMPANY_INFO.cin}</span>
            </div>
            <div class="detail-row">
              <strong>Phone:</strong>
              <span>${COMPANY_INFO.phone}</span>
            </div>
            <div class="detail-row">
              <strong>Email:</strong>
              <span>${COMPANY_INFO.email}</span>
            </div>
          </div>

          <div class="detail-box">
            <h4>Bank Details</h4>
            <div class="detail-row">
              <strong>Bank Name:</strong>
              <span>${COMPANY_INFO.bankName}</span>
            </div>
            <div class="detail-row">
              <strong>Branch:</strong>
              <span>${COMPANY_INFO.bankBranch}</span>
            </div>
            <div class="detail-row">
              <strong>Account No:</strong>
              <span>${COMPANY_INFO.accountNo}</span>
            </div>
            <div class="detail-row">
              <strong>IFSC Code:</strong>
              <span>${COMPANY_INFO.ifscCode}</span>
            </div>
            <div class="detail-row">
              <strong>Account Holder:</strong>
              <span>${COMPANY_INFO.accountHolder}</span>
            </div>
          </div>
        </div>

        <!-- Price Breakdown -->
        <div class="detail-box" style="margin: 20px 0;">
          <h4>Price Breakdown</h4>
          <div class="detail-row">
            <strong>Product Subtotal:</strong>
            <span>₹${baseTotal.toLocaleString('en-IN')}</span>
          </div>
          ${customizationTotal > 0 ? `
          <div class="detail-row">
            <strong>Customization Charges:</strong>
            <span>₹${customizationTotal.toLocaleString('en-IN')}</span>
          </div>
          ` : ''}
          <div class="detail-row" style="background: #f5ede0; padding: 6px; margin: 6px -12px -6px -12px;">
            <strong>Taxable Amount:</strong>
            <span>₹${(baseTotal + customizationTotal).toLocaleString('en-IN')}</span>
          </div>
          <div class="detail-row">
            <strong>CGST @ 1.5%:</strong>
            <span>₹${cgst.toLocaleString('en-IN')}</span>
          </div>
          <div class="detail-row">
            <strong>SGST @ 1.5%:</strong>
            <span>₹${sgst.toLocaleString('en-IN')}</span>
          </div>
          <div class="detail-row" style="background: #8B7355; color: white; font-weight: 900; padding: 8px; margin: 8px -12px -12px -12px;">
            <strong>Total Amount (Incl. 3% GST):</strong>
            <span>₹${finalTotal.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div style="text-align: center; font-size: 8px; color: #999; margin-top: 20px; border-top: 1px solid #e0e0e0; padding-top: 10px;">
          <p>This is a computer-generated invoice and does not require a signature or seal.</p>
          <p>Generated on ${new Date().toLocaleString('en-IN')} | ${COMPANY_INFO.website}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const element = document.createElement('div');
  element.innerHTML = htmlContent;

  const opt = {
    margin: [8, 8, 8, 8] as [number, number, number, number],
    filename: `Invoice_${order.orderId}.pdf`,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
    pagebreak: { mode: ['css', 'legacy'] },
  };

  html2pdf().set(opt).from(element).save();
};

export const downloadPDF = async (orderId: string) => {
  try {
    const blob = await apiClient.blob(`/orders/download/${orderId}`);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${orderId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('PDF download error:', error);
    throw error;
  }
};
