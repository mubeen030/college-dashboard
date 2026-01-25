import { useState, useRef } from "react";
import Navbar from "../components/Navbar";
import {
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  Container,
  Stack,
  IconButton,
  Tooltip,
  Alert,
  Chip,
  Fade,
  Avatar,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  FileText,
  X,
  Calendar,
  Trash2,
  Bell,
  CheckCircle2,
  AlertCircle,
  Paperclip,
  Download,
} from "lucide-react";

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

const mockNotices = [
  {
    id: 3,
    title: "Mid-Term Examination Schedule Released",
    message: "All students are requested to check the timetable on the portal.",
    date: "2026-01-10",
    attachment: null,
  },
];

export default function Notices() {
  const fileInputRef = useRef(null);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [notices, setNotices] = useState(mockNotices);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // --- FILE HANDLING ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError("File is too large (Max 10MB)");
        return;
      }
      setSelectedFile(file);
      setError("");
    }
  };

  const handleDownload = (file) => {
    if (!file || !(file instanceof File)) {
      alert("No downloadable file found for this notice.");
      return;
    }
    const url = window.URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", file.name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // --- ACTIONS ---
  const handlePublish = () => {
    if (!title.trim() || !message.trim()) {
      setError("Title and Message are required!");
      return;
    }

    const newNotice = {
      id: Date.now(),
      title: title.trim(),
      message: message.trim(),
      date: new Date().toISOString().split("T")[0],
      attachment: selectedFile,
    };

    setNotices((prev) => [newNotice, ...prev]);
    setSuccess(true);
    setError("");

    // Reset Form
    setTimeout(() => {
      setTitle("");
      setMessage("");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setSuccess(false);
    }, 1500);
  };

  const handleConfirmDelete = (id) => {
    setNotices((prev) => prev.filter((notice) => notice.id !== id));
    setDeleteConfirmId(null);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc" }}>
      <Navbar />

      <Container maxWidth="md" sx={{ pt: 12, pb: 8 }}>
        <Stack direction="row" alignItems="center" spacing={2} mb={4}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
            <Bell size={28} />
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight={800}>Notice Board</Typography>
            <Typography color="text.secondary">Post updates and share documents</Typography>
          </Box>
        </Stack>

        <Stack spacing={4}>
          {/* COMPOSER */}
          <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0' }}>
            <Stack spacing={3}>
              <TextField fullWidth label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
              <TextField fullWidth multiline rows={3} label="Message" value={message} onChange={(e) => setMessage(e.target.value)} />
              
              <Box>
                <input type="file" hidden ref={fileInputRef} onChange={handleFileChange} />
                {!selectedFile ? (
                  <Button variant="outlined" startIcon={<Paperclip size={18} />} onClick={() => fileInputRef.current.click()}>
                    Attach File
                  </Button>
                ) : (
                  <Chip label={selectedFile.name} onDelete={() => setSelectedFile(null)} color="primary" />
                )}
              </Box>

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  {success && <Chip label="Published!" color="success" size="small" />}
                  {error && <Typography color="error" variant="caption">{error}</Typography>}
                </Box>
                <Button variant="contained" onClick={handlePublish} startIcon={<Send size={18} />}>Publish</Button>
              </Stack>
            </Stack>
          </Paper>

          {/* LIST */}
          <Typography variant="h6" fontWeight={700}>Recent Notices</Typography>
          <Stack spacing={2}>
            <AnimatePresence mode="popLayout">
              {notices.map((notice) => (
                <motion.div key={notice.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', position: 'relative' }}>
                    <Stack direction="row" justifyContent="space-between" spacing={2}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="caption" color="text.secondary">{formatDate(notice.date)}</Typography>
                        <Typography variant="h6" fontWeight={700}>{notice.title}</Typography>
                        <Typography variant="body2" color="text.secondary" mb={2}>{notice.message}</Typography>

                        {notice.attachment && (
                          <Button 
                            variant="outlined" 
                            size="small" 
                            startIcon={<Download size={14} />}
                            onClick={() => handleDownload(notice.attachment)}
                          >
                            Download Attachment
                          </Button>
                        )}
                      </Box>

                      {/* DELETE ACTION AREA */}
                      <Box>
                        {deleteConfirmId === notice.id ? (
                          <Stack direction="row" spacing={1}>
                            <Button size="small" color="error" variant="contained" onClick={() => handleConfirmDelete(notice.id)}>Confirm</Button>
                            <Button size="small" onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
                          </Stack>
                        ) : (
                          <IconButton onClick={() => setDeleteConfirmId(notice.id)} color="default">
                            <Trash2 size={18} />
                          </IconButton>
                        )}
                      </Box>
                    </Stack>
                  </Paper>
                </motion.div>
              ))}
            </AnimatePresence>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}