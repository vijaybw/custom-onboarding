import React, { useState, useEffect } from "react";
import api from "./api";  // adjust relative path if needed

import {
  Container,
  Typography,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Button,
  Grid,
} from "@mui/material";

export default function Admin() {
  const [config, setConfig] = useState({ page2: [], page3: [] });
  const components = ["about", "address", "birthdate"];

  useEffect(() => {
    api.get("/config").then((r) => setConfig(r.data));
  }, []);

  function toggle(page, comp) {
    const otherPage = page === "page2" ? "page3" : "page2";
    let updatedOther = config[otherPage].filter((c) => c !== comp);

    let arr = config[page].includes(comp)
      ? config[page].filter((c) => c !== comp)
      : [...config[page], comp];

    setConfig({ ...config, [page]: arr, [otherPage]: updatedOther });
  }

  function save() {
    api.post("/config", config).then((r) => setConfig(r.data));
  }

  const isValid = config.page2.length > 0 && config.page3.length > 0;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Page 2 Configurations
              </Typography>
              {components.map((c) => (
                <FormControlLabel
                  key={c}
                  control={
                    <Checkbox
                      checked={config.page2.includes(c)}
                      onChange={() => toggle("page2", c)}
                    />
                  }
                  label={c}
                  disabled={config.page3.includes(c)}
                />
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Page 3 Configurations
              </Typography>
              {components.map((c) => (
                <FormControlLabel
                  key={c}
                  control={
                    <Checkbox
                      checked={config.page3.includes(c)}
                      onChange={() => toggle("page3", c)}
                    />
                  }
                  label={c}
                  disabled={config.page2.includes(c)}
                />
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 3 }}
        onClick={save}
        disabled={!isValid}
      >
        Save
      </Button>

      {!isValid && (
        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
          You must select at least one option for both Page 2 and Page 3.
        </Typography>
      )}
    </Container>
  );
}
