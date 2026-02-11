import { useState, useRef } from "react";
import Navbar from "../components/Navbar";
import {
  Typography, Container, Box, TextField, Button, Chip, Stack, 
  Avatar, Grid, Card, IconButton, Dialog, Divider, MenuItem, Select, FormControl, InputLabel
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Search, Filter, FileCheck, GraduationCap, Printer } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function AdvancedAcademicPortal() {
  const [filterYear, setFilterYear] = useState("All");
  const [filterDiv, setFilterDiv] = useState("All");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const reportTemplateRef = useRef(null);

  // 10 Students with Year and Division
  const [students] = useState([
    { id: 1, roll: "BCA26-001", name: "Rahul Sharma", year: "FYBCA", div: "A", colors: ["#6366f1", "#4338ca"] },
    { id: 2, roll: "BCA26-002", name: "Aisha Verma", year: "FYBCA", div: "B", colors: ["#ec4899", "#be185d"] },
    { id: 3, roll: "2305118", name: "Mohammed Ashif", year: "TYBCA", div: "B", colors: ["#10b981", "#047857"] },
    { id: 4, roll: "BCA26-004", name: "Priya Das", year: "SYBCA", div: "B", colors: ["#f59e0b", "#b45309"] },
    { id: 5, roll: "BCA26-005", name: "Kevin Peter", year: "TYBCA", div: "A", colors: ["#3b82f6", "#1d4ed8"] },
    { id: 6, roll: "BCA26-006", name: "Ishita Rao", year: "TYBCA", div: "B", colors: ["#8b5cf6", "#6d28d9"] },
    { id: 7, roll: "BCA26-007", name: "Arjun Mehra", year: "FYBCA", div: "A", colors: ["#06b6d4", "#0891b2"] },
    { id: 8, roll: "BCA26-008", name: "Sana Khan", year: "SYBCA", div: "A", colors: ["#f43f5e", "#e11d48"] },
    { id: 9, roll: "BCA26-009", name: "Vikram Singh", year: "TYBCA", div: "B", colors: ["#71717a", "#3f3f46"] },
    { id: 10, roll: "BCA26-010", name: "Ananya Roy", year: "SYBCA", div: "B", colors: ["#fbbf24", "#d97706"] },
  ]);

  // Mock subjects with Credits for SGPA calculation
  const subjects = [
    { name: "C++ Programming", credit: 4, marks: 85 },
    { name: "Database Systems", credit: 4, marks: 78 },
    { name: "Operating Systems", credit: 3, marks: 92 },
    { name: "Software Eng.", credit: 3, marks: 70 },
    { name: "Mathematics", credit: 2, marks: 88 }
  ];

  const calculateSGPA = (subList) => {
    let totalPoints = 0;
    let totalCredits = 0;
    subList.forEach(s => {
      const gp = s.marks >= 90 ? 10 : s.marks >= 80 ? 9 : s.marks >= 70 ? 8 : s.marks >= 60 ? 7 : s.marks >= 50 ? 6 : 0;
      totalPoints += (gp * s.credit);
      totalCredits += s.credit;
    });
    return (totalPoints / totalCredits).toFixed(2);
  };

  const handleExportPDF = async () => {
    const element = reportTemplateRef.current;
    const canvas = await html2canvas(element, { scale: 3, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(imgData, "PNG", 0, 0, 210, 297); // Full A4
    pdf.save(`${selectedStudent.name}_Result.pdf`);
  };

  const filteredStudents = students.filter(s => 
    (filterYear === "All" || s.year === filterYear) && 
    (filterDiv === "All" || s.div === filterDiv)
  );

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f1f5f9" }}>
      <Navbar />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        
        {/* Modern Dashboard Header */}
        <Grid container spacing={3} mb={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h4" fontWeight={900} color="#1e293b">Student Analytics Portal</Typography>
            <Typography variant="body2" color="text.secondary">Academic Year 2025-26 • Division Management</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack direction="row" spacing={2} justifyContent={{ md: "flex-end" }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Year</InputLabel>
                <Select value={filterYear} label="Year" onChange={(e) => setFilterYear(e.target.value)} sx={{ borderRadius: 3, bgcolor: 'white' }}>
                  <MenuItem value="All">All Years</MenuItem>
                  <MenuItem value="FYBCA">FYBCA</MenuItem>
                  <MenuItem value="SYBCA">SYBCA</MenuItem>
                  <MenuItem value="TYBCA">TYBCA</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 100 }}>
                <InputLabel>Div</InputLabel>
                <Select value={filterDiv} label="Div" onChange={(e) => setFilterDiv(e.target.value)} sx={{ borderRadius: 3, bgcolor: 'white' }}>
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="A">Div A</MenuItem>
                  <MenuItem value="B">Div B</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Grid>
        </Grid>

        {/* Student Grid */}
        <Grid container spacing={2}>
          <AnimatePresence mode="popLayout">
            {filteredStudents.map((s) => (
              <Grid item xs={12} sm={6} md={4} lg={2.4} key={s.id}>
                <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Card 
                    onClick={() => setSelectedStudent(s)}
                    sx={{ 
                      borderRadius: 4, cursor: "pointer", transition: "0.3s",
                      "&:hover": { transform: "translateY(-5px)", boxShadow: "0 12px 20px rgba(0,0,0,0.1)" }
                    }}
                  >
                    <Box sx={{ p: 2, textAlign: "center" }}>
                      <Avatar sx={{ 
                        width: 60, height: 60, mx: "auto", mb: 2, 
                        background: `linear-gradient(135deg, ${s.colors[0]}, ${s.colors[1]})` 
                      }}>
                        {s.name.charAt(0)}
                      </Avatar>
                      <Typography fontWeight={800} noWrap>{s.name}</Typography>
                      <Typography variant="caption" color="text.secondary" display="block">{s.roll}</Typography>
                      <Stack direction="row" justifyContent="center" spacing={1} mt={1}>
                        <Chip label={s.year} size="small" sx={{ fontSize: 10, height: 20 }} />
                        <Chip label={`Div ${s.div}`} variant="outlined" size="small" sx={{ fontSize: 10, height: 20 }} />
                      </Stack>
                    </Box>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </AnimatePresence>
        </Grid>

        {/* PROFESSIONAL REPORT DIALOG */}
        <Dialog 
          open={!!selectedStudent} onClose={() => setSelectedStudent(null)} 
          maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 0 } }}
        >
          {selectedStudent && (
            <Box>
              <Box sx={{ p: 2, bgcolor: "#1e293b", color: "white", display: "flex", justifyContent: "space-between" }}>
                <Typography fontWeight={700}>Previewing Transcript: {selectedStudent.name}</Typography>
                <Stack direction="row" spacing={1}>
                  <Button variant="contained" color="success" size="small" startIcon={<Download />} onClick={handleExportPDF}>Download PDF</Button>
                  <IconButton onClick={() => setSelectedStudent(null)} sx={{ color: "white" }}><X /></IconButton>
                </Stack>
              </Box>

              {/* PDF CONTENT AREA (A4 Ratio) */}
              <Box ref={reportTemplateRef} sx={{ p: "20mm", width: "210mm", height: "297mm", bgcolor: "white", color: "black", mx: "auto", position: "relative" }}>
                {/* Formal Header */}
                <Box textAlign="center" mb={4} borderBottom="2px solid black" pb={2}>
                  <Typography variant="h5" fontWeight={900}>INSTITUTE OF COMPUTER APPLICATIONS</Typography>
                  <Typography variant="body2">Affiliated to University of Excellence • ISO 9001:2015 Certified</Typography>
                  <Typography variant="subtitle1" fontWeight={700} mt={1} sx={{ letterSpacing: 2 }}>OFFICIAL MARK STATEMENT</Typography>
                </Box>

                <Grid container mb={4}>
                  <Grid item xs={6}>
                    <Typography variant="body2"><b>Student Name:</b> {selectedStudent.name}</Typography>
                    <Typography variant="body2"><b>Roll Number:</b> {selectedStudent.roll}</Typography>
                    <Typography variant="body2"><b>Course:</b> BCA - Three Year Degree</Typography>
                  </Grid>
                  <Grid item xs={6} textAlign="right">
                    <Typography variant="body2"><b>Year:</b> {selectedStudent.year}</Typography>
                    <Typography variant="body2"><b>Division:</b> {selectedStudent.div}</Typography>
                    <Typography variant="body2"><b>Exam Month:</b> Jan 2026</Typography>
                  </Grid>
                </Grid>

                {/* The Grade Table */}
                <Box component="table" sx={{ width: "100%", borderCollapse: "collapse", mb: 4 }}>
                  <thead>
                    <tr style={{ backgroundColor: "#f8fafc" }}>
                      <th style={{ border: "1px solid #000", padding: "10px", textAlign: "left" }}>Subject Description</th>
                      <th style={{ border: "1px solid #000", padding: "10px" }}>Credits</th>
                      <th style={{ border: "1px solid #000", padding: "10px" }}>Marks</th>
                      <th style={{ border: "1px solid #000", padding: "10px" }}>Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjects.map((sub, i) => (
                      <tr key={i}>
                        <td style={{ border: "1px solid #000", padding: "10px" }}>{sub.name}</td>
                        <td style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>{sub.credit}</td>
                        <td style={{ border: "1px solid #000", padding: "10px", textAlign: "center" }}>{sub.marks}</td>
                        <td style={{ border: "1px solid #000", padding: "10px", textAlign: "center", fontWeight: "bold" }}>
                          {sub.marks >= 90 ? "O" : sub.marks >= 80 ? "A+" : "A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Box>

                {/* SGPA Summary */}
                <Box sx={{ border: "2px solid #000", p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="h6" fontWeight={900}>SEMESTER GRADE POINT AVERAGE (SGPA)</Typography>
                  <Typography variant="h4" fontWeight={900}>{calculateSGPA(subjects)}</Typography>
                </Box>

                <Box mt={10} display="flex" justifyContent="space-between">
                   <Box textAlign="center">
                      <Divider sx={{ width: 100, mb: 1, borderColor: "black" }} />
                      <Typography variant="caption">Controller of Exams</Typography>
                   </Box>
                   <Box textAlign="center">
                      <Divider sx={{ width: 100, mb: 1, borderColor: "black" }} />
                      <Typography variant="caption">Principal Signature</Typography>
                   </Box>
                </Box>

                {/* Watermark */}
                <Typography sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%) rotate(-45deg)", opacity: 0.05, fontSize: "80px", fontWeight: 900, pointerEvents: "none", width: "100%", textAlign: "center" }}>
                </Typography>
              </Box>
            </Box>
          )}
        </Dialog>
      </Container>
    </Box>
  );
}