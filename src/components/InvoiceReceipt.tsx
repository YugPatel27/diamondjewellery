import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, CheckCircle, Download } from 'lucide-react';
import { orderAPI } from '@/lib/api';
import { generateOrderPDF } from '@/lib/pdfGenerator';
import { toast } from 'sonner';

const InvoiceReceipt = ({ order }) => {
  const invoiceRef = useRef(null);
  const [copied, setCopied] = React.useState(false);
  const [downloadingPDF, setDownloadingPDF] = React.useState(false);

  // Store information
  const storeInfo = {
    name: 'DIAMOND JEWELS',
    tagline: 'Inspired by the beauty of natural light and luxury',
    address: '# 5-50, 3rd Cross PTC Building, I.T. Estate, New Delhi - 135800',
    phone: '+91-9856890000',
    email: 'info@diamondjewels.in',
    gst: 'GJ3AQ5067K2XXXX',
    panNo: 'PANXXXXXXXX'
  };

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // Use GST and finalTotal from order (calculated on backend with 18% GST)
  const totalGST = order.gst || 0;
  const finalTotal = order.finalTotal || (order.totalPrice + totalGST);
  const customizationTotal = order.items?.reduce((sum, item) => {
    return sum + ((item.customizationPrice || 0) * item.quantity);
  }, 0) || 0;
  const estimatedDelivery = new Date(order.createdAt);
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

  // Copy order ID
  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(order.orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download PDF
  const handleDownloadPDF = async () => {
    setDownloadingPDF(true);
    try {
      await generateOrderPDF(order);
      toast.success('Invoice download started');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate invoice PDF');
    } finally {
      setDownloadingPDF(false);
    }
  };

  return (
    <div className="w-full">
      {/* Action Buttons */}
      <div className="flex gap-3 mb-6 print:hidden flex-wrap">
        <Button
          onClick={handleCopyOrderId}
          variant="outline"
          className="flex items-center gap-2"
        >
          {copied ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy Order ID
            </>
          )}
        </Button>
        <Button
          onClick={() => window.print()}
          variant="outline"
        >
          Print Invoice
        </Button>
        <Button
          onClick={handleDownloadPDF}
          disabled={downloadingPDF}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          {downloadingPDF ? 'Downloading...' : 'Download PDF'}
        </Button>
      </div>

      {/* Invoice Container */}
      <div
        ref={invoiceRef}
        className="bg-white p-12 max-w-4xl mx-auto"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Ctext x='50%' y='50%' text-anchor='middle' dominant-baseline='middle' font-size='80' font-weight='bold' opacity='0.05' transform='rotate(-45 200 200)' font-family='Arial, sans-serif'%3E${storeInfo.name}%3C/text%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundAttachment: 'fixed',
          minHeight: '1100px'
        }}
      >
        {/* Header */}
        <div className="border-b-4 border-amber-700 pb-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-amber-900">{storeInfo.name}</h1>
              <p className="text-sm text-gray-800 italic">{storeInfo.tagline}</p>
              <p className="text-sm text-gray-900 mt-2">{storeInfo.address}</p>
              <div className="text-sm text-gray-900 mt-2 space-y-1">
                <p>Contact: {storeInfo.phone} | {storeInfo.email}</p>
                <p>GST: {storeInfo.gst} | PAN: {storeInfo.panNo}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-amber-50 border-2 border-amber-700 p-4 rounded">
                <p className="text-xs font-semibold text-amber-900">TAX INVOICE</p>
                <p className="text-lg font-bold text-amber-900 mt-2">{order.orderId}</p>
                <p className="text-xs text-gray-800 mt-2">Invoice Date</p>
                <p className="text-sm font-semibold">{formatDate(order.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bill To and Order Info */}
        <div className="grid grid-cols-2 gap-8 mb-8 border-b pb-6">
          <div>
            <h3 className="font-bold text-sm text-amber-900 mb-3 uppercase tracking-wider">Bill To</h3>
            <div className="text-sm space-y-1 text-gray-800">
              <p className="font-semibold">{order.shippingAddress?.name}</p>
              <p>{order.shippingAddress?.address}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.pincode}</p>
              <p>Phone: {order.shippingAddress?.phone}</p>
              <p>Email: {order.shippingAddress?.email}</p>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-sm text-amber-900 mb-3 uppercase tracking-wider">Order Details</h3>
            <div className="text-sm space-y-2 text-gray-800">
              <div className="flex justify-between">
                <span>Payment Mode:</span>
                <span className="font-semibold capitalize">{order.paymentMethod?.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span>Order Status:</span>
                <span className="font-semibold capitalize px-2 py-1 bg-yellow-100 rounded text-yellow-800">
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Est. Delivery:</span>
                <span className="font-semibold">{formatDate(estimatedDelivery)}</span>
              </div>
              {order.trackingNumber && (
                <div className="flex justify-between">
                  <span>Tracking:</span>
                  <span className="font-semibold">{order.trackingNumber}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-amber-900 text-white">
                <th className="border border-amber-900 p-3 text-left">S.No</th>
                <th className="border border-amber-900 p-3 text-left">Jewelry Description</th>
                <th className="border border-amber-900 p-3 text-center">Quantity</th>
                <th className="border border-amber-900 p-3 text-right">Unit Price</th>
                <th className="border border-amber-900 p-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items &&
                order.items.map((item, index) => {
                  const customCharge = (item.customizationPrice || 0) * item.quantity;
                  return (
                    <tr key={index} className="hover:bg-amber-50">
                      <td className="border border-gray-300 p-3">{index + 1}</td>
                      <td className="border border-gray-300 p-3">
                        <div className="font-semibold text-gray-900">{item.name}</div>
                        <div className="text-xs text-gray-800 mt-1">{item.description}</div>
                        {item.customization && (
                          <div className="text-xs text-amber-900 mt-2 space-y-1">
                            {item.customization.ringSize && <div>Ring Size: {item.customization.ringSize}</div>}
                            {item.customization.engravingText && (
                              <div>Engraving: "{item.customization.engravingText}"</div>
                            )}
                            {item.customization.selectedDiamond && (
                              <div>
                                Diamond: {item.customization.selectedDiamond.carat}ct {item.customization.selectedDiamond.color}/{item.customization.selectedDiamond.clarity} - {formatCurrency(item.customization.selectedDiamond.price)}
                              </div>
                            )}
                            {item.customizationPrice ? (
                              <div>Customization Charge: {formatCurrency(item.customizationPrice)} per unit</div>
                            ) : null}
                          </div>
                        )}
                      </td>
                      <td className="border border-gray-300 p-3 text-center font-semibold">
                        {item.quantity}
                      </td>
                      <td className="border border-gray-300 p-3 text-right">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="border border-gray-300 p-3 text-right font-semibold">
                        {formatCurrency(item.price * item.quantity)}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* Summary and Bank Details */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Summary */}
          <div>
            <h3 className="font-bold text-sm text-amber-900 mb-4 uppercase tracking-wider">Our Bank Details</h3>
            <div className="bg-gray-50 border border-gray-300 p-4 rounded text-sm space-y-2">
              <div className="flex justify-between">
                <span className="font-semibold">Bank Name:</span>
                <span>STATE BANK OF INDIA</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Branch:</span>
                <span>Delhi</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Account No.:</span>
                <span>20412XXXXXX5</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">IFSC Code:</span>
                <span>SBIN003XXXX</span>
              </div>
            </div>
          </div>

          {/* Totals */}
          <div>
            <h3 className="font-bold text-sm text-amber-900 mb-4 uppercase tracking-wider">Summary</h3>
            <div className="space-y-2 text-sm border-t-2 border-amber-700 pt-3">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold">{formatCurrency(order.totalPrice - customizationTotal)}</span>
              </div>
              {customizationTotal > 0 && (
                <div className="flex justify-between">
                  <span>Customization Charges:</span>
                  <span className="font-semibold">{formatCurrency(customizationTotal)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>GST (3%):</span>
                <span className="font-semibold">{formatCurrency(totalGST)}</span>
              </div>
              <div className="flex justify-between border-t-2 border-amber-700 pt-2 mt-2 text-base font-bold text-amber-900">
                <span>TOTAL AMOUNT:</span>
                <span>{formatCurrency(finalTotal)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-4 border-amber-700 pt-6 text-center text-xs text-gray-800">
          <p className="mb-2">
            <span className="font-semibold">Terms & Conditions:</span> This invoice is valid for the products mentioned above.
          </p>
          <p className="mb-4">
            Thank you for your business with us! For queries, contact us at {storeInfo.phone}
          </p>
          <div className="flex justify-between items-end mt-8 pt-4 border-t">
            <div className="text-center">
              <p className="font-semibold text-gray-900 mb-2">Authorized Signature</p>
              <p className="text-xs text-gray-800 mt-4">For {storeInfo.name}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-800 italic">Invoice Generated Date: {formatDate(new Date())}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceReceipt;
