import React, { useState } from "react";
import {
  Order,
  OrderStatus,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  orderStore,
} from "@/lib/orders";
import { formatPrice } from "@/data/catalog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Printer,
  FileText,
  Tag,
  Truck,
  User,
  MapPin,
  CreditCard,
  Clock,
  CheckCircle2,
  Package,
  Calendar,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";

interface OrderDetailDialogProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenPrint: (order: Order, docType: "bill" | "label") => void;
}

export function OrderDetailDialog({
  order,
  isOpen,
  onClose,
  onOpenPrint,
}: OrderDetailDialogProps) {
  if (!order) return null;

  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(order.status);
  const [carrier, setCarrier] = useState(order.shippingCarrier || "DHL Express");
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || "");
  const [statusNote, setStatusNote] = useState("");

  // Keep state synced if order prop changes
  React.useEffect(() => {
    if (order) {
      setCurrentStatus(order.status);
      setCarrier(order.shippingCarrier || "DHL Express");
      setTrackingNumber(order.trackingNumber || "");
      setStatusNote("");
    }
  }, [order]);

  const handleUpdateStatus = () => {
    if (currentStatus !== order.status || statusNote.trim()) {
      orderStore.updateStatus(order.id, currentStatus, statusNote.trim() || undefined);
    }
    if (carrier !== order.shippingCarrier || trackingNumber !== order.trackingNumber) {
      orderStore.updateTracking(order.id, carrier, trackingNumber);
    }
    toast.success(`Order ${order.orderNumber} updated successfully!`);
    onClose();
  };

  const statusStyle = ORDER_STATUS_COLORS[order.status];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[92vh] flex flex-col p-0 overflow-hidden bg-slate-50">
        {/* Header */}
        <div className="p-6 bg-white border-b flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-3">
              <DialogTitle className="text-2xl font-bold font-serif tracking-tight text-slate-900">
                {order.orderNumber}
              </DialogTitle>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusStyle.badge}`}
              >
                {ORDER_STATUS_LABELS[order.status]}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium capitalize">
                {order.paymentStatus}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" />
              Placed on {new Date(order.createdAt).toLocaleString("en-GB", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </div>

          {/* Quick Print buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenPrint(order, "bill")}
              className="gap-1.5 text-xs font-medium border-slate-300 hover:bg-slate-100"
            >
              <FileText className="h-3.5 w-3.5 text-slate-600" />
              Print Bill
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenPrint(order, "label")}
              className="gap-1.5 text-xs font-medium border-slate-300 hover:bg-slate-100"
            >
              <Tag className="h-3.5 w-3.5 text-slate-600" />
              Print Label
            </Button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status & Fulfillment Action Card */}
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Truck className="h-4 w-4 text-slate-500" />
              Fulfillment & Order Status
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              <div>
                <Label className="text-xs text-slate-500">Change Status</Label>
                <Select
                  value={currentStatus}
                  onValueChange={(val) => setCurrentStatus(val as OrderStatus)}
                >
                  <SelectTrigger className="mt-1.5 bg-slate-50">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending (Awaiting Dispatch)</SelectItem>
                    <SelectItem value="dispatched">Dispatched (In Transit)</SelectItem>
                    <SelectItem value="delivered">Delivered (Completed)</SelectItem>
                    <SelectItem value="returned">Returned (Return In Transit)</SelectItem>
                    <SelectItem value="return_received">Return Received (QC / Refunded)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs text-slate-500">Shipping Carrier</Label>
                <Input
                  className="mt-1.5 bg-slate-50"
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  placeholder="e.g. DHL Express, FedEx, UPS"
                />
              </div>

              <div>
                <Label className="text-xs text-slate-500">Tracking Number</Label>
                <Input
                  className="mt-1.5 bg-slate-50 font-mono text-xs"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. DHL-8492018471"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs text-slate-500">Add Internal Status / QC Note (Optional)</Label>
              <Input
                className="mt-1.5 bg-slate-50 text-xs"
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                placeholder="e.g. Parcel inspected, dispatch team notified, return approved..."
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={handleUpdateStatus} size="sm" className="bg-slate-900 text-white hover:bg-slate-800">
                Save Status Changes
              </Button>
            </div>
          </div>

          {/* Customer & Shipping Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <User className="h-4 w-4 text-slate-400" />
                Customer Contact
              </h3>
              <div className="text-sm space-y-1">
                <p className="font-semibold text-slate-900">{order.customer.name}</p>
                <p className="text-slate-600 text-xs">{order.customer.email}</p>
                <p className="text-slate-600 text-xs">{order.customer.phone}</p>
              </div>
              <div className="pt-2 border-t text-xs text-slate-500">
                <span className="font-semibold text-slate-700">Payment:</span> {order.paymentMethod}
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-slate-400" />
                Delivery Address
              </h3>
              <div className="text-xs text-slate-700 space-y-0.5 leading-relaxed">
                <p className="font-semibold text-slate-900">{order.customer.name}</p>
                <p>{order.customer.shippingAddress.street}</p>
                {order.customer.shippingAddress.apartment && (
                  <p>{order.customer.shippingAddress.apartment}</p>
                )}
                <p>
                  {order.customer.shippingAddress.postalCode} {order.customer.shippingAddress.city},{" "}
                  {order.customer.shippingAddress.state}
                </p>
                <p className="font-bold text-slate-900">{order.customer.shippingAddress.country}</p>
              </div>
            </div>
          </div>

          {/* Ordered Items Table */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b bg-slate-50/50 flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Package className="h-4 w-4 text-slate-500" />
                Ordered Items ({order.items.reduce((s, i) => s + i.quantity, 0)})
              </h3>
              <span className="text-xs text-slate-500">Currency: EUR (€)</span>
            </div>

            <div className="divide-y divide-slate-100">
              {order.items.map((item) => (
                <div key={item.id} className="p-4 flex items-center gap-4 hover:bg-slate-50/50 transition-colors">
                  <img
                    src={item.img}
                    alt={item.productName}
                    className="h-16 w-16 object-cover rounded-md border border-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-slate-900 truncate">
                      {item.productName}
                    </h4>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">SKU: {item.sku}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-600">
                      <span className="bg-slate-100 px-2 py-0.5 rounded font-medium">Size: {item.size}</span>
                      {item.color && (
                        <span className="bg-slate-100 px-2 py-0.5 rounded font-medium">Color: {item.color}</span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price calculation block */}
            <div className="p-5 bg-slate-50 border-t border-slate-200 flex justify-between items-start">
              <div className="text-xs text-slate-500 max-w-xs space-y-1">
                {order.notes && (
                  <div className="p-2.5 bg-amber-50 rounded border border-amber-200 text-amber-900">
                    <span className="font-bold">Customer Note:</span> {order.notes}
                  </div>
                )}
              </div>

              <div className="w-64 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount:</span>
                    <span>-{formatPrice(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Shipping:</span>
                  <span>{formatPrice(order.shipping)}</span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Estimated Tax:</span>
                  <span>{formatPrice(order.tax)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-300 pt-2 text-base font-bold text-slate-900">
                  <span>Total:</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Timeline History */}
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-500" />
              Order Status History & Log
            </h3>
            <div className="space-y-3 pt-2">
              {order.statusHistory.map((hist, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs">
                  <div className="mt-0.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-slate-700 border border-slate-300">
                      •
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800">
                        {ORDER_STATUS_LABELS[hist.status]}
                      </span>
                      <span className="text-slate-400">
                        {new Date(hist.timestamp).toLocaleString("en-GB", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </span>
                    </div>
                    {hist.note && <p className="text-slate-600 mt-0.5">{hist.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
