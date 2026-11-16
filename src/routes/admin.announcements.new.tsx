import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { db } from "@/lib/db";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/announcements/new")({
  component: NewAnnouncementPage,
});

function NewAnnouncementPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    message: "",
    status: "active" as "active" | "inactive",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await db.createAnnouncement(formData);
      toast.success("Announcement created successfully");
      navigate({ to: "/admin/announcements" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to create announcement");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8 flex items-center gap-4">
        <Link
          to="/admin/announcements"
          className="rounded-full p-2 hover:bg-slate-100 transition-colors text-slate-500"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">New Announcement</h2>
          <p className="text-sm text-slate-500 mt-1">
            Create a new scrolling message for the top of your site.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
          <div className="space-y-6">
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-700">
                Message <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="message"
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="e.g. Free shipping on orders over $100"
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm placeholder-slate-400 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              />
              <p className="mt-1 text-xs text-slate-500">Keep it short and punchy for the top bar.</p>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-slate-700">
                Status
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              >
                <option value="active">Active (Visible)</option>
                <option value="inactive">Inactive (Hidden)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link
            to="/admin/announcements"
            className="rounded-md px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-slate-800",
              isSubmitting && "opacity-70 pointer-events-none"
            )}
          >
            {isSubmitting ? "Creating..." : "Create Announcement"}
          </button>
        </div>
      </form>
    </div>
  );
}
