import { Typography, Grid, Card, Box, Container, alpha, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

// Icons
import PeopleAltTwoToneIcon from '@mui/icons-material/PeopleAltTwoTone';
import AssessmentTwoToneIcon from '@mui/icons-material/AssessmentTwoTone';
import CampaignTwoToneIcon from '@mui/icons-material/CampaignTwoTone';
import InsightsTwoToneIcon from '@mui/icons-material/InsightsTwoTone';
import CalendarMonthTwoToneIcon from '@mui/icons-material/CalendarMonthTwoTone';
import AccessTimeTwoToneIcon from '@mui/icons-material/AccessTimeTwoTone';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const cardVariants = {
  hidden: { y: 40, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  },
  hover: { 
    y: -8,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

export default function Dashboard() {
  const navigate = useNavigate();

  const menuItems = [
    { 
      title: "Attendance", 
      subtitle: "Track daily presence", 
      icon: <PeopleAltTwoToneIcon fontSize="large" />, 
      path: "/attendance", 
      color: "#3B82F6" 
    },
    { 
      title: "Results", 
      subtitle: "Manage student grades", 
      icon: <AssessmentTwoToneIcon fontSize="large" />, 
      path: "/results", 
      color: "#8B5CF6" 
    },
    { 
      title: "Notices", 
      subtitle: "Campus announcements", 
      icon: <CampaignTwoToneIcon fontSize="large" />, 
      path: "/notices", 
      color: "#F59E0B" 
    },
    { 
      title: "Reports", 
      subtitle: "Deep data insights", 
      icon: <InsightsTwoToneIcon fontSize="large" />, 
      path: "/reports", 
      color: "#10B981" 
    },
    { 
      title: "Calendar", 
      subtitle: "Events & Holidays", 
      icon: <CalendarMonthTwoToneIcon fontSize="large" />, 
      path: "/calendar", 
      color: "#EC4899" 
    },
    { 
      title: "Time Table", 
      subtitle: "Weekly Class Schedule", 
      icon: <AccessTimeTwoToneIcon fontSize="large" />, 
      path: "/timetable", 
      color: "#F43F5E" 
    },
  ];

  return (
    <Box sx={{ 
      minHeight: "100vh", 
      position: "relative",
      overflow: "hidden", // Prevents scrollbars from background blur
      bgcolor: "#fdfdfd",
      "&::before": {
        content: '""',
        position: "absolute",
        top: -100,
        right: -100,
        width: "500px",
        height: "500px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(96,165,250,0.15) 0%, rgba(255,255,255,0) 70%)",
        filter: "blur(60px)",
        zIndex: 0
      },
      "&::after": {
        content: '""',
        position: "absolute",
        bottom: -100,
        left: -100,
        width: "600px",
        height: "600px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(167,139,250,0.1) 0%, rgba(255,255,255,0) 70%)",
        filter: "blur(80px)",
        zIndex: 0
      }
    }}>
      <Navbar />
      
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 }, position: "relative", zIndex: 1 }}>
        
        {/* Header Section */}
        <Box sx={{ mb: 8, textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <Box sx={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              px: 2, py: 0.5, 
              mb: 2, 
              borderRadius: 5, 
              bgcolor: alpha("#3B82F6", 0.1), 
              color: "#3B82F6" 
            }}>
              <AutoAwesomeIcon sx={{ fontSize: 16, mr: 1 }} />
              <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>
                Management Portal
              </Typography>
            </Box>
          </motion.div>

          <Typography variant="h2" sx={{ fontWeight: 900, color: "#0f172a", mb: 2, letterSpacing: "-1px" }}>
            Institutional <Box component="span" sx={{ color: 'primary.main' }}>Intelligence</Box>
          </Typography>
          <Typography variant="h6" sx={{ color: "#64748b", fontWeight: 400, maxWidth: 600, mx: 'auto' }}>
            Seamlessly manage your students, staff, and schedules with our next-generation administrative suite.
          </Typography>
        </Box>

        {/* Dashboard Grid */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          {/* Changed spacing to 3 for tighter grid, enabled stretch alignment */}
          <Grid container spacing={3} alignItems="stretch">
            {menuItems.map((item) => (
              // SYSTEMATIC FIX: 
              // xs=12 (1 per row on mobile)
              // sm=6 (2 per row on tablet)
              // md=4 (3 per row on desktop) -> Creates perfect 3x2 grid for 6 items
              <Grid item xs={12} sm={6} md={4} key={item.title} sx={{ display: 'flex' }}>
                <motion.div 
                    variants={cardVariants} 
                    whileHover="hover" 
                    whileTap={{ scale: 0.97 }} 
                    style={{ width: "100%", display: "flex" }} // Ensure motion div takes full width/flex
                >
                  <Card
                    onClick={() => navigate(item.path)}
                    sx={{
                      p: 4,
                      width: "100%",
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      cursor: "pointer",
                      borderRadius: 6,
                      border: "1px solid",
                      borderColor: alpha(item.color, 0.1),
                      background: "rgba(255, 255, 255, 0.8)", // Slightly more opaque to prevent bleed
                      backdropFilter: "blur(12px)",
                      boxShadow: `0 4px 20px -5px ${alpha("#000", 0.05)}`,
                      transition: "all 0.3s ease",
                      minHeight: "280px", // Enforce a minimum height for uniformity
                      "&:hover": {
                        boxShadow: `0 25px 50px -12px ${alpha(item.color, 0.25)}`,
                        borderColor: alpha(item.color, 0.3),
                        transform: "translateY(-5px)" // CSS hover fallback
                      },
                    }}
                  >
                    <Box>
                      <Box sx={{ 
                        width: 56, height: 56, 
                        borderRadius: "18px", 
                        background: `linear-gradient(135deg, ${item.color} 0%, ${alpha(item.color, 0.6)} 100%)`,
                        color: "white",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        mb: 3,
                        boxShadow: `0 10px 20px -5px ${alpha(item.color, 0.5)}`
                      }}>
                        {item.icon}
                      </Box>
                      
                      <Typography variant="h5" sx={{ fontWeight: 800, color: "#1e293b", mb: 1 }}>
                        {item.title}
                      </Typography>
                      <Typography variant="body1" sx={{ color: "#64748b", mb: 4, lineHeight: 1.6 }}>
                        {item.subtitle}
                      </Typography>
                    </Box>

                    <Button 
                      variant="text" 
                      endIcon={<ArrowForwardRoundedIcon />}
                      sx={{ 
                        justifyContent: 'flex-start', 
                        px: 0, 
                        color: item.color,
                        fontWeight: 700,
                        "&:hover": { background: 'transparent', letterSpacing: '1px' },
                        transition: 'all 0.2s'
                      }}
                    >
                      Open Module
                    </Button>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
}