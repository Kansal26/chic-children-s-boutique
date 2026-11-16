import React from "react";
import { Order, ORDER_STATUS_LABELS } from "@/lib/orders";
import { formatPrice } from "@/data/catalog";

// Crisp SVG Barcode generator for thermal shipping labels & invoices
export function BarcodeSvg({ value, height = 48, className = "" }: { value: string; height?: number; className?: string }) {
  // Deterministic bar widths based on char codes for realistic visual barcode
  const bars: { width: number; isBlack: boolean }[] = [];
  let seed = 0;
  for (let i = 0; i < value.length; i++) {
    seed += value.charCodeAt(i) * (i + 1);
  }

  // Quiet zone at start
  bars.push({ width: 4, isBlack: false });
  // Start pattern
  bars.push({ width: 2, isBlack: true }, { width: 1, isBlack: false }, { width: 2, isBlack: true }, { width: 1, isBlack: false });

  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    const pattern = [(code % 3) + 1, ((code >> 1) % 2) + 1, ((code >> 2) % 3) + 1, 1, ((code >> 3) % 2) + 1];
    pattern.forEach((w, idx) => {
      bars.push({ width: w * 1.5, isBlack: idx % 2 === 0 });
    });
  }

  // Stop pattern
  bars.push({ width: 2, isBlack: true }, { width: 1, isBlack: false }, { width: 3, isBlack: true });
  // Quiet zone at end
  bars.push({ width: 4, isBlack: false });

  const totalWidth = bars.reduce((acc, b) => acc + b.width, 0);

  let currentX = 0;
  return (
    <svg
      viewBox={`0 0 ${totalWidth} ${height}`}
      className={`w-full max-w-[280px] h-auto ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      {bars.map((bar, i) => {
        const x = currentX;
        currentX += bar.width;
        if (!bar.isBlack) return null;
        return <rect key={i} x={x} y={0} width={bar.width} height={height} fill="black" />;
      })}
    </svg>
  );
}

// -------------------------------------------------------------
// 1. TAX INVOICE / BILL COMPONENT
// -------------------------------------------------------------
export function OrderInvoiceView({ order }: { order: Order }) {
  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-white text-slate-900 p-8 max-w-3xl mx-auto border shadow-sm font-sans text-sm rounded-lg print:border-none print:shadow-none print:p-4 print:max-w-none print:w-full">
      {/* Top Header */}
      <div className="flex justify-between items-start border-b pb-6 mb-6">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-slate-900">MAISON PETIT</h1>
          <p className="text-xs uppercase tracking-widest text-slate-500 font-sans mt-0.5">Haute Couture Children's Atelier</p>
          <div className="mt-3 text-xs text-slate-500 space-y-0.5 leading-relaxed">
            <p>18 Rue Royale, 75008 Paris, France</p>
            <p>VAT Reg: FR 82 918 204 892 • SIRET: 918 204 892 00012</p>
            <p>contact@maisonpetit.com • +33 (0) 1 42 68 55 00</p>
          </div>
        </div>

        <div className="text-right">
          <div className="inline-block bg-slate-900 text-white text-[11px] font-bold tracking-wider px-3 py-1 uppercase rounded">
            TAX INVOICE
          </div>
          <div className="mt-3 space-y-1 text-xs">
            <p className="font-semibold text-slate-800 text-sm">Invoice #: INV-{order.orderNumber.replace("MP-", "")}</p>
            <p className="text-slate-500">Order Ref: <span className="font-mono font-medium text-slate-700">{order.orderNumber}</span></p>
            <p className="text-slate-500">Date: {formattedDate}</p>
            <p className="text-slate-500">Status: <span className="font-semibold uppercase text-emerald-700">{order.paymentStatus}</span></p>
          </div>
        </div>
      </div>

      {/* Addresses */}
      <div className="grid grid-cols-2 gap-8 mb-8 text-xs">
        <div className="bg-slate-50 p-4 rounded-md border border-slate-100">
          <h3 className="font-semibold uppercase text-slate-500 tracking-wider text-[10px] mb-2">Billed To</h3>
          <p className="font-bold text-slate-900 text-sm">{order.customer.name}</p>
          <p className="text-slate-600 mt-1">{order.customer.shippingAddress.street}</p>
          {order.customer.shippingAddress.apartment && <p className="text-slate-600">{order.customer.shippingAddress.apartment}</p>}
          <p className="text-slate-600">
            {order.customer.shippingAddress.postalCode} {order.customer.shippingAddress.city}, {order.customer.shippingAddress.country}
          </p>
          <p className="text-slate-500 mt-2">{order.customer.email} • {order.customer.phone}</p>
        </div>

        <div className="bg-slate-50 p-4 rounded-md border border-slate-100">
          <h3 className="font-semibold uppercase text-slate-500 tracking-wider text-[10px] mb-2">Shipping Details</h3>
          <p className="font-bold text-slate-900 text-sm">{order.customer.name}</p>
          <p className="text-slate-600 mt-1">{order.customer.shippingAddress.street}</p>
          {order.customer.shippingAddress.apartment && <p className="text-slate-600">{order.customer.shippingAddress.apartment}</p>}
          <p className="text-slate-600">
            {order.customer.shippingAddress.postalCode} {order.customer.shippingAddress.city}, {order.customer.shippingAddress.country}
          </p>
          <p className="text-slate-500 mt-2">
            Carrier: <span className="font-medium text-slate-700">{order.shippingCarrier || "Standard Courier"}</span>
          </p>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full text-xs mb-6 border-collapse">
        <thead>
          <tr className="border-b-2 border-slate-800 text-slate-700 font-semibold text-left">
            <th className="py-2.5">Item Description</th>
            <th className="py-2.5">SKU</th>
            <th className="py-2.5">Variant</th>
            <th className="py-2.5 text-center">Qty</th>
            <th className="py-2.5 text-right">Unit Price</th>
            <th className="py-2.5 text-right">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {order.items.map((item) => (
            <tr key={item.id} className="text-slate-700">
              <td className="py-3 font-medium text-slate-900 pr-2">
                {item.productName}
              </td>
              <td className="py-3 font-mono text-slate-500 text-[11px]">{item.sku}</td>
              <td className="py-3 text-slate-600">
                {item.size} {item.color ? `• ${item.color}` : ""}
              </td>
              <td className="py-3 text-center font-medium">{item.quantity}</td>
              <td className="py-3 text-right">{formatPrice(item.price)}</td>
              <td className="py-3 text-right font-medium text-slate-900">
                {formatPrice(item.price * item.quantity)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary calculation */}
      <div className="flex justify-between items-start border-t border-slate-200 pt-4 mb-8">
        <div className="w-1/2 text-xs text-slate-500 space-y-1">
          <p className="font-semibold text-slate-700">Payment Information:</p>
          <p>Method: {order.paymentMethod}</p>
          <p>Payment Status: <span className="capitalize text-emerald-600 font-medium">{order.paymentStatus}</span></p>
          {order.notes && (
            <div className="mt-3 p-2 bg-amber-50/60 border border-amber-200 rounded text-amber-900 text-[11px]">
              <span className="font-semibold">Order Note:</span> {order.notes}
            </div>
          )}
        </div>

        <div className="w-1/3 text-xs space-y-2">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal:</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-600">
              <span>Promo Discount:</span>
              <span>-{formatPrice(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-600">
            <span>Shipping & Handling:</span>
            <span>{formatPrice(order.shipping)}</span>
          </div>
          <div className="flex justify-between text-slate-500 text-[11px]">
            <span>Included VAT (20%):</span>
            <span>{formatPrice(order.tax)}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-800 pt-2">
            <span>Total Paid:</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 pt-4 text-center text-[10px] text-slate-400 space-y-1">
        <p className="font-medium text-slate-600">Thank you for curating your child's wardrobe with Maison Petit.</p>
        <p>All items are crafted with certified hypoallergenic organic materials. Returns accepted within 14 days of receipt.</p>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 2. THERMAL SHIPPING LABEL (STANDARD 4x6 / COURIER SPEC)
// -------------------------------------------------------------
export function OrderShippingLabelView({ order }: { order: Order }) {
  const carrier = order.shippingCarrier || "DHL Express Worldwide";
  const tracking = order.trackingNumber || `MP-${order.orderNumber.replace("MP-", "")}89284`;
  const shipDate = new Date(order.createdAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className="bg-white text-black p-6 w-[380px] min-h-[560px] mx-auto border-2 border-black font-sans text-xs rounded-none shadow-sm print:border-2 print:border-black print:shadow-none print:m-0 print:p-4">
      {/* Carrier Header */}
      <div className="flex justify-between items-center border-b-4 border-black pb-3">
        <div>
          <span className="text-xl font-black tracking-tighter uppercase font-mono">{carrier.split(" ")[0]}</span>
          <span className="text-[10px] font-bold block uppercase tracking-wider">{carrier.split(" ").slice(1).join(" ") || "EXPRESS"}</span>
        </div>
        <div className="text-right">
          <div className="border-2 border-black px-2 py-0.5 text-xs font-black uppercase">
            PRIORITY PARCEL
          </div>
          <span className="text-[10px] block mt-0.5 text-slate-600">ZONE 1 - EU/INTL</span>
        </div>
      </div>

      {/* Routing code & Ship Date */}
      <div className="flex justify-between items-center border-b-2 border-black py-2 font-mono text-[11px]">
        <div>
          <span className="text-slate-500 text-[9px] block">SHIP DATE</span>
          <span className="font-bold">{shipDate}</span>
        </div>
        <div>
          <span className="text-slate-500 text-[9px] block">ACTUAL WT</span>
          <span className="font-bold">1.25 KG</span>
        </div>
        <div className="text-right">
          <span className="text-slate-500 text-[9px] block">ROUTING</span>
          <span className="font-black text-sm">PAR-CDG-EXP</span>
        </div>
      </div>

      {/* Shipper (From) */}
      <div className="border-b-2 border-black py-2 text-[10px] leading-tight">
        <span className="text-slate-500 uppercase tracking-widest text-[8px] font-bold block">SHIP FROM:</span>
        <p className="font-bold uppercase">MAISON PETIT ATELIER / LOGISTICS</p>
        <p>18 RUE ROYALE, 75008 PARIS, FRANCE</p>
        <p>TEL: +33 1 42 68 55 00</p>
      </div>

      {/* Recipient (To) - Large display for delivery driver */}
      <div className="border-b-4 border-black py-3 space-y-1">
        <span className="text-slate-500 uppercase tracking-widest text-[9px] font-bold block">DELIVER TO:</span>
        <p className="text-base font-black uppercase tracking-tight">{order.customer.name}</p>
        <p className="text-xs font-semibold">{order.customer.shippingAddress.street}</p>
        {order.customer.shippingAddress.apartment && (
          <p className="text-xs font-semibold">{order.customer.shippingAddress.apartment}</p>
        )}
        <p className="text-sm font-black uppercase">
          {order.customer.shippingAddress.postalCode} {order.customer.shippingAddress.city}
        </p>
        <p className="text-xs font-bold uppercase">{order.customer.shippingAddress.country}</p>
        <p className="text-[11px] font-mono mt-1 text-slate-700">TEL: {order.customer.phone}</p>
      </div>

      {/* Barcode & Tracking section */}
      <div className="py-4 flex flex-col items-center justify-center border-b-2 border-black">
        <BarcodeSvg value={tracking.replace(/[^A-Za-z0-9]/g, "")} height={52} className="w-full" />
        <p className="font-mono text-sm font-black tracking-widest mt-1 uppercase">{tracking}</p>
        <span className="text-[9px] text-slate-500 uppercase">CARRIER TRACKING NUMBER</span>
      </div>

      {/* Order Reference barcode & item summary */}
      <div className="pt-2 text-[10px] space-y-1.5">
        <div className="flex justify-between items-center">
          <span className="font-bold">ORDER REF: {order.orderNumber}</span>
          <span>ITEMS: {order.items.reduce((s, i) => s + i.quantity, 0)} PCS</span>
        </div>
        <div className="bg-slate-100 p-1.5 text-[9px] font-mono rounded border border-slate-300">
          CONTENTS: LUXURY CHILDREN'S WEAR ({order.items.map(i => `${i.quantity}x ${i.productName.slice(0, 16)}`).join(", ")})
        </div>
        <div className="flex justify-between text-[9px] text-slate-500 pt-1">
          <span>SERVICE: SIGNATURE REQUIRED</span>
          <span>DISPATCH DEPT: 04</span>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 3. SEAMLESS PRINT TRIGGER
// -------------------------------------------------------------
export function triggerDirectPrint(type: "bill" | "label", order: Order) {
  const printWindow = window.open("", "_blank", "width=850,height=950");
  if (!printWindow) {
    alert("Please allow popups to print invoices and shipping labels.");
    return;
  }

  const isLabel = type === "label";
  const docTitle = isLabel ? `Shipping_Label_${order.orderNumber}` : `Invoice_${order.orderNumber}`;

  const carrier = order.shippingCarrier || "DHL Express Worldwide";
  const tracking = order.trackingNumber || `MP-${order.orderNumber.replace("MP-", "")}89284`;
  const shipDate = new Date(order.createdAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${docTitle}</title>
        <meta charset="utf-8" />
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background: #fff;
            color: #111;
            padding: 24px;
          }
          @page {
            size: ${isLabel ? "4in 6in" : "A4 portrait"};
            margin: ${isLabel ? "0.2in" : "15mm"};
          }
          @media print {
            body { padding: 0; }
            .no-print { display: none !important; }
          }
          .btn-print {
            background: #0f172a;
            color: white;
            padding: 8px 16px;
            font-size: 13px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            margin-bottom: 20px;
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="text-align: right; margin-bottom: 16px;">
          <button class="btn-print" onclick="window.print()">🖨️ Print Now</button>
        </div>
        ${
          isLabel
            ? `
            <div style="width: 360px; margin: 0 auto; border: 2px solid #000; padding: 16px; font-size: 11px;">
              <div style="display: flex; justify-content: space-between; border-bottom: 3px solid #000; padding-bottom: 8px;">
                <div>
                  <h1 style="font-size: 20px; font-weight: 900; margin: 0; font-family: monospace;">${carrier.split(" ")[0]}</h1>
                  <span style="font-size: 9px; font-weight: bold; text-transform: uppercase;">${carrier.split(" ").slice(1).join(" ") || "EXPRESS"}</span>
                </div>
                <div style="text-align: right;">
                  <div style="border: 2px solid #000; padding: 2px 6px; font-weight: 900; font-size: 11px;">PRIORITY PARCEL</div>
                  <div style="font-size: 9px; color: #555;">ZONE 1 - EU/INTL</div>
                </div>
              </div>

              <div style="display: flex; justify-content: space-between; border-bottom: 1.5px solid #000; padding: 6px 0; font-family: monospace; font-size: 10px;">
                <div><span style="font-size: 8px; color: #666; display: block;">SHIP DATE</span><b>${shipDate}</b></div>
                <div><span style="font-size: 8px; color: #666; display: block;">WEIGHT</span><b>1.25 KG</b></div>
                <div style="text-align: right;"><span style="font-size: 8px; color: #666; display: block;">ROUTING</span><b style="font-size: 12px;">PAR-CDG-EXP</b></div>
              </div>

              <div style="border-bottom: 1.5px solid #000; padding: 6px 0; font-size: 9.5px; line-height: 1.3;">
                <span style="font-size: 8px; color: #666; text-transform: uppercase; font-weight: bold;">SHIP FROM:</span><br/>
                <b>MAISON PETIT ATELIER</b><br/>
                18 Rue Royale, 75008 Paris, France<br/>
                Tel: +33 1 42 68 55 00
              </div>

              <div style="border-bottom: 3px solid #000; padding: 10px 0; line-height: 1.4;">
                <span style="font-size: 8px; color: #666; text-transform: uppercase; font-weight: bold;">DELIVER TO:</span><br/>
                <b style="font-size: 15px; text-transform: uppercase;">${order.customer.name}</b><br/>
                <b>${order.customer.shippingAddress.street}</b><br/>
                ${order.customer.shippingAddress.apartment ? `<b>${order.customer.shippingAddress.apartment}</b><br/>` : ""}
                <b style="font-size: 13px; text-transform: uppercase;">${order.customer.shippingAddress.postalCode} ${order.customer.shippingAddress.city}</b><br/>
                <b style="text-transform: uppercase;">${order.customer.shippingAddress.country}</b><br/>
                <span style="font-family: monospace; font-size: 10px;">TEL: ${order.customer.phone}</span>
              </div>

              <div style="padding: 16px 0 10px; text-align: center; border-bottom: 1.5px solid #000;">
                <div style="letter-spacing: 2px; font-family: monospace; font-size: 32px; font-weight: 900; line-height: 0.8; margin-bottom: 6px;">|||| | ||| |||| | ||||| ||</div>
                <div style="font-family: monospace; font-size: 13px; font-weight: 900; letter-spacing: 1.5px;">${tracking}</div>
                <div style="font-size: 8px; color: #666; text-transform: uppercase;">TRACKING NUMBER</div>
              </div>

              <div style="padding-top: 8px; font-size: 9.5px; display: flex; justify-content: space-between;">
                <b>REF: ${order.orderNumber}</b>
                <span>ITEMS: ${order.items.reduce((s, i) => s + i.quantity, 0)} PCS</span>
              </div>
            </div>
            `
            : `
            <div style="max-width: 720px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; padding: 32px;">
              <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #cbd5e1; padding-bottom: 20px; margin-bottom: 24px;">
                <div>
                  <h1 style="font-family: Georgia, serif; font-size: 26px; font-weight: bold; margin: 0; color: #0f172a;">MAISON PETIT</h1>
                  <div style="font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #64748b; margin-top: 2px;">Haute Couture Children's Atelier</div>
                  <div style="font-size: 11px; color: #64748b; margin-top: 10px; line-height: 1.5;">
                    18 Rue Royale, 75008 Paris, France<br/>
                    VAT: FR 82 918 204 892 • SIRET: 918 204 892 00012<br/>
                    contact@maisonpetit.com
                  </div>
                </div>
                <div style="text-align: right;">
                  <div style="background: #0f172a; color: white; display: inline-block; padding: 4px 10px; font-size: 11px; font-weight: bold; letter-spacing: 1px; border-radius: 4px;">TAX INVOICE</div>
                  <div style="font-size: 12px; margin-top: 10px; line-height: 1.6;">
                    <b>Invoice #:</b> INV-${order.orderNumber.replace("MP-", "")}<br/>
                    <b>Order Ref:</b> ${order.orderNumber}<br/>
                    <b>Date:</b> ${formattedDate}<br/>
                    <b>Payment:</b> <span style="color: #059669; font-weight: bold; text-transform: uppercase;">${order.paymentStatus}</span>
                  </div>
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 28px; font-size: 11.5px;">
                <div style="background: #f8fafc; padding: 14px; border-radius: 6px; border: 1px solid #f1f5f9;">
                  <div style="font-size: 9px; text-transform: uppercase; font-weight: bold; letter-spacing: 1px; color: #64748b; margin-bottom: 6px;">Billed & Shipped To</div>
                  <b style="font-size: 13px; color: #0f172a;">${order.customer.name}</b><br/>
                  ${order.customer.shippingAddress.street}<br/>
                  ${order.customer.shippingAddress.apartment ? `${order.customer.shippingAddress.apartment}<br/>` : ""}
                  ${order.customer.shippingAddress.postalCode} ${order.customer.shippingAddress.city}, ${order.customer.shippingAddress.country}<br/>
                  <span style="color: #64748b;">${order.customer.email} • ${order.customer.phone}</span>
                </div>

                <div style="background: #f8fafc; padding: 14px; border-radius: 6px; border: 1px solid #f1f5f9;">
                  <div style="font-size: 9px; text-transform: uppercase; font-weight: bold; letter-spacing: 1px; color: #64748b; margin-bottom: 6px;">Dispatch Details</div>
                  <b>Carrier:</b> ${order.shippingCarrier || "Standard Delivery"}<br/>
                  <b>Tracking:</b> ${order.trackingNumber || "Assigned upon handover"}<br/>
                  <b>Payment Method:</b> ${order.paymentMethod}<br/>
                  ${order.notes ? `<b>Special Notes:</b> ${order.notes}` : ""}
                </div>
              </div>

              <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 24px;">
                <thead>
                  <tr style="border-bottom: 2px solid #0f172a; text-align: left; color: #334155;">
                    <th style="padding: 8px 4px;">Item Description</th>
                    <th style="padding: 8px 4px;">SKU</th>
                    <th style="padding: 8px 4px;">Variant</th>
                    <th style="padding: 8px 4px; text-align: center;">Qty</th>
                    <th style="padding: 8px 4px; text-align: right;">Unit Price</th>
                    <th style="padding: 8px 4px; text-align: right;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${order.items
                    .map(
                      (item) => `
                    <tr style="border-bottom: 1px solid #f1f5f9;">
                      <td style="padding: 10px 4px; font-weight: 600; color: #0f172a;">${item.productName}</td>
                      <td style="padding: 10px 4px; font-family: monospace; color: #64748b; font-size: 11px;">${item.sku}</td>
                      <td style="padding: 10px 4px; color: #475569;">${item.size} ${item.color ? `• ${item.color}` : ""}</td>
                      <td style="padding: 10px 4px; text-align: center; font-weight: 600;">${item.quantity}</td>
                      <td style="padding: 10px 4px; text-align: right;">${formatPrice(item.price)}</td>
                      <td style="padding: 10px 4px; text-align: right; font-weight: 600; color: #0f172a;">${formatPrice(item.price * item.quantity)}</td>
                    </tr>
                  `
                    )
                    .join("")}
                </tbody>
              </table>

              <div style="display: flex; justify-content: flex-end; margin-bottom: 32px;">
                <div style="width: 260px; font-size: 12px; line-height: 1.8;">
                  <div style="display: flex; justify-content: space-between; color: #475569;">
                    <span>Subtotal:</span>
                    <span>${formatPrice(order.subtotal)}</span>
                  </div>
                  ${
                    order.discount > 0
                      ? `
                    <div style="display: flex; justify-content: space-between; color: #059669;">
                      <span>Discount:</span>
                      <span>-${formatPrice(order.discount)}</span>
                    </div>`
                      : ""
                  }
                  <div style="display: flex; justify-content: space-between; color: #475569;">
                    <span>Shipping:</span>
                    <span>${formatPrice(order.shipping)}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; color: #64748b; font-size: 11px;">
                    <span>Included Tax (VAT):</span>
                    <span>${formatPrice(order.tax)}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; border-top: 2px solid #0f172a; padding-top: 6px; font-size: 15px; font-weight: bold; color: #0f172a; margin-top: 4px;">
                    <span>Total Paid:</span>
                    <span>${formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>

              <div style="border-top: 1px solid #cbd5e1; padding-top: 16px; text-align: center; font-size: 10px; color: #94a3b8; line-height: 1.5;">
                Thank you for curating your child's wardrobe with Maison Petit.<br/>
                All items are crafted with certified hypoallergenic organic materials. Returns accepted within 14 days of receipt.
              </div>
            </div>
            `
        }
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
