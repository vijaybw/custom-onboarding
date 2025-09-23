import React, { useState, useEffect } from "react";
import api from "./api";  // adjust relative path if needed

import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Button,
  Grid,
} from "@mui/material";

export default function Wizard() {
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState(null);
  const [form, setForm] = useState({ email: "", password: "" });
  const [config, setConfig] = useState({ page2: [], page3: [] });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/config").then((r) => setConfig(r.data));
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validateStep() {
    const newErrors = {};

    if (step === 1) {
      if (!form.email) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        newErrors.email = "Invalid email format";
      }

      if (!form.password) {
        newErrors.password = "Password is required";
      } else if (form.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
    }

    if (step === 2 || step === 3) {
      const activeFields = config[`page${step}`] || [];

      activeFields.forEach((field) => {
        if (field === "about" && !form.about) {
          newErrors.about = "About is required";
        }

        if (field === "birthdate") {
          if (!form.birthdate) {
            newErrors.birthdate = "Birthdate is required";
          } else {
            const today = new Date().toISOString().split("T")[0];
            if (form.birthdate > today) {
              newErrors.birthdate = "Birthdate cannot be in the future";
            }
          }
        }

        if (field === "address") {
          if (!form.address) newErrors.address = "Street is required";
          if (!form.city) newErrors.city = "City is required";
          if (!form.state) newErrors.state = "State is required";
          if (!form.zip) {
            newErrors.zip = "Zip is required";
          } else if (!/^\d{5,10}$/.test(form.zip)) {
            newErrors.zip = "Zip must be 5–10 digits";
          }
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleNext() {
    if (!validateStep()) return;

    if (step === 1) {
      const res = await api.post("/users", form);
      setUserId(res.data.id);
      const userRes = await api.get("/users/" + res.data.id);
      setForm(userRes.data);

      if (userRes.data.progress_step >= 3) {
        navigate("/dashboard");
      } else {
        setStep(userRes.data.progress_step > 1 ? userRes.data.progress_step : 2);
      }
    } else if (step === 2) {
      await api.put("/users/" + userId, { ...form, progress_step: 2 });
      setStep(3);
    } else if (step === 3) {
      await api.put("/users/" + userId, { ...form, progress_step: 3 });
      navigate("/dashboard");
    }
  }

  function renderFields(page) {
    return config[page].map((c) => {
      if (c === "about")
        return (
          <TextField
            key="about"
            name="about"
            label="About"
            multiline
            rows={4}
            fullWidth
            margin="normal"
            value={form.about || ""}
            onChange={handleChange}
            error={!!errors.about}
            helperText={errors.about}
          />
        );
      if (c === "address")
        return (
          <Grid container spacing={2} key="address" sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                name="address"
                label="Street"
                fullWidth
                value={form.address || ""}
                onChange={handleChange}
                error={!!errors.address}
                helperText={errors.address}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="city"
                label="City"
                fullWidth
                value={form.city || ""}
                onChange={handleChange}
                error={!!errors.city}
                helperText={errors.city}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="state"
                label="State"
                fullWidth
                value={form.state || ""}
                onChange={handleChange}
                error={!!errors.state}
                helperText={errors.state}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="zip"
                label="Zip"
                fullWidth
                value={form.zip || ""}
                onChange={handleChange}
                error={!!errors.zip}
                helperText={errors.zip}
              />
            </Grid>
          </Grid>
        );
      if (c === "birthdate")
        return (
          <TextField
            key="birthdate"
            type="date"
            name="birthdate"
            label="Birthdate"
            InputLabelProps={{ shrink: true }}
            fullWidth
            margin="normal"
            value={form.birthdate || ""}
            onChange={handleChange}
            error={!!errors.birthdate}
            helperText={errors.birthdate}
          />
        );
      return null;
    });
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Onboarding Wizard
          </Typography>

          {/* Stepper */}
          <Stepper activeStep={step - 1} alternativeLabel sx={{ mb: 4 }}>
            {["Step 1", "Step 2", "Step 3"].map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Step Content */}
          {step === 1 && (
            <div>
              <TextField
                fullWidth
                label="Email"
                name="email"
                margin="normal"
                value={form.email || ""}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                name="password"
                margin="normal"
                value={form.password || ""}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
              />
            </div>
          )}

          {step === 2 && <div>{renderFields("page2")}</div>}
          {step === 3 && <div>{renderFields("page3")}</div>}

          {/* Action Button */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 4 }}
            onClick={handleNext}
          >
            {step < 3 ? "Save & Continue" : "Finish"}
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}
