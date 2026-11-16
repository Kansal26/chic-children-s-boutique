import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  useOrders,
  Order,
  OrderStatus,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  orderStore,
} from "@/lib/orders";
import { formatPrice } from "@/data/catalog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Printer,
  FileText,
  Tag,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  RotateCcw,
  PackageCheck,
  ShoppingBag,
  MoreVertical,
  ExternalLink,
  Filter,
  ArrowUpDown,
  RefreshCw,
} from "lucide-react";
import { OrderDetailDialog } from "@/components/admin/OrderDetailDialog";
import { OrderPrintModal } from "@/components/admin/OrderPrintModal";
import { triggerDirectPrint } from "@/components/admin/OrderPrintDocuments";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrdersPage,
});

function AdminOrdersPage() {
  const orders = useOrders();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatusTab, setSelectedStatusTab] = useState<"all" | OrderStatus>("all");
  const [selectedOrderForDetails, setSelectedOrderForDetails] = useState<Order | null>(null);
  const [selectedOrderForPrint, setSelectedOrderForPrint] = useState<{
    order: Order;
    docType: "bill" | "label";
  } | null>(null);

  // Status analytics calculations
  const analytics = useMemo(() => {
    const totalCount = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === "refunded" ? 0 : o.total), 0);

    const counts: Record<OrderStatus, number> = {
      pending: 0,
      dispatched: 0,
      delivered: 0,
      returned: 0,
      return_received: 0,
    };

    const revenues: Record<OrderStatus, number> = {
      pending: 0,
      dispatched: 0,
      delivered: 0,
      returned: 0,
      return_received: 0,
    };

    orders.forEach((o) => {
      counts[o.status] = (counts[o.status] || 0) + 1;
      revenues[o.status] = (revenues[o.status] || 0) + o.total;
    });

    return { totalCount, totalRevenue, counts, revenues };
  }, [orders]);

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Filter by tab
      if (selectedStatusTab !== "all" && order.status !== selectedStatusTab) {
        return false;
      }

      // Filter by search query
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const matchNumber = order.orderNumber.toLowerCase().includes(q);
      const matchCustomer = order.customer.name.toLowerCase().includes(q);
      const matchEmail = order.customer.email.toLowerCase().includes(q);
      const matchTracking = order.trackingNumber?.toLowerCase().includes(q) || false;
      const matchProduct = order.items.some(
        (i) => i.productName.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q)
      );

      return matchNumber || matchCustomer || matchEmail || matchTracking || matchProduct;
    });
  }, [orders, selectedStatusTab, searchQuery]);

  const handleOpenPrintModal = (order: Order, docType: "bill" | "label") => {
    setSelectedOrderForPrint({ order, docType });
  };

  const handleQuickDirectPrint = (docType: "bill" | "label", order: Order) => {
    triggerDirectPrint(docType, order);
    toast.success(`Opening ${docType === "bill" ? "Tax Invoice" : "Shipping Label"} for ${order.orderNumber}`);
  };

  const handleAdvanceStatus = (order: Order) => {
    let nextStatus: OrderStatus = order.status;
    let note = "";
    if (order.status === "pending") {
      nextStatus = "dispatched";
      note = "Order marked as Dispatched by Admin.";
    } else if (order.status === "dispatched") {
      nextStatus = "delivered";
      note = "Delivery verified and marked Completed.";
    } else if (order.status === "returned") {
      nextStatus = "return_received";
      note = "Returned parcel received and verified in warehouse.";
    }

    if (nextStatus !== order.status) {
      orderStore.updateStatus(order.id, nextStatus, note);
      toast.success(`Order ${order.orderNumber} advanced to ${ORDER_STATUS_LABELS[nextStatus]}`);
    }
  };

  return (
    <div className="space-y-8 font-sans pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-serif tracking-tight text-slate-900">
            Order Status & Fulfillment
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Analyse orders by status, generate tax invoices, and print courier shipping labels.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              orderStore.resetDefaults();
              toast.info("Reset order database to initial demo dataset.");
            }}
            className="text-xs gap-1.5 text-slate-600 border-slate-300"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reset Demo Data
          </Button>
        </div>
      </div>

      {/* Analytics Summary Cards (Dispatched, Delivered, Returned, Return Received, Pending) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Total Orders Card */}
        <Card
          onClick={() => setSelectedStatusTab("all")}
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedStatusTab === "all" ? "ring-2 ring-slate-900 shadow-sm" : ""
          }`}
        >
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center justify-between">
              <span>All Orders</span>
              <ShoppingBag className="h-4 w-4 text-slate-600" />
            </CardDescription>
            <CardTitle className="text-2xl font-bold mt-1 text-slate-900">
              {analytics.totalCount}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-xs text-slate-500 font-medium">{formatPrice(analytics.totalRevenue)} total</p>
          </CardContent>
        </Card>

        {/* 1. Pending Status Card */}
        <Card
          onClick={() => setSelectedStatusTab("pending")}
          className={`cursor-pointer transition-all hover:shadow-md border-amber-200 bg-amber-50/40 ${
            selectedStatusTab === "pending" ? "ring-2 ring-amber-500 shadow-sm" : ""
          }`}
        >
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider text-amber-700 flex items-center justify-between">
              <span>Pending</span>
              <Clock className="h-4 w-4 text-amber-600" />
            </CardDescription>
            <CardTitle className="text-2xl font-bold mt-1 text-amber-900">
              {analytics.counts.pending}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-xs text-amber-800 font-medium">Needs bill & label</p>
          </CardContent>
        </Card>

        {/* 2. Dispatched Status Card */}
        <Card
          onClick={() => setSelectedStatusTab("dispatched")}
          className={`cursor-pointer transition-all hover:shadow-md border-sky-200 bg-sky-50/40 ${
            selectedStatusTab === "dispatched" ? "ring-2 ring-sky-500 shadow-sm" : ""
          }`}
        >
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider text-sky-700 flex items-center justify-between">
              <span>Dispatched</span>
              <Truck className="h-4 w-4 text-sky-600" />
            </CardDescription>
            <CardTitle className="text-2xl font-bold mt-1 text-sky-900">
              {analytics.counts.dispatched}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-xs text-sky-800 font-medium">In transit / on route</p>
          </CardContent>
        </Card>

        {/* 3. Delivered Status Card */}
        <Card
          onClick={() => setSelectedStatusTab("delivered")}
          className={`cursor-pointer transition-all hover:shadow-md border-emerald-200 bg-emerald-50/40 ${
            selectedStatusTab === "delivered" ? "ring-2 ring-emerald-500 shadow-sm" : ""
          }`}
        >
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider text-emerald-700 flex items-center justify-between">
              <span>Delivered</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </CardDescription>
            <CardTitle className="text-2xl font-bold mt-1 text-emerald-900">
              {analytics.counts.delivered}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-xs text-emerald-800 font-medium">Fulfilled safely</p>
          </CardContent>
        </Card>

        {/* 4. Returned Status Card */}
        <Card
          onClick={() => setSelectedStatusTab("returned")}
          className={`cursor-pointer transition-all hover:shadow-md border-orange-200 bg-orange-50/40 ${
            selectedStatusTab === "returned" ? "ring-2 ring-orange-500 shadow-sm" : ""
          }`}
        >
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider text-orange-700 flex items-center justify-between">
              <span>Returned</span>
              <RotateCcw className="h-4 w-4 text-orange-600" />
            </CardDescription>
            <CardTitle className="text-2xl font-bold mt-1 text-orange-900">
              {analytics.counts.returned}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-xs text-orange-800 font-medium">Return in transit</p>
          </CardContent>
        </Card>

        {/* 5. Return Received Status Card */}
        <Card
          onClick={() => setSelectedStatusTab("return_received")}
          className={`cursor-pointer transition-all hover:shadow-md border-purple-200 bg-purple-50/40 ${
            selectedStatusTab === "return_received" ? "ring-2 ring-purple-500 shadow-sm" : ""
          }`}
        >
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider text-purple-700 flex items-center justify-between">
              <span>Return Received</span>
              <PackageCheck className="h-4 w-4 text-purple-600" />
            </CardDescription>
            <CardTitle className="text-2xl font-bold mt-1 text-purple-900">
              {analytics.counts.return_received}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-xs text-purple-800 font-medium">QC / Refund complete</p>
          </CardContent>
        </Card>
      </div>

      {/* Visual Order Status Analytics Breakdown Bar */}
      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader className="p-5 pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-sm font-bold text-slate-800">
                Order Status Distribution Breakdown
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Visual proportion of active pipeline across pending, dispatched, delivered, and returns.
              </CardDescription>
            </div>
            <div className="text-xs font-medium text-slate-500">
              Total Managed Value: <span className="font-bold text-slate-900">{formatPrice(analytics.totalRevenue)}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-5 pt-1 space-y-4">
          {/* Multi-segment progress bar */}
          <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
            {analytics.totalCount > 0 && (
              <>
                <div
                  style={{ width: `${(analytics.counts.pending / analytics.totalCount) * 100}%` }}
                  className="bg-amber-400 transition-all"
                  title={`Pending: ${analytics.counts.pending}`}
                />
                <div
                  style={{ width: `${(analytics.counts.dispatched / analytics.totalCount) * 100}%` }}
                  className="bg-sky-400 transition-all"
                  title={`Dispatched: ${analytics.counts.dispatched}`}
                />
                <div
                  style={{ width: `${(analytics.counts.delivered / analytics.totalCount) * 100}%` }}
                  className="bg-emerald-500 transition-all"
                  title={`Delivered: ${analytics.counts.delivered}`}
                />
                <div
                  style={{ width: `${(analytics.counts.returned / analytics.totalCount) * 100}%` }}
                  className="bg-orange-400 transition-all"
                  title={`Returned: ${analytics.counts.returned}`}
                />
                <div
                  style={{ width: `${(analytics.counts.return_received / analytics.totalCount) * 100}%` }}
                  className="bg-purple-500 transition-all"
                  title={`Return Received: ${analytics.counts.return_received}`}
                />
              </>
            )}
          </div>

          {/* Legend items with percentages */}
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400"></span>
              <span className="text-slate-600">Pending:</span>
              <span className="font-bold text-slate-900">
                {Math.round((analytics.counts.pending / (analytics.totalCount || 1)) * 100)}% ({analytics.counts.pending})
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-sky-400"></span>
              <span className="text-slate-600">Dispatched:</span>
              <span className="font-bold text-slate-900">
                {Math.round((analytics.counts.dispatched / (analytics.totalCount || 1)) * 100)}% ({analytics.counts.dispatched})
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-slate-600">Delivered:</span>
              <span className="font-bold text-slate-900">
                {Math.round((analytics.counts.delivered / (analytics.totalCount || 1)) * 100)}% ({analytics.counts.delivered})
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-orange-400"></span>
              <span className="text-slate-600">Returned:</span>
              <span className="font-bold text-slate-900">
                {Math.round((analytics.counts.returned / (analytics.totalCount || 1)) * 100)}% ({analytics.counts.returned})
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-purple-500"></span>
              <span className="text-slate-600">Return Received:</span>
              <span className="font-bold text-slate-900">
                {Math.round((analytics.counts.return_received / (analytics.totalCount || 1)) * 100)}% ({analytics.counts.return_received})
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Orders Table Section */}
      <div className="space-y-4">
        {/* Controls: Status filter buttons & Search */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedStatusTab("all")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedStatusTab === "all"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              All Orders ({analytics.totalCount})
            </button>
            <button
              onClick={() => setSelectedStatusTab("pending")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedStatusTab === "pending"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              Pending ({analytics.counts.pending})
            </button>
            <button
              onClick={() => setSelectedStatusTab("dispatched")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedStatusTab === "dispatched"
                  ? "bg-sky-600 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              Dispatched ({analytics.counts.dispatched})
            </button>
            <button
              onClick={() => setSelectedStatusTab("delivered")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedStatusTab === "delivered"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              Delivered ({analytics.counts.delivered})
            </button>
            <button
              onClick={() => setSelectedStatusTab("returned")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedStatusTab === "returned"
                  ? "bg-orange-600 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              Returned ({analytics.counts.returned})
            </button>
            <button
              onClick={() => setSelectedStatusTab("return_received")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedStatusTab === "return_received"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              Return Received ({analytics.counts.return_received})
            </button>
          </div>

          {/* Search bar */}
          <div className="relative w-full lg:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search order #, customer, tracking..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs bg-white border-slate-300"
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50/70">
              <TableRow className="border-b border-slate-200 text-xs font-semibold text-slate-600">
                <TableHead className="w-[140px]">Order ID</TableHead>
                <TableHead className="min-w-[180px]">Customer</TableHead>
                <TableHead className="min-w-[190px]">Items Summary</TableHead>
                <TableHead className="w-[110px]">Total</TableHead>
                <TableHead className="w-[140px]">Status</TableHead>
                <TableHead className="min-w-[210px] text-center font-bold text-slate-800">
                  Print Options (Bill & Label)
                </TableHead>
                <TableHead className="w-[100px] text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => {
                const statusStyle = ORDER_STATUS_COLORS[order.status];
                const isPending = order.status === "pending";

                return (
                  <TableRow
                    key={order.id}
                    className={`hover:bg-slate-50/80 transition-colors text-xs ${
                      isPending ? "bg-amber-50/20" : ""
                    }`}
                  >
                    {/* Order ID & Time */}
                    <TableCell className="font-medium align-middle">
                      <div className="font-mono font-bold text-slate-900 text-sm">
                        {order.orderNumber}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                        })}{" "}
                        •{" "}
                        {new Date(order.createdAt).toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </TableCell>

                    {/* Customer Info */}
                    <TableCell className="align-middle">
                      <div className="font-semibold text-slate-900">{order.customer.name}</div>
                      <div className="text-slate-500 text-[11px] truncate max-w-[180px]">
                        {order.customer.email}
                      </div>
                      <div className="text-slate-400 text-[10px] mt-0.5">
                        {order.customer.shippingAddress.city}, {order.customer.shippingAddress.country}
                      </div>
                    </TableCell>

                    {/* Items Stack preview */}
                    <TableCell className="align-middle">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2 overflow-hidden shrink-0">
                          {order.items.slice(0, 2).map((item, i) => (
                            <img
                              key={i}
                              src={item.img}
                              alt={item.productName}
                              className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover border border-slate-200"
                              title={`${item.productName} (${item.size})`}
                            />
                          ))}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-slate-800 truncate max-w-[140px]">
                            {order.items[0]?.productName}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {order.items.reduce((s, i) => s + i.quantity, 0)} item
                            {order.items.length > 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Total & Payment */}
                    <TableCell className="align-middle">
                      <div className="font-bold text-slate-900 text-sm">
                        {formatPrice(order.total)}
                      </div>
                      <span className="inline-block text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium capitalize mt-0.5">
                        {order.paymentStatus}
                      </span>
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell className="align-middle">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusStyle.badge}`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                      {order.trackingNumber && (
                        <div className="text-[10px] font-mono text-slate-400 mt-1 truncate max-w-[120px]" title={order.trackingNumber}>
                          {order.shippingCarrier?.split(" ")[0]}: {order.trackingNumber}
                        </div>
                      )}
                    </TableCell>

                    {/* PRINT OPTIONS BESIDE EACH ORDER (ESPECIALLY PENDING) */}
                    <TableCell className="align-middle text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Print Bill Button */}
                        <Button
                          variant={isPending ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleOpenPrintModal(order, "bill")}
                          className={`h-7 px-2.5 text-xs gap-1 font-medium shadow-xs transition-all ${
                            isPending
                              ? "bg-slate-900 hover:bg-slate-800 text-white ring-1 ring-amber-400"
                              : "border-slate-300 text-slate-700 hover:bg-slate-100"
                          }`}
                          title={`Print Bill / Tax Invoice for ${order.orderNumber}`}
                        >
                          <Printer className="h-3.5 w-3.5 text-amber-400" />
                          <span>Bill</span>
                        </Button>

                        {/* Print Label Button */}
                        <Button
                          variant={isPending ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleOpenPrintModal(order, "label")}
                          className={`h-7 px-2.5 text-xs gap-1 font-medium shadow-xs transition-all ${
                            isPending
                              ? "bg-slate-900 hover:bg-slate-800 text-white ring-1 ring-amber-400"
                              : "border-slate-300 text-slate-700 hover:bg-slate-100"
                          }`}
                          title={`Print 4x6 Shipping Label for ${order.orderNumber}`}
                        >
                          <Tag className="h-3.5 w-3.5 text-amber-400" />
                          <span>Label</span>
                        </Button>

                        {/* Quick 1-click Direct print dropdown */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-slate-400 hover:text-slate-800"
                            >
                              <MoreVertical className="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="text-xs">
                            <DropdownMenuLabel>Instant Print</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => handleQuickDirectPrint("bill", order)}
                              className="gap-2 cursor-pointer"
                            >
                              <FileText className="h-3.5 w-3.5 text-slate-500" />
                              Direct Print Tax Invoice
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleQuickDirectPrint("label", order)}
                              className="gap-2 cursor-pointer"
                            >
                              <Tag className="h-3.5 w-3.5 text-slate-500" />
                              Direct Print Shipping Label
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {isPending && (
                              <DropdownMenuItem
                                onClick={() => handleAdvanceStatus(order)}
                                className="gap-2 cursor-pointer text-sky-700 font-medium"
                              >
                                <Truck className="h-3.5 w-3.5 text-sky-600" />
                                Mark as Dispatched
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>

                    {/* View Details Action */}
                    <TableCell className="align-middle text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedOrderForDetails(order)}
                        className="h-7 px-2 text-xs gap-1 text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>View</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}

              {filteredOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-slate-400 text-xs">
                    No orders matching your search or status filter.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Complete Order Details Dialog */}
      <OrderDetailDialog
        order={selectedOrderForDetails}
        isOpen={!!selectedOrderForDetails}
        onClose={() => setSelectedOrderForDetails(null)}
        onOpenPrint={(order, docType) => handleOpenPrintModal(order, docType)}
      />

      {/* Print Preview & Native Print Modal */}
      <OrderPrintModal
        order={selectedOrderForPrint?.order || null}
        initialDoc={selectedOrderForPrint?.docType || "bill"}
        isOpen={!!selectedOrderForPrint}
        onClose={() => setSelectedOrderForPrint(null)}
      />
    </div>
  );
}
