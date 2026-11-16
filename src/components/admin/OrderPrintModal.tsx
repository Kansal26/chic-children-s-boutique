import React, { useState } from "react";
import { Order } from "@/lib/orders";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Printer, FileText, Tag, Download, CheckCircle2 } from "lucide-react";
import { OrderInvoiceView, OrderShippingLabelView, triggerDirectPrint } from "./OrderPrintDocuments";

interface OrderPrintModalProps {
  order: Order | null;
  isOpen: boolean;
  initialDoc?: "bill" | "label";
  onClose: () => void;
}

export function OrderPrintModal({
  order,
  isOpen,
  initialDoc = "bill",
  onClose,
}: OrderPrintModalProps) {
  const [activeTab, setActiveTab] = useState<"bill" | "label">(initialDoc);

  // Sync initialDoc when opened
  React.useEffect(() => {
    if (initialDoc) {
      setActiveTab(initialDoc);
    }
  }, [initialDoc, isOpen]);

  if (!order) return null;

  const handlePrint = () => {
    triggerDirectPrint(activeTab, order);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden bg-slate-50">
        {/* Modal Header */}
        <div className="p-6 bg-white border-b flex items-center justify-between shrink-0">
          <div>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Printer className="h-5 w-5 text-slate-700" />
              Print Documents: {order.orderNumber}
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500 mt-1">
              Generate & print authentic tax bills or courier-compliant thermal shipping labels.
            </DialogDescription>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handlePrint}
              className="bg-slate-900 text-white hover:bg-slate-800 shadow-sm gap-2"
            >
              <Printer className="h-4 w-4" />
              Print {activeTab === "bill" ? "Tax Invoice / Bill" : "Shipping Label"}
            </Button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="px-6 pt-4 shrink-0 flex items-center justify-between">
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as "bill" | "label")}
            className="w-full"
          >
            <div className="flex items-center justify-between pb-3">
              <TabsList className="bg-slate-200/80">
                <TabsTrigger value="bill" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Tax Invoice / Bill
                </TabsTrigger>
                <TabsTrigger value="label" className="gap-2">
                  <Tag className="h-4 w-4" />
                  Shipping Label (4x6)
                </TabsTrigger>
              </TabsList>

              <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
                Ready for Print • Destination: {order.customer.shippingAddress.country}
              </div>
            </div>

            {/* Document Preview Viewport */}
            <div className="max-h-[62vh] overflow-y-auto p-4 rounded-lg bg-slate-100/70 border border-slate-200 shadow-inner flex justify-center mb-6">
              <TabsContent value="bill" className="w-full mt-0">
                <OrderInvoiceView order={order} />
              </TabsContent>

              <TabsContent value="label" className="w-full mt-0 flex justify-center">
                <OrderShippingLabelView order={order} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
