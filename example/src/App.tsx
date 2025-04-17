import React, { useState } from "react";
import {
  AppBar,
  Box,
  Card,
  CardContent,
  Container,
  CssBaseline,
  Divider,
  Grid,
  TextField,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
} from "@mui/material";
import { AiConfigHelper } from "react-ai-config-helper";

// Create a MUI theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#f5f5f5",
    },
  },
});

// Simple JSON Editor component for demo purposes
const SimpleJsonEditor: React.FC<{
  value: object;
  onChange: (newValue: object) => void;
}> = ({ value, onChange }) => {
  const [error, setError] = useState<string | null>(null);
  const [textValue, setTextValue] = useState<string>(
    JSON.stringify(value, null, 2)
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setTextValue(newText);

    try {
      const newValue = JSON.parse(newText);
      onChange(newValue);
      setError(null);
    } catch (err) {
      setError("Invalid JSON");
    }
  };

  return (
    <TextField
      fullWidth
      multiline
      rows={8}
      value={textValue}
      onChange={handleChange}
      error={Boolean(error)}
      helperText={error}
      variant="outlined"
      sx={{ fontFamily: "monospace" }}
    />
  );
};

// Example App component
const App: React.FC = () => {
  // State for the form fields
  const [textFieldValue, setTextFieldValue] = useState<string>("");
  const [jsonValue, setJsonValue] = useState<object>({
    type: "object",
    properties: {},
  });
  const [customFieldValue, setCustomFieldValue] = useState<string>("");

  // Custom API handler example
  const handleCustomApiRequest = async (
    message: string
  ): Promise<{ payload: any }> => {
    console.log("Custom API handler received:", message);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Return a mock response based on the message
    if (message.toLowerCase().includes("color")) {
      return {
        payload: "A vibrant shade of purple that complements the design.",
      };
    } else if (message.toLowerCase().includes("size")) {
      return { payload: "Medium size (fits most design systems)." };
    } else {
      return { payload: "This is a custom response from the API handler." };
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              React AI Config Helper Demo
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Examples
          </Typography>

          <Grid container spacing={4}>
            {/* Basic Text Field Example */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Basic Text Field
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Simple example with a text field.
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <TextField
                      label="Description"
                      fullWidth
                      value={textFieldValue}
                      onChange={(e) => setTextFieldValue(e.target.value)}
                      InputProps={{
                        endAdornment: (
                          <AiConfigHelper
                            fieldId="description"
                            fieldName="Description"
                            onApplyValue={(value) => setTextFieldValue(value)}
                          />
                        ),
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* JSON Editor Example */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                      JSON Schema Editor
                    </Typography>
                    <AiConfigHelper
                      fieldId="json-schema"
                      fieldName="JSON Schema"
                      onApplyValue={(value) => setJsonValue(value)}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Example with a JSON editor and the AI helper attached to the
                    label.
                  </Typography>
                  <SimpleJsonEditor value={jsonValue} onChange={setJsonValue} />
                </CardContent>
              </Card>
            </Grid>

            {/* Custom API Handler Example */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Custom API Integration
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Example using a custom API handler and message.
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <TextField
                      label="Custom Field"
                      fullWidth
                      value={customFieldValue}
                      onChange={(e) => setCustomFieldValue(e.target.value)}
                      InputProps={{
                        endAdornment: (
                          <AiConfigHelper
                            fieldId="custom-field"
                            fieldName="Custom Field"
                            onApplyValue={(value) => setCustomFieldValue(value)}
                            onSendMessage={handleCustomApiRequest}
                            welcomeMessage="Hello! This is a custom welcome message. Try asking about 'color' or 'size'."
                          />
                        ),
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Custom Styling Example */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Custom Styling
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Example with custom styling for the chat interface.
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <TextField
                      label="Styled Field"
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <AiConfigHelper
                            fieldId="styled-field"
                            fieldName="Styled Field"
                            styles={{
                              width: 350,
                              maxHeight: 450,
                              userMessageColor: "#6200ee",
                              userMessageTextColor: "#ffffff",
                              assistantMessageColor: "#e6f7ff",
                            }}
                          />
                        ),
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box sx={{ mt: 6, mb: 4 }}>
            <Divider />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 2, textAlign: "center" }}
            >
              React AI Config Helper Example - MIT License
            </Typography>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default App;
