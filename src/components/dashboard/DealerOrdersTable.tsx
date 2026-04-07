import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ClipboardList, Search, X } from "lucide-react";
import type { DistributionRequest } from "@/hooks/useDistributionRequests";

interface DealerOrdersTableProps {
  requests: DistributionRequest[];
  onApproveAndShip: (id: string) => void;
  onUpdateStatus: (id: string, status: "pending" | "approved" | "shipped" | "delivered" | "rejected") => void;
  onModify: (request: DistributionRequest) => void;
}

const DealerOrdersTable = ({ requests, onApproveAndShip, onUpdateStatus, onModify }: DealerOrdersTableProps) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (priorityFilter !== "all" && r.priority !== priorityFilter) return false;
      if (dateFilter && !r.created_at.startsWith(dateFilter)) return false;
      if (search) {
        const q = search.toLowerCase();
        const matches =
          r.request_number.toLowerCase().includes(q) ||
          r.shops?.name?.toLowerCase().includes(q) ||
          r.products?.name?.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [requests, search, statusFilter, priorityFilter, dateFilter]);

  const hasFilters = search || statusFilter !== "all" || priorityFilter !== "all" || dateFilter;

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setDateFilter("");
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-soft">
      <div className="flex items-center gap-2 mb-4">
        <ClipboardList className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold text-foreground">All Incoming Orders</h2>
        <Badge variant="secondary" className="ml-auto">{filtered.length} of {requests.length}</Badge>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by request #, shop, or product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="w-[160px]"
        />
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
            <X className="w-4 h-4" />Clear
          </Button>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          {requests.length === 0 ? "No distribution requests yet" : "No orders match the current filters"}
        </p>
      ) : (
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request #</TableHead>
                <TableHead>Shop</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-mono font-semibold">#{request.request_number}</TableCell>
                  <TableCell>{request.shops?.name || "—"}</TableCell>
                  <TableCell>{request.products?.name || "—"}</TableCell>
                  <TableCell>{request.quantity} bags</TableCell>
                  <TableCell>
                    <Badge variant={request.priority === "high" ? "destructive" : request.priority === "medium" ? "secondary" : "outline"}>
                      {request.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      request.status === "delivered" ? "default" :
                      request.status === "shipped" ? "secondary" :
                      request.status === "rejected" ? "destructive" : "outline"
                    }>
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(request.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {request.status === "pending" && (
                        <>
                          <Button size="sm" onClick={() => onApproveAndShip(request.id)}>Ship</Button>
                          <Button size="sm" variant="outline" onClick={() => onModify(request)}>Modify</Button>
                        </>
                      )}
                      {request.status === "shipped" && (
                        <Button size="sm" variant="secondary" onClick={() => onUpdateStatus(request.id, "delivered")}>Mark Delivered</Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default DealerOrdersTable;
