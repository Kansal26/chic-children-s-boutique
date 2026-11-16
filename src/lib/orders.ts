import { useSyncExternalStore } from "react";
import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";
import p4 from "@/assets/p4.jpg";
import cNewborn from "@/assets/c-newborn.jpg";
import cGirls from "@/assets/c-girls.jpg";
import cBoys from "@/assets/c-boys.jpg";
import cShoes from "@/assets/c-shoes.jpg";

export type OrderStatus = "pending" | "dispatched" | "delivered" | "returned" | "return_received";

export type OrderItem = {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  color?: string;
  size: string;
  price: number;
  quantity: number;
  img: string;
};

export type OrderAddress = {
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type OrderCustomer = {
  name: string;
  email: string;
  phone: string;
  shippingAddress: OrderAddress;
  billingAddress: OrderAddress;
};

export type StatusHistoryEntry = {
  status: OrderStatus;
  timestamp: string;
  note?: string;
};

export type Order = {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: OrderCustomer;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod: string;
  paymentStatus: "paid" | "pending" | "refunded";
  status: OrderStatus;
  shippingCarrier?: string;
  trackingNumber?: string;
  notes?: string;
  statusHistory: StatusHistoryEntry[];
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  dispatched: "Dispatched",
  delivered: "Delivered",
  returned: "Returned",
  return_received: "Return Received",
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, { bg: string; text: string; border: string; badge: string }> = {
  pending: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    badge: "bg-amber-100 text-amber-800 border-amber-300",
  },
  dispatched: {
    bg: "bg-sky-50",
    text: "text-sky-700",
    border: "border-sky-200",
    badge: "bg-sky-100 text-sky-800 border-sky-300",
  },
  delivered: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    badge: "bg-emerald-100 text-emerald-800 border-emerald-300",
  },
  returned: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
    badge: "bg-orange-100 text-orange-800 border-orange-300",
  },
  return_received: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    badge: "bg-purple-100 text-purple-800 border-purple-300",
  },
};

const INITIAL_ORDERS: Order[] = [
  {
    id: "ord-9041",
    orderNumber: "MP-10491",
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // 35 mins ago
    customer: {
      name: "Charlotte Dubois",
      email: "c.dubois@parisluxe.fr",
      phone: "+33 6 12 34 56 78",
      shippingAddress: {
        street: "14 Rue du Faubourg Saint-Honoré",
        apartment: "Apt 4B",
        city: "Paris",
        state: "Île-de-France",
        postalCode: "75008",
        country: "France",
      },
      billingAddress: {
        street: "14 Rue du Faubourg Saint-Honoré",
        apartment: "Apt 4B",
        city: "Paris",
        state: "Île-de-France",
        postalCode: "75008",
        country: "France",
      },
    },
    items: [
      {
        id: "item-1",
        productId: "margot-dress",
        productName: "Margot Silk-Tulle Party Dress",
        sku: "MP-DRS-001",
        color: "Blush Rose",
        size: "3Y",
        price: 168,
        quantity: 1,
        img: p1,
      },
      {
        id: "item-2",
        productId: "camille-mary-jane",
        productName: "Camille Velvet Mary Janes",
        sku: "MP-SH-008",
        color: "Bordeaux",
        size: "26 EU",
        price: 110,
        quantity: 1,
        img: p3,
      },
    ],
    subtotal: 278,
    discount: 20,
    shipping: 15,
    tax: 32.76,
    total: 273,
    paymentMethod: "Credit Card (Visa ending in 4242)",
    paymentStatus: "paid",
    status: "pending",
    shippingCarrier: "DHL Express",
    notes: "Please package with gift ribbon if possible.",
    statusHistory: [
      {
        status: "pending",
        timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
        note: "Order placed and payment authorized.",
      },
    ],
  },
  {
    id: "ord-9042",
    orderNumber: "MP-10492",
    createdAt: new Date(Date.now() - 1000 * 60 * 110).toISOString(), // ~2 hrs ago
    customer: {
      name: "Alexander Wright",
      email: "a.wright@kensington.co.uk",
      phone: "+44 20 7946 0912",
      shippingAddress: {
        street: "42 Kensington Palace Gardens",
        city: "London",
        state: "Greater London",
        postalCode: "W8 4QP",
        country: "United Kingdom",
      },
      billingAddress: {
        street: "42 Kensington Palace Gardens",
        city: "London",
        state: "Greater London",
        postalCode: "W8 4QP",
        country: "United Kingdom",
      },
    },
    items: [
      {
        id: "item-3",
        productId: "blanche-blanket",
        productName: "Blanche Cashmere Pram Blanket",
        sku: "MP-ACC-014",
        color: "Ivory",
        size: "One Size (80x100cm)",
        price: 186,
        quantity: 1,
        img: cNewborn,
      },
    ],
    subtotal: 186,
    discount: 0,
    shipping: 15,
    tax: 24.12,
    total: 201,
    paymentMethod: "Apple Pay",
    paymentStatus: "paid",
    status: "pending",
    shippingCarrier: "FedEx Priority",
    statusHistory: [
      {
        status: "pending",
        timestamp: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
        note: "Order placed online.",
      },
    ],
  },
  {
    id: "ord-8975",
    orderNumber: "MP-10475",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(), // 22 hrs ago
    customer: {
      name: "Eleanor Vance",
      email: "e.vance@bostonluxe.com",
      phone: "+1 (617) 555-0199",
      shippingAddress: {
        street: "77 Commonwealth Avenue",
        apartment: "Suite 3",
        city: "Boston",
        state: "MA",
        postalCode: "02116",
        country: "United States",
      },
      billingAddress: {
        street: "77 Commonwealth Avenue",
        apartment: "Suite 3",
        city: "Boston",
        state: "MA",
        postalCode: "02116",
        country: "United States",
      },
    },
    items: [
      {
        id: "item-4",
        productId: "lucas-linen-suit",
        productName: "Lucas Tailored Linen Suit",
        sku: "MP-BYS-004",
        color: "Oatmeal",
        size: "4Y",
        price: 145,
        quantity: 1,
        img: p2,
      },
      {
        id: "item-5",
        productId: "blanche-blanket",
        productName: "Blanche Cashmere Pram Blanket",
        sku: "MP-ACC-014",
        color: "Ivory",
        size: "One Size",
        price: 186,
        quantity: 1,
        img: cNewborn,
      },
    ],
    subtotal: 331,
    discount: 30,
    shipping: 25,
    tax: 39.12,
    total: 326,
    paymentMethod: "Credit Card (Amex)",
    paymentStatus: "paid",
    status: "dispatched",
    shippingCarrier: "DHL Luxury Express",
    trackingNumber: "DHL-9840281742",
    statusHistory: [
      {
        status: "pending",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
        note: "Order received.",
      },
      {
        status: "dispatched",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
        note: "Dispatched via DHL Express. Tracking DHL-9840281742 generated.",
      },
    ],
  },
  {
    id: "ord-8820",
    orderNumber: "MP-10420",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    customer: {
      name: "Sophie Moreau",
      email: "sophie.m@genevacap.ch",
      phone: "+41 22 731 82 90",
      shippingAddress: {
        street: "8 Quai du Mont-Blanc",
        city: "Geneva",
        state: "Geneva",
        postalCode: "1201",
        country: "Switzerland",
      },
      billingAddress: {
        street: "8 Quai du Mont-Blanc",
        city: "Geneva",
        state: "Geneva",
        postalCode: "1201",
        country: "Switzerland",
      },
    },
    items: [
      {
        id: "item-6",
        productId: "margot-dress",
        productName: "Margot Silk-Tulle Party Dress",
        sku: "MP-DRS-001",
        color: "Blush Rose",
        size: "2Y",
        price: 168,
        quantity: 2,
        img: p1,
      },
    ],
    subtotal: 336,
    discount: 0,
    shipping: 15,
    tax: 28.08,
    total: 351,
    paymentMethod: "Credit Card (Mastercard)",
    paymentStatus: "paid",
    status: "delivered",
    shippingCarrier: "FedEx Express",
    trackingNumber: "FDX-7749201948",
    statusHistory: [
      {
        status: "pending",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
        note: "Order confirmed.",
      },
      {
        status: "dispatched",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
        note: "Package handed over to carrier.",
      },
      {
        status: "delivered",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
        note: "Delivered safely at front desk / concierge.",
      },
    ],
  },
  {
    id: "ord-8740",
    orderNumber: "MP-10340",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(), // 5 days ago
    customer: {
      name: "Lucas Bennett",
      email: "lucas.bennett@monacoyacht.mc",
      phone: "+377 98 06 20 00",
      shippingAddress: {
        street: "2 Boulevard Princesse Charlotte",
        city: "Monte Carlo",
        state: "Monaco",
        postalCode: "98000",
        country: "Monaco",
      },
      billingAddress: {
        street: "2 Boulevard Princesse Charlotte",
        city: "Monte Carlo",
        state: "Monaco",
        postalCode: "98000",
        country: "Monaco",
      },
    },
    items: [
      {
        id: "item-7",
        productId: "lucas-linen-suit",
        productName: "Lucas Tailored Linen Suit",
        sku: "MP-BYS-004",
        color: "Oatmeal",
        size: "3Y",
        price: 145,
        quantity: 1,
        img: p2,
      },
    ],
    subtotal: 145,
    discount: 0,
    shipping: 15,
    tax: 17.4,
    total: 160,
    paymentMethod: "PayPal",
    paymentStatus: "paid",
    status: "returned",
    shippingCarrier: "UPS Return Service",
    trackingNumber: "1Z9999999999999999",
    notes: "Customer requested exchange for size 4Y. Parcel in transit back to studio.",
    statusHistory: [
      {
        status: "pending",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
      },
      {
        status: "dispatched",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
      },
      {
        status: "delivered",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      },
      {
        status: "returned",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
        note: "Customer initiated return: size too small.",
      },
    ],
  },
  {
    id: "ord-8612",
    orderNumber: "MP-10212",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 190).toISOString(), // ~8 days ago
    customer: {
      name: "Isabella Rossi",
      email: "i.rossi@milano.it",
      phone: "+39 02 8765 4321",
      shippingAddress: {
        street: "Via Montenapoleone 8",
        city: "Milano",
        state: "Lombardia",
        postalCode: "20121",
        country: "Italy",
      },
      billingAddress: {
        street: "Via Montenapoleone 8",
        city: "Milano",
        state: "Lombardia",
        postalCode: "20121",
        country: "Italy",
      },
    },
    items: [
      {
        id: "item-8",
        productId: "camille-mary-jane",
        productName: "Camille Velvet Mary Janes",
        sku: "MP-SH-008",
        color: "Bordeaux",
        size: "24 EU",
        price: 110,
        quantity: 2,
        img: p3,
      },
    ],
    subtotal: 220,
    discount: 0,
    shipping: 15,
    tax: 26.4,
    total: 235,
    paymentMethod: "Credit Card (Visa)",
    paymentStatus: "refunded",
    status: "return_received",
    shippingCarrier: "DHL Return",
    trackingNumber: "DHL-RET-771928",
    notes: "Item inspected at atelier in perfect condition with original tags. Full refund processed.",
    statusHistory: [
      {
        status: "pending",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 190).toISOString(),
      },
      {
        status: "dispatched",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 160).toISOString(),
      },
      {
        status: "delivered",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 100).toISOString(),
      },
      {
        status: "returned",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
      },
      {
        status: "return_received",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
        note: "Package received & QC passed. Refund of €235 executed to original card.",
      },
    ],
  },
];

const STORAGE_KEY = "maison_petit_orders";

function loadOrdersFromStorage(): Order[] {
  if (typeof window === "undefined") return INITIAL_ORDERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to read orders from localStorage", e);
    return INITIAL_ORDERS;
  }
}

function saveOrdersToStorage(ordersList: Order[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ordersList));
  } catch (e) {
    console.error("Failed to save orders to localStorage", e);
  }
}

let memoryOrders: Order[] = loadOrdersFromStorage();

type Listener = () => void;
const orderListeners = new Set<Listener>();

function emitChange() {
  saveOrdersToStorage(memoryOrders);
  orderListeners.forEach((l) => l());
}

export const orderStore = {
  subscribe(listener: Listener) {
    orderListeners.add(listener);
    return () => orderListeners.delete(listener);
  },

  getOrders(): Order[] {
    return memoryOrders;
  },

  getOrder(id: string): Order | undefined {
    return memoryOrders.find((o) => o.id === id || o.orderNumber === id);
  },

  updateStatus(id: string, newStatus: OrderStatus, note?: string) {
    memoryOrders = memoryOrders.map((ord) => {
      if (ord.id === id) {
        const historyEntry: StatusHistoryEntry = {
          status: newStatus,
          timestamp: new Date().toISOString(),
          note: note || `Status updated to ${ORDER_STATUS_LABELS[newStatus]} by Admin.`,
        };
        return {
          ...ord,
          status: newStatus,
          statusHistory: [historyEntry, ...ord.statusHistory],
        };
      }
      return ord;
    });
    emitChange();
  },

  updateTracking(id: string, carrier: string, trackingNumber: string) {
    memoryOrders = memoryOrders.map((ord) => {
      if (ord.id === id) {
        return {
          ...ord,
          shippingCarrier: carrier,
          trackingNumber,
        };
      }
      return ord;
    });
    emitChange();
  },

  addOrder(newOrder: Order) {
    memoryOrders = [newOrder, ...memoryOrders];
    emitChange();
  },

  resetDefaults() {
    memoryOrders = INITIAL_ORDERS;
    emitChange();
  },
};

export function useOrders(): Order[] {
  return useSyncExternalStore(
    orderStore.subscribe,
    orderStore.getOrders,
    () => INITIAL_ORDERS
  );
}
