import { useState } from "react";
import Navbar from "../components/Navbar";
import { 
  Typography, Select, MenuItem, TextField, Table, TableBody, 
  TableCell, TableHead, TableRow, Container, Paper, Box, Button, Chip,
  FormControl, InputLabel, Stack 
} from "@mui/material";
import { motion } from "framer-motion";
import { Save, CheckCircle, XCircle, Download } from "lucide-react";
import * as XLSX from 'xlsx';

export default function Attendance() {
  const [year, setYear] = useState("FYBCA");
  const [division, setDivision] = useState("A");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState({});

  // Dynamically generate 15 students for every Year/Division combination
  const generateStudents = () => {
    const years = ["FYBCA", "SYBCA", "TYBCA"];
    const divisions = ["A", "B"];
    let studentList = [];
    let idCounter = 1;

    years.forEach((y) => {
      divisions.forEach((div) => {
        for (let i = 1; i <= 15; i++) {
          studentList.push({
            id: idCounter++,
            roll: `${y.charAt(0)}${div}${String(i).padStart(2, '0')}`,
            name: `Student ${idCounter - 1}`,
            batch: y,
            division: div
          });
        }
      });
    });
    return studentList;
  };

  const allStudents = generateStudents();

  // Filter based on Year AND Division
  const filteredStudents = allStudents.filter(
    (s) => s.batch === year && s.division === division
  );

  const toggleAttendance = (id, status) => {
    setAttendance(prev => ({
      ...prev,
      [id]: prev[id] === status ? undefined : status
    }));
  };

  const downloadExcel = () => {
    const data = filteredStudents.map(student => ({
      "Roll No": student.roll,
      "Student Name": student.name,
      "Year": student.batch,
      "Division": student.division,
      "Date": selectedDate,
      "Status": attendance[student.id] === "P" ? "Present" : attendance[student.id] === "A" ? "Absent" : "Not Marked"
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    XLSX.writeFile(workbook, `Attendance_${year}_Div${division}_${selectedDate}.xlsx`);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc" }}>
      <Navbar />
      <Container maxWidth="xl" sx={{ py: 4, pt: 12 }}>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          
          <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems="center" spacing={3} mb={4}>
            <Box>
              <Typography variant="h4" fontWeight={800}>Attendance Marking</Typography>
              <Typography variant="body2" color="text.secondary">
                Select Year and Division to manage daily attendance
              </Typography>
            </Box>

            <Stack direction="row" spacing={2}>
              <Button 
                variant="outlined" 
                startIcon={<Download size={18} />} 
                onClick={downloadExcel}
                sx={{ borderRadius: 2, textTransform: 'none' }}
              >
                Download Report
              </Button>
              <Button variant="contained" startIcon={<Save size={18} />} sx={{ borderRadius: 2, bgcolor: "#0f172a", textTransform: 'none' }}>
                Save Records
              </Button>
            </Stack>
          </Stack>

          {/* FILTERS */}
          <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 3, border: "1px solid #e2e8f0", background: "white" }}>
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                <FormControl size="small" sx={{ minWidth: 140 }}>
                  <InputLabel>Year</InputLabel>
                  <Select value={year} label="Year" onChange={(e) => setYear(e.target.value)}>
                      <MenuItem value="FYBCA">FYBCA</MenuItem>
                      <MenuItem value="SYBCA">SYBCA</MenuItem>
                      <MenuItem value="TYBCA">TYBCA</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Division</InputLabel>
                  <Select value={division} label="Division" onChange={(e) => setDivision(e.target.value)}>
                      <MenuItem value="A">Division A</MenuItem>
                      <MenuItem value="B">Division B</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  type="date"
                  size="small"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  sx={{ width: 180 }}
                />
            </Stack>
          </Paper>

          <Paper elevation={0} sx={{ borderRadius: 3, overflow: "hidden", border: "1px solid #e2e8f0", bgcolor: "white" }}>
            <Table>
              <TableHead sx={{ bgcolor: "#f8fafc" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Roll No</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Student Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Class</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStudents.map((student) => {
                  const status = attendance[student.id];
                  return (
                    <TableRow key={student.id} hover>
                      <TableCell sx={{ fontWeight: 600, color: "#475569" }}>{student.roll}</TableCell>
                      <TableCell><Typography fontWeight={600}>{student.name}</Typography></TableCell>
                      <TableCell>
                        <Chip label={`${student.batch} - ${student.division}`} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Button
                            size="small"
                            variant={status === "P" ? "contained" : "outlined"}
                            onClick={() => toggleAttendance(student.id, "P")}
                            color="success"
                            sx={{ borderRadius: 5, minWidth: 100, textTransform: 'none' }}
                            startIcon={status === "P" ? <CheckCircle size={14} /> : null}
                          >
                            Present
                          </Button>
                          <Button
                            size="small"
                            variant={status === "A" ? "contained" : "outlined"}
                            onClick={() => toggleAttendance(student.id, "A")}
                            color="error"
                            sx={{ borderRadius: 5, minWidth: 100, textTransform: 'none' }}
                            startIcon={status === "A" ? <XCircle size={14} /> : null}
                          >
                            Absent
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}