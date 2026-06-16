import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Users, Check, X, ShieldCheck,
  Search, LogOut, ArrowLeft, UserCheck, UserX, Clock,
  Mail, Phone, MapPin, Building, Ban, Unlock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import logoPath from "@assets/png-removebg-preview_1779963000572.png";
import { useAuth } from "@/hooks/useAuth";

export default function AdminPanel() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [users, setUsers] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const getAuthHeaders = useCallback(() => {
    if (!user?.id) return {};
    return { userid: user.id };
  }, [user]);

  const fetchUsers = useCallback(async () => {
    setFetching(true);
    try {
      const headers = getAuthHeaders();
      if (!headers.userid) {
        setUsers([]);
        return;
      }
      const res = await fetch("/api/admin/users", { headers });
      if (!res.ok) {
        if (res.status === 401) {
          logout();
          setLocation("/login");
          return;
        }
        throw new Error("Failed to fetch users");
      }
      const data = await res.json();
      setUsers(data);
    } catch {
      setUsers([]);
    } finally {
      setFetching(false);
    }
  }, [getAuthHeaders, logout, setLocation]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  async function handleApprove(id) {
    setActionLoading(id);
    try {
      await fetch(`/api/admin/users/${id}/approve`, {
        method: "POST",
        headers: getAuthHeaders()
      });
      fetchUsers();
    } catch {
      fetchUsers();
    } finally {
      setActionLoading(null);
    }
  }

  async function handleReject(id) {
    setActionLoading(id);
    try {
      await fetch(`/api/admin/users/${id}/reject`, {
        method: "POST",
        headers: getAuthHeaders()
      });
      fetchUsers();
    } catch {
      fetchUsers();
    } finally {
      setActionLoading(null);
    }
  }

  async function handleBan(id) {
    setActionLoading(id);
    try {
      await fetch(`/api/admin/users/${id}/ban`, {
        method: "POST",
        headers: getAuthHeaders()
      });
      fetchUsers();
    } catch {
      fetchUsers();
    } finally {
      setActionLoading(null);
    }
  }

  async function handleUnban(id) {
    setActionLoading(id);
    try {
      await fetch(`/api/admin/users/${id}/unban`, {
        method: "POST",
        headers: getAuthHeaders()
      });
      fetchUsers();
    } catch {
      fetchUsers();
    } finally {
      setActionLoading(null);
    }
  }

  const filteredUsers = users.filter(u => {
    if (filter === "pending") return u.status === "pending";
    if (filter === "approved") return u.status === "approved";
    if (filter === "rejected") return u.status === "rejected";
    if (filter === "banned") return u.status === "banned";
    return true;
  }).filter(u => {
    if (!search) return true;
    const q = search.toLowerCase();
    return u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.role?.toLowerCase().includes(q);
  });

  const stats = {
    total: users.length,
    pending: users.filter(u => u.status === "pending").length,
    approved: users.filter(u => u.status === "approved").length,
    rejected: users.filter(u => u.status === "rejected").length,
    banned: users.filter(u => u.status === "banned").length
  };

  const filters = [
    { key: "all", label: "All Users", count: stats.total },
    { key: "pending", label: "Pending", count: stats.pending },
    { key: "approved", label: "Approved", count: stats.approved },
    { key: "rejected", label: "Rejected", count: stats.rejected },
    { key: "banned", label: "Banned", count: stats.banned },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <img src={logoPath} alt="VERDORA" className="h-8 w-8 object-contain" />
            <span className="font-black text-lg bg-linear-to-r from-primary to-emerald-400 bg-clip-text text-transparent hidden sm:block">
              VERDORA
            </span>
          </Link>
          <div className="h-5 w-px bg-border mx-1" />
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <h1 className="font-bold text-sm sm:text-base">Admin Panel</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/seller/dashboard">
            <Button variant="outline" size="sm" className="border-border text-xs h-8">
              <LayoutDashboard className="w-3.5 h-3.5 mr-1.5" /> Seller Dashboard
            </Button>
          </Link>
          <button onClick={() => { logout(); setLocation("/"); }} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {[
            { label: "Total Users", value: stats.total, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
            { label: "Pending", value: stats.pending, icon: Clock, color: "text-yellow-500", bg: "bg-yellow-500/10" },
            { label: "Approved", value: stats.approved, icon: UserCheck, color: "text-emerald-500", bg: "bg-emerald-500/10" },
            { label: "Rejected", value: stats.rejected, icon: UserX, color: "text-red-500", bg: "bg-red-500/10" },
            { label: "Banned", value: stats.banned, icon: Ban, color: "text-orange-500", bg: "bg-orange-500/10" },
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div key={card.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-5"
              >
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl ${card.bg} ${card.color} flex items-center justify-center mb-2 sm:mb-3`}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <p className="text-xl sm:text-2xl font-black text-foreground">{card.value}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{card.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-4 sm:mb-6">
          <div className="flex gap-1 flex-wrap">
            {filters.map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  filter === f.key
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {f.label} ({f.count})
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="text" placeholder="Search by name, email..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-secondary/50 border border-border rounded-xl pl-9 pr-3 py-2 text-sm outline-none focus:border-primary transition-colors text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-card border border-border rounded-xl sm:rounded-2xl overflow-hidden">
          {fetching ? (
            <div className="flex items-center justify-center py-20">
              <span className="w-6 h-6 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Users className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <p className="font-bold text-foreground text-sm sm:text-base">No users found</p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {filter === "pending" ? "No users waiting for approval" : "No users match your search"}
              </p>
            </div>
          ) : (
            <div>
              {/* Header - Desktop */}
              <div className="hidden sm:grid sm:grid-cols-12 gap-3 px-5 py-3 border-b border-border/50 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <div className="col-span-3">User</div>
                <div className="col-span-2">Role</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Details</div>
                <div className="col-span-3 text-right">Actions</div>
              </div>

              {/* Rows */}
              {filteredUsers.map((u, i) => (
                <motion.div key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                  className="sm:grid sm:grid-cols-12 sm:gap-3 px-4 sm:px-5 py-3 sm:py-3.5 border-b border-border/30 last:border-0 hover:bg-secondary/20 transition-colors"
                >
                  {/* Mobile card view */}
                  <div className="sm:hidden space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-sm text-foreground">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                      <StatusBadge status={u.status} />
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <RoleBadge role={u.role} />
                      {u.business && <span className="text-xs text-muted-foreground">{u.business}</span>}
                      {u.location && <span className="text-xs text-muted-foreground">{u.location}</span>}
                    </div>
                    <div className="flex gap-2 pt-1 flex-wrap">
                      {u.status === "pending" && (
                        <>
                          <button onClick={() => handleApprove(u.id)} disabled={actionLoading === u.id} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 disabled:opacity-50">
                            {actionLoading === u.id ? <span className="w-3 h-3 border-2 border-emerald-500/40 border-t-emerald-500 rounded-full animate-spin" /> : <Check className="w-3.5 h-3.5" />} Approve
                          </button>
                          <button onClick={() => handleReject(u.id)} disabled={actionLoading === u.id} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-bold bg-red-500/10 text-red-500 border border-red-500/20 disabled:opacity-50">
                            {actionLoading === u.id ? <span className="w-3 h-3 border-2 border-red-500/40 border-t-red-500 rounded-full animate-spin" /> : <X className="w-3.5 h-3.5" />} Reject
                          </button>
                        </>
                      )}
                      {u.status === "approved" && (
                        <>
                          <button onClick={() => handleReject(u.id)} disabled={actionLoading === u.id} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-bold bg-red-500/10 text-red-500 border border-red-500/20 disabled:opacity-50">
                            {actionLoading === u.id ? <span className="w-3 h-3 border-2 border-red-500/40 border-t-red-500 rounded-full animate-spin" /> : <X className="w-3.5 h-3.5" />} Reject
                          </button>
                          <button onClick={() => handleBan(u.id)} disabled={actionLoading === u.id} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-bold bg-orange-500/10 text-orange-500 border border-orange-500/20 disabled:opacity-50">
                            {actionLoading === u.id ? <span className="w-3 h-3 border-2 border-orange-500/40 border-t-orange-500 rounded-full animate-spin" /> : <Ban className="w-3.5 h-3.5" />} Ban
                          </button>
                        </>
                      )}
                      {u.status === "rejected" && (
                        <>
                          <button onClick={() => handleApprove(u.id)} disabled={actionLoading === u.id} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 disabled:opacity-50">
                            {actionLoading === u.id ? <span className="w-3 h-3 border-2 border-emerald-500/40 border-t-emerald-500 rounded-full animate-spin" /> : <Check className="w-3.5 h-3.5" />} Approve
                          </button>
                          <button onClick={() => handleBan(u.id)} disabled={actionLoading === u.id} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-bold bg-orange-500/10 text-orange-500 border border-orange-500/20 disabled:opacity-50">
                            {actionLoading === u.id ? <span className="w-3 h-3 border-2 border-orange-500/40 border-t-orange-500 rounded-full animate-spin" /> : <Ban className="w-3.5 h-3.5" />} Ban
                          </button>
                        </>
                      )}
                      {u.status === "banned" && (
                        <button onClick={() => handleUnban(u.id)} disabled={actionLoading === u.id} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20 disabled:opacity-50">
                          {actionLoading === u.id ? <span className="w-3 h-3 border-2 border-blue-500/40 border-t-blue-500 rounded-full animate-spin" /> : <Unlock className="w-3.5 h-3.5" />} Unban
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Desktop view */}
                  <div className="hidden sm:flex col-span-3 items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                      {u.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-foreground truncate">{u.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                    </div>
                  </div>
                  <div className="hidden sm:flex col-span-2 items-center">
                    <RoleBadge role={u.role} />
                  </div>
                  <div className="hidden sm:flex col-span-2 items-center">
                    <StatusBadge status={u.status} />
                  </div>
                  <div className="hidden sm:flex col-span-2 items-center">
                    <div className="text-xs text-muted-foreground space-y-0.5">
                      {u.business && <p className="flex items-center gap-1"><Building className="w-3 h-3" /> {u.business}</p>}
                      {u.location && <p className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {u.location}</p>}
                      {u.phone && <p className="flex items-center gap-1"><Phone className="w-3 h-3" /> {u.phone}</p>}
                      {u.mobile && <p className="flex items-center gap-1"><Phone className="w-3 h-3" /> {u.mobile}</p>}
                      {!u.business && !u.location && !u.phone && !u.mobile && <span className="text-muted-foreground/50">—</span>}
                    </div>
                  </div>
                  <div className="hidden sm:flex col-span-3 items-center justify-end gap-2">
                    {u.status === "pending" && (
                      <>
                        <button onClick={() => handleApprove(u.id)} disabled={actionLoading === u.id}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all disabled:opacity-50"
                        >{actionLoading === u.id ? <span className="w-3 h-3 border-2 border-emerald-500/40 border-t-emerald-500 rounded-full animate-spin" /> : <Check className="w-3.5 h-3.5" />} Approve</button>
                        <button onClick={() => handleReject(u.id)} disabled={actionLoading === u.id}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 transition-all disabled:opacity-50"
                        >{actionLoading === u.id ? <span className="w-3 h-3 border-2 border-red-500/40 border-t-red-500 rounded-full animate-spin" /> : <X className="w-3.5 h-3.5" />} Reject</button>
                      </>
                    )}
                    {u.status === "approved" && (
                      <>
                        <button onClick={() => handleReject(u.id)} disabled={actionLoading === u.id}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 transition-all disabled:opacity-50"
                        >{actionLoading === u.id ? <span className="w-3 h-3 border-2 border-red-500/40 border-t-red-500 rounded-full animate-spin" /> : <X className="w-3.5 h-3.5" />} Reject</button>
                        <button onClick={() => handleBan(u.id)} disabled={actionLoading === u.id}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border border-orange-500/20 transition-all disabled:opacity-50"
                        >{actionLoading === u.id ? <span className="w-3 h-3 border-2 border-orange-500/40 border-t-orange-500 rounded-full animate-spin" /> : <Ban className="w-3.5 h-3.5" />} Ban</button>
                      </>
                    )}
                    {u.status === "rejected" && (
                      <>
                        <button onClick={() => handleApprove(u.id)} disabled={actionLoading === u.id}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all disabled:opacity-50"
                        >{actionLoading === u.id ? <span className="w-3 h-3 border-2 border-emerald-500/40 border-t-emerald-500 rounded-full animate-spin" /> : <Check className="w-3.5 h-3.5" />} Approve</button>
                        <button onClick={() => handleBan(u.id)} disabled={actionLoading === u.id}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border border-orange-500/20 transition-all disabled:opacity-50"
                        >{actionLoading === u.id ? <span className="w-3 h-3 border-2 border-orange-500/40 border-t-orange-500 rounded-full animate-spin" /> : <Ban className="w-3.5 h-3.5" />} Ban</button>
                      </>
                    )}
                    {u.status === "banned" && (
                      <button onClick={() => handleUnban(u.id)} disabled={actionLoading === u.id}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border border-blue-500/20 transition-all disabled:opacity-50"
                      >{actionLoading === u.id ? <span className="w-3 h-3 border-2 border-blue-500/40 border-t-blue-500 rounded-full animate-spin" /> : <Unlock className="w-3.5 h-3.5" />} Unban</button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RoleBadge({ role }) {
  const colors = {
    admin: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    seller: "bg-primary/10 text-primary border-primary/20",
    buyer: "bg-blue-500/10 text-blue-500 border-blue-500/20"
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold uppercase border ${colors[role] || "bg-secondary text-muted-foreground"}`}>
      {role}
    </span>
  );
}

function StatusBadge({ status }) {
  const config = {
    pending: { icon: Clock, color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20", label: "Pending" },
    approved: { icon: Check, color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20", label: "Approved" },
    rejected: { icon: X, color: "text-red-500 bg-red-500/10 border-red-500/20", label: "Rejected" },
    banned: { icon: Ban, color: "text-orange-500 bg-orange-500/10 border-orange-500/20", label: "Banned" }
  };
  const c = config[status] || config.pending;
  const Icon = c.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold border ${c.color}`}>
      <Icon className="w-3 h-3" /> {c.label}
    </span>
  );
}
