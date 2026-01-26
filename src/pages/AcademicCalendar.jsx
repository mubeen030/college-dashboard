import { useState } from "react";
import Navbar from "../components/Navbar";
import {
  Box,
  Container,
  Paper,
  Typography,
  IconButton,
  Stack,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  MenuItem,
  useTheme,
  Tooltip,
  Divider,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Plus,
  X,
  BookOpen,
  Sun,
  AlertCircle,
  Star,
  Trash2,
  MoreHorizontal,
} from "lucide-react";

// ────────────────────────────────────────────────
// Configuration & Utilities
// ────────────────────────────────────────────────
const EVENT_TYPES = {
  exam: { label: "Exam", color: "#6366f1", bg: "#e0e7ff", icon: <BookOpen size={16} /> },
  holiday: { label: "Holiday", color: "#f43f5e", bg: "#ffe4e6", icon: <Sun size={16} /> },
  deadline: { label: "Deadline", color: "#f59e0b", bg: "#fef3c7", icon: <AlertCircle size={16} /> },
  event: { label: "Event", color: "#10b981", bg: "#d1fae5", icon: <Star size={16} /> },
};

const MOCK_EVENTS = [
  { id: 1, date: "2026-01-26", title: "Republic Day", type: "holiday", time: "All Day", location: "Nationwide" },
  { id: 2, date: "2026-02-10", title: "Internal Assessment", type: "exam", time: "10:00 – 13:00", location: "Block B" },
  { id: 3, date: "2026-02-14", title: "Tech Fest 2026", type: "event", time: "09:00 – 18:00", location: "Main Ground" },
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function AcademicCalendar() {
  const theme = useTheme();
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1));
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 0, 26)); // Default selection
  const [open, setOpen] = useState(false);
  
  // New Event Form State
  const [newEvent, setNewEvent] = useState({ title: "", type: "event", time: "", location: "" });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getEventsForDate = (dateObj) => {
    const dateStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")}`;
    return events.filter((e) => e.date === dateStr);
  };

  // ─── Actions ────────────────────────────────────────────────
  const handleAddEvent = () => {
    const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;
    const eventToAdd = { ...newEvent, id: Date.now(), date: dateStr };
    setEvents([...events, eventToAdd]);
    setOpen(false);
    setNewEvent({ title: "", type: "event", time: "", location: "" });
  };

  const handleDeleteEvent = (id) => {
    setEvents(events.filter((e) => e.id !== id));
  };

  const openAddModal = () => {
    setNewEvent({ title: "", type: "event", time: "", location: "" });
    setOpen(true);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc" }}>
      <Navbar />

      <Container maxWidth="xl" sx={{ pt: 12, pb: 8 }}>
        
        {/* ─── Header Section ───────────────────────────── */}
        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems="center" mb={6} spacing={2}>
          <Box>
            <Typography variant="h4" fontWeight={800} color="#1e293b">
              Academic Calendar
            </Typography>
            <Typography color="text.secondary" fontWeight={500}>
              Manage your schedule, exams, and holidays
            </Typography>
          </Box>
          
          <Stack direction="row" spacing={2} bgcolor="white" p={0.5} borderRadius="12px" boxShadow="0 2px 10px rgba(0,0,0,0.03)">
            <Button
              startIcon={<ChevronLeft size={18} />}
              onClick={prevMonth}
              sx={{ color: "#64748b", minWidth: 40, borderRadius: "8px" }}
            />
             <Typography variant="h6" fontWeight={700} sx={{ width: 140, textAlign: "center", py: 0.5 }}>
              {MONTHS[month]} {year}
            </Typography>
            <Button
              endIcon={<ChevronRight size={18} />}
              onClick={nextMonth}
              sx={{ color: "#64748b", minWidth: 40, borderRadius: "8px" }}
            />
          </Stack>
        </Stack>

        <Stack direction={{ xs: "column", lg: "row" }} spacing={4}>
          
          {/* ─── Left: Calendar Grid ───────────────────────────── */}
          <Paper
            elevation={0}
            sx={{
              flex: 2,
              borderRadius: "24px",
              overflow: "hidden",
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
            }}
          >
            {/* Weekday Headers */}
            <Box
              display="grid"
              gridTemplateColumns="repeat(7, 1fr)"
              sx={{ borderBottom: "1px solid", borderColor: "divider", bgcolor: "#f8fafc" }}
            >
              {DAYS.map((day) => (
                <Box key={day} py={2} textAlign="center">
                  <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
                    {day}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Calendar Cells */}
            <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" sx={{ bgcolor: "divider", gap: "1px" }}>
              {/* Empty cells for previous month */}
              {Array.from({ length: getFirstDayOfMonth(year, month) }).map((_, i) => (
                <Box key={`empty-${i}`} sx={{ bgcolor: "white", minHeight: 120 }} />
              ))}

              {/* Days */}
              {Array.from({ length: getDaysInMonth(year, month) }).map((_, i) => {
                const day = i + 1;
                const dateObj = new Date(year, month, day);
                const isSelected = selectedDate.toDateString() === dateObj.toDateString();
                const isToday = new Date().toDateString() === dateObj.toDateString();
                const dayEvents = getEventsForDate(dateObj);

                return (
                  <Box
                    key={day}
                    onClick={() => setSelectedDate(dateObj)}
                    sx={{
                      bgcolor: isSelected ? "#f0f9ff" : "white",
                      minHeight: 120,
                      p: 1.5,
                      cursor: "pointer",
                      position: "relative",
                      transition: "all 0.2s",
                      "&:hover": { bgcolor: "#f8fafc" },
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between">
                      <Typography
                        fontWeight={isToday ? 900 : 500}
                        sx={{
                          width: 28,
                          height: 28,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "50%",
                          bgcolor: isToday ? "primary.main" : "transparent",
                          color: isToday ? "white" : "text.primary",
                        }}
                      >
                        {day}
                      </Typography>
                    </Stack>

                    {/* Event Dots */}
                    <Stack direction="row" spacing={0.5} mt={1} flexWrap="wrap" useFlexGap>
                      {dayEvents.map((ev) => (
                        <Tooltip key={ev.id} title={ev.title}>
                           <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              bgcolor: EVENT_TYPES[ev.type].color,
                            }}
                          />
                        </Tooltip>
                      ))}
                    </Stack>
                  </Box>
                );
              })}
              
              {/* Fill remaining grid to make it square if needed */}
              {Array.from({ length: 42 - (getDaysInMonth(year, month) + getFirstDayOfMonth(year, month)) }).map((_, i) => (
                 <Box key={`fill-${i}`} sx={{ bgcolor: "#fafafa", minHeight: 120 }} />
              ))}
            </Box>
          </Paper>

          {/* ─── Right: Side Panel ───────────────────────────── */}
          <Box sx={{ flex: 1, minWidth: 350 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: "24px",
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "rgba(255,255,255,0.8)",
                backdropFilter: "blur(12px)",
                position: "sticky",
                top: 24,
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={3}>
                <Box>
                   <Typography variant="h5" fontWeight={800}>
                    {selectedDate.getDate()} {MONTHS[selectedDate.getMonth()]}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedDate.toLocaleDateString("en-US", { weekday: "long" })}
                  </Typography>
                </Box>
                <Button 
                  variant="contained" 
                  size="small" 
                  startIcon={<Plus size={16} />}
                  onClick={openAddModal}
                  sx={{ borderRadius: "20px", textTransform: "none", boxShadow: 'none' }}
                >
                  Add Event
                </Button>
              </Stack>

              <Divider sx={{ mb: 3 }} />

              <Stack spacing={2}>
                <AnimatePresence mode="popLayout">
                  {getEventsForDate(selectedDate).length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                       <Box textAlign="center" py={4} color="text.secondary">
                          <CalendarIcon size={40} style={{ opacity: 0.3, marginBottom: 10 }} />
                          <Typography>No events for this day.</Typography>
                       </Box>
                    </motion.div>
                  ) : (
                    getEventsForDate(selectedDate).map((ev) => (
                      <motion.div
                        key={ev.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                      >
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            borderRadius: "16px",
                            border: "1px solid",
                            borderColor: "divider",
                            display: "flex",
                            gap: 2,
                            position: "relative",
                            transition: "transform 0.2s",
                            "&:hover": { transform: "translateY(-2px)", borderColor: "primary.light" }
                          }}
                        >
                          <Box
                            sx={{
                              width: 4,
                              borderRadius: 4,
                              bgcolor: EVENT_TYPES[ev.type].color,
                            }}
                          />
                          <Box flex={1}>
                            <Typography variant="subtitle2" fontWeight={700}>
                              {ev.title}
                            </Typography>
                            <Stack direction="row" spacing={2} mt={1} color="text.secondary">
                              <Stack direction="row" alignItems="center" spacing={0.5}>
                                <Clock size={12} />
                                <Typography variant="caption">{ev.time}</Typography>
                              </Stack>
                              <Stack direction="row" alignItems="center" spacing={0.5}>
                                <MapPin size={12} />
                                <Typography variant="caption">{ev.location}</Typography>
                              </Stack>
                            </Stack>
                          </Box>
                          
                          <IconButton 
                            size="small" 
                            onClick={() => handleDeleteEvent(ev.id)}
                            sx={{ 
                                position: 'absolute', 
                                top: 8, 
                                right: 8, 
                                opacity: 0.4, 
                                '&:hover': { opacity: 1, color: 'error.main', bgcolor: 'error.50' } 
                            }}
                          >
                            <Trash2 size={16} />
                          </IconButton>
                        </Paper>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </Stack>
            </Paper>
          </Box>

        </Stack>
      </Container>

      {/* ─── Add Event Modal ───────────────────────────── */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{ sx: { borderRadius: "20px", p: 1, width: '100%', maxWidth: 450 } }}
      >
        <DialogTitle>Add Event for {selectedDate.toLocaleDateString()}</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} mt={1}>
            <TextField
              label="Title"
              fullWidth
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            />
            <TextField
              select
              label="Type"
              fullWidth
              value={newEvent.type}
              onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
            >
              {Object.entries(EVENT_TYPES).map(([key, val]) => (
                <MenuItem key={key} value={key}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: val.color }} />
                    <Typography>{val.label}</Typography>
                  </Stack>
                </MenuItem>
              ))}
            </TextField>
            <Stack direction="row" spacing={2}>
               <TextField
                label="Time"
                fullWidth
                placeholder="10:00 AM"
                value={newEvent.time}
                onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
              />
               <TextField
                label="Location"
                fullWidth
                placeholder="Room 101"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)} color="inherit">Cancel</Button>
          <Button variant="contained" onClick={handleAddEvent} disabled={!newEvent.title}>
            Save Event
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}