import { createFileRoute, Link } from "@tanstack/react-router";
import { useAnnouncements, db, Announcement } from "@/lib/db";
import { Plus, Megaphone, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/announcements/")({
  component: AdminAnnouncementsPage,
});

function AdminAnnouncementsPage() {
  const announcements = useAnnouncements();

  const toggleStatus = async (announcement: Announcement) => {
    const newStatus = announcement.status === "active" ? "inactive" : "active";
    await db.updateAnnouncement(announcement.id, { status: newStatus });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this announcement?")) {
      await db.deleteAnnouncement(id);
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Announcement Bar</h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage the scrolling notifications at the top of your storefront.
          </p>
        </div>
        <Link
          to="/admin/announcements/new"
          className="flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" />
          New Announcement
        </Link>
      </div>

      <div className="rounded-md border border-slate-200 bg-white overflow-hidden shadow-sm">
        {announcements.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-slate-100 text-slate-400 mb-4">
              <Megaphone className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-slate-900">No announcements yet</h3>
            <p className="text-sm text-slate-500 mb-6 max-w-md">
              Create scrolling messages to notify your customers about sales, free shipping, or new arrivals.
            </p>
            <Link
              to="/admin/announcements/new"
              className="rounded-md border border-slate-200 px-6 py-2.5 text-sm font-medium hover:bg-slate-50 transition-colors text-slate-900"
            >
              Create First Announcement
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase text-slate-500 bg-slate-50">
                <tr>
                  <th className="px-6 py-3 font-medium border-b border-slate-200">Message</th>
                  <th className="px-6 py-3 font-medium border-b border-slate-200">Status</th>
                  <th className="px-6 py-3 font-medium border-b border-slate-200 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {announcements.map((announcement) => (
                  <tr key={announcement.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-900">{announcement.message}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleStatus(announcement)}
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors border",
                          announcement.status === "active"
                            ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                            : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                        )}
                      >
                        {announcement.status === "active" ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(announcement.id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-2 rounded-full hover:bg-rose-50"
                        title="Delete Announcement"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
