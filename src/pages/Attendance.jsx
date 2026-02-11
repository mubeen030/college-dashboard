import { useState } from "react";
import Navbar from "../components/Navbar";
import {
  Typography,
  Select,
  MenuItem,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Container,
  Paper,
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  IconButton,
} from "@mui/material";

import * as XLSX from "xlsx";

export default function Attendance() {
  const [year, setYear] = useState("FYBCA");
  const [division, setDivision] = useState("A");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendance, setAttendance] = useState({}); // { studentId: "P" | "A" }
  const [markingOpen, setMarkingOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Generate 40 students per year-division
  const generateStudents = () => {
    const years = ["FYBCA", "SYBCA", "TYBCA"];
    const divisions = ["A", "B"];
    let studentList = [];
    let idCounter = 1;

    years.forEach((y) => {
      divisions.forEach((div) => {
        for (let i = 1; i <= 40; i++) {
          studentList.push({
            id: idCounter++,
            roll: `${y.charAt(0)}${div}${String(i).padStart(2, "0")}`,
            name: `Student ${idCounter - 1}`,
            batch: y,
            division: div,
          });
        }
      });
    });
    return studentList;
  };

  const allStudents = generateStudents();
  const filteredStudents = allStudents.filter(
    (s) => s.batch === year && s.division === division
  );

  const currentStudent = filteredStudents[currentIndex];
  const totalStudents = filteredStudents.length;
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalStudents - 1;

  const markAttendance = (status) => {
    if (!currentStudent) return;
    setAttendance((prev) => ({ ...prev, [currentStudent.id]: status }));
    if (!isLast) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const goPrevious = () => {
    if (!isFirst) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const startMarking = () => {
    if (totalStudents === 0) return;
    setCurrentIndex(0);
    setMarkingOpen(true);
  };

  const downloadReport = () => {
    if (Object.keys(attendance).length === 0) {
      alert("No attendance marked yet. Start marking first!");
      return;
    }

    const data = filteredStudents.map((student) => ({
      "Roll No": student.roll,
      "Student Name": student.name,
      "Year": student.batch,
      "Division": student.division,
      "Date": selectedDate,
      "Status": attendance[student.id] === "P" ? "Present" : attendance[student.id] === "A" ? "Absent" : "Not Marked",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    XLSX.writeFile(workbook, `Attendance_${year}_${division}_${selectedDate}.xlsx`);
    alert("Excel file downloaded!");
  };

  const saveRecords = () => {
    if (Object.keys(attendance).length === 0) {
      alert("No attendance to save.");
      return;
    }
    alert(`Would save ${Object.keys(attendance).length} records to backend.\n(Connect to Spring Boot API here)`);
    console.log("Save payload:", { date: selectedDate, year, division, attendance });
  };

  const progress = totalStudents > 0 ? ((currentIndex + 1) / totalStudents) * 100 : 0;

  if (totalStudents === 0) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#f0f4f8", p: 4 }}>
        <Container maxWidth="xl" sx={{ py: 4, pt: 12, textAlign: "center" }}>
          <Typography variant="h5" color="error">
            No students found for {year} – Division {division}
          </Typography>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f1f5f9" }}>
      <Navbar />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={3}
          mb={4}
        >
          <Box>
            <Typography variant="h4" fontWeight={800}>
              Attendance Marking
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Select Year and Division to manage daily attendance
            </Typography>
          </Box>

          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              onClick={downloadReport}
              disabled={Object.keys(attendance).length === 0}
            >
              Download Report
            </Button>
            <Button
              variant="contained"
              sx={{ bgcolor: "#0f172a" }}
              onClick={saveRecords}
              disabled={Object.keys(attendance).length === 0}
            >
              Save Records
            </Button>
          </Stack>
        </Stack>

        {/* Filters */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            border: "1px solid #e2e8f0",
            bgcolor: "white",
          }}
        >
          <Stack direction="row" spacing={2} flexWrap="wrap" alignItems="center">
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Year</InputLabel>
              <Select value={year} label="Year" onChange={(e) => setYear(e.target.value)}>
                <MenuItem value="FYBCA">FYBCA</MenuItem>
                <MenuItem value="SYBCA">SYBCA</MenuItem>
                <MenuItem value="TYBCA">TYBCA</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 140 }}>
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

            <Button variant="contained" onClick={startMarking}>
              Start Marking ({totalStudents} students)
            </Button>
          </Stack>
        </Paper>

        {/* Summary Table */}
        {Object.keys(attendance).length > 0 && (
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              border: "1px solid #e2e8f0",
              bgcolor: "white",
              mb: 4,
            }}
          >
            <Table>
              <TableHead sx={{ bgcolor: "#f8fafc" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Roll No</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Student Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Class</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStudents.map((student) => {
                  const status = attendance[student.id];
                  return (
                    <TableRow key={student.id} hover>
                      <TableCell>{student.roll}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{`${student.batch} - ${student.division}`}</TableCell>
                      <TableCell align="center">
                        {status ? (
                          <Chip
                            label={status === "P" ? "Present" : "Absent"}
                            color={status === "P" ? "success" : "error"}
                            size="small"
                          />
                        ) : (
                          "—"
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Paper>
        )}

        {/* Marking Modal */}
        <Dialog open={markingOpen} onClose={() => setMarkingOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Mark Attendance</Typography>
              <IconButton onClick={() => setMarkingOpen(false)}>
                ×
              </IconButton>
            </Stack>
            <LinearProgress variant="determinate" value={progress} sx={{ mt: 1 }} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Student {currentIndex + 1} of {totalStudents}
            </Typography>
          </DialogTitle>

          <DialogContent dividers>
            {currentStudent && (
              <Box textAlign="center" py={4}>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  {currentStudent.roll} – {currentStudent.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  {currentStudent.batch} – Division {currentStudent.division}
                </Typography>

                <Stack direction="row" spacing={4} justifyContent="center" mt={6}>
                  <Button
                    variant={attendance[currentStudent.id] === "P" ? "contained" : "outlined"}
                    color="success"
                    size="large"
                    sx={{ minWidth: 160, py: 2 }}
                    onClick={() => markAttendance("P")}
                  >
                    Present
                  </Button>

                  <Button
                    variant={attendance[currentStudent.id] === "A" ? "contained" : "outlined"}
                    color="error"
                    size="large"
                    sx={{ minWidth: 160, py: 2 }}
                    onClick={() => markAttendance("A")}
                  >
                    Absent
                  </Button>
                </Stack>
              </Box>
            )}
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 3 }}>

            <Button onClick={goPrevious} disabled={isFirst}>Previous</Button>
            <Button variant="contained" onClick={() => isLast ? setMarkingOpen(false) : setCurrentIndex(p => p + 1)}>
              {isLast ? "Finish" : "Next"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}