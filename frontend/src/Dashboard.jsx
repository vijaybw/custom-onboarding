import React from "react";
import { Card, CardContent, Typography, Box, Button } from "@mui/material";
import { CheckCircleOutline, AdminPanelSettings, TableView, PlaylistAddCheck } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
      sx={{ backgroundColor: "background.default", p: 2 }}
    >
      <Card sx={{ maxWidth: 500, width: "100%", borderRadius: 3, boxShadow: 4 }}>
        <CardContent sx={{ textAlign: "center", p: 4 }}>
          <CheckCircleOutline color="success" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Onboarding Complete 🎉
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            You’ve successfully finished all the onboarding steps.  
            Use the options below to explore more.
          </Typography>

          <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
            <Button
              variant="contained"
              startIcon={<AdminPanelSettings />}
              onClick={() => navigate("/admin")}
            >
              Admin
            </Button>
            <Button
              variant="contained"
              startIcon={<TableView />}
              onClick={() => navigate("/data")}
            >
              Data
            </Button>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<PlaylistAddCheck />}
              onClick={() => navigate("/")}
            >
              Wizard
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
