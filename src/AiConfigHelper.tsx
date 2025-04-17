import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  CircularProgress,
  IconButton,
  Paper,
  Popover,
  TextField,
  Typography,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import PersonIcon from "@mui/icons-material/Person";
import SmartToyIcon from "@mui/icons-material/SmartToy";

import { AiConfigHelperProps, Message, MessageResponse } from "./types";

/**
 * AiConfigHelper - A React component for AI-assisted field configuration
 *
 * This component provides an interactive chat interface that can be attached to any form field
 * to offer AI-powered assistance for configuring that field.
 */
const AiConfigHelper: React.FC<AiConfigHelperProps> = ({
  fieldId,
  fieldName,
  onApplyValue,
  placement = "right",
  icon,
  onSendMessage,
  welcomeMessage,
  helpButtonLabel = "Get AI assistance",
  styles = {},
}) => {
  // State
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messageListRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Default styles with overrides
  const componentStyles = {
    width: styles.width || 320,
    maxHeight: styles.maxHeight || 400,
    userMessageColor: styles.userMessageColor || "primary.main",
    userMessageTextColor: styles.userMessageTextColor || "white",
    assistantMessageColor: styles.assistantMessageColor || "grey.100",
  };

  // Compute popover position based on placement
  const getPopoverPosition = () => {
    switch (placement) {
      case "top":
        return {
          anchorOrigin: {
            vertical: "top" as const,
            horizontal: "center" as const,
          },
          transformOrigin: {
            vertical: "bottom" as const,
            horizontal: "center" as const,
          },
        };
      case "bottom":
        return {
          anchorOrigin: {
            vertical: "bottom" as const,
            horizontal: "center" as const,
          },
          transformOrigin: {
            vertical: "top" as const,
            horizontal: "center" as const,
          },
        };
      case "left":
        return {
          anchorOrigin: {
            vertical: "center" as const,
            horizontal: "left" as const,
          },
          transformOrigin: {
            vertical: "center" as const,
            horizontal: "right" as const,
          },
        };
      case "right":
        return {
          anchorOrigin: {
            vertical: "center" as const,
            horizontal: "right" as const,
          },
          transformOrigin: {
            vertical: "center" as const,
            horizontal: "left" as const,
          },
        };
      default:
        return {
          anchorOrigin: {
            vertical: "center" as const,
            horizontal: "right" as const,
          },
          transformOrigin: {
            vertical: "center" as const,
            horizontal: "left" as const,
          },
        };
    }
  };

  // Default welcome message
  const defaultWelcomeMessage = `Hi there! I'm AiConfigHelper. How can I help you configure the "${fieldName}" field?`;

  // Handlers
  const handleOpenChat = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    // Add initial welcome message if no messages exist
    if (messages.length === 0) {
      setMessages([
        {
          text: welcomeMessage || defaultWelcomeMessage,
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    }

    // Focus on input field when chat opens
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const handleCloseChat = () => {
    setAnchorEl(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  // Default mock API response if no custom handler is provided
  const mockApiResponse = (): MessageResponse => {
    const responses = [
      {
        payload:
          fieldName.toLowerCase().includes("json") ||
          fieldName.toLowerCase().includes("schema")
            ? {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    age: { type: "number" },
                  },
                },
              }
            : "This is a sample note from AI assistant.",
      },
      {
        payload:
          fieldName.toLowerCase().includes("json") ||
          fieldName.toLowerCase().includes("schema")
            ? { example: { name: "John Doe", age: 30 } }
            : "Another helpful note for your reference.",
      },
      {
        payload:
          fieldName.toLowerCase().includes("json") ||
          fieldName.toLowerCase().includes("schema")
            ? {
                configuration: {
                  required: ["name"],
                  additionalProperties: false,
                },
              }
            : "AI-generated content for the notes field.",
      },
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async () => {
    if (userInput.trim() === "") return;

    // Add user message
    const userMessage: Message = {
      text: userInput.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setUserInput("");

    // Log to console (for debugging purposes)
    console.log("User query:", userMessage.text);

    // Use custom handler or mock if not provided
    setIsLoading(true);

    try {
      let response: MessageResponse;

      if (onSendMessage) {
        // Use provided API handler
        response = await onSendMessage(userMessage.text);
      } else {
        // Use mock implementation with delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        response = mockApiResponse();
      }

      console.log("AI response:", response);

      // Add AI response message
      const aiMessage: Message = {
        text: `Here's what I suggest for the "${fieldName}" field:`,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Add a formatted response showing the payload
      const payloadMessage: Message = {
        text:
          typeof response.payload === "object"
            ? JSON.stringify(response.payload, null, 2)
            : response.payload.toString(),
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, payloadMessage]);

      // Add a suggestion to apply the value
      const suggestionMessage: Message = {
        text: "Would you like to apply this value to the field? Just click on the message.",
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, suggestionMessage]);
    } catch (error) {
      // Handle error case
      const errorMessage: Message = {
        text: `Sorry, I encountered an error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleApplyValue = (text: string) => {
    if (!onApplyValue) return;

    try {
      const value = JSON.parse(text);
      onApplyValue(value);
    } catch (error) {
      // If not JSON, treat as plain text
      onApplyValue(text);
    }
  };

  // Auto-scroll to bottom of message list when messages change
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const open = Boolean(anchorEl);
  const popoverId = open ? `ai-helper-popover-${fieldId}` : undefined;
  const popoverPositions = getPopoverPosition();

  return (
    <>
      <IconButton
        size="small"
        color="primary"
        onClick={handleOpenChat}
        aria-label={helpButtonLabel}
        sx={{ ml: 1 }}
      >
        {icon || <HelpOutlineIcon fontSize="small" />}
      </IconButton>

      <Popover
        id={popoverId}
        open={open}
        anchorEl={anchorEl}
        onClose={handleCloseChat}
        anchorOrigin={popoverPositions.anchorOrigin}
        transformOrigin={popoverPositions.transformOrigin}
        sx={{
          "& .MuiPopover-paper": {
            width: componentStyles.width,
            maxHeight: componentStyles.maxHeight,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 1.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: "medium" }}>
            AiConfigHelper
          </Typography>
          <IconButton
            size="small"
            onClick={handleCloseChat}
            aria-label="Close assistant"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Message List */}
        <Box
          ref={messageListRef}
          sx={{
            flexGrow: 1,
            overflow: "auto",
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignSelf: message.isUser ? "flex-end" : "flex-start",
                maxWidth: "85%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1,
                }}
              >
                {!message.isUser && (
                  <SmartToyIcon
                    fontSize="small"
                    color="primary"
                    sx={{ mt: 0.5 }}
                  />
                )}
                <Paper
                  elevation={0}
                  onClick={() =>
                    !message.isUser && handleApplyValue(message.text)
                  }
                  sx={{
                    p: 1.5,
                    bgcolor: message.isUser
                      ? componentStyles.userMessageColor
                      : componentStyles.assistantMessageColor,
                    color: message.isUser
                      ? componentStyles.userMessageTextColor
                      : "text.primary",
                    borderRadius: 2,
                    cursor: !message.isUser ? "pointer" : "default",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    "&:hover": !message.isUser
                      ? {
                          bgcolor: "grey.200",
                        }
                      : {},
                  }}
                >
                  <Typography variant="body2">{message.text}</Typography>
                </Paper>
                {message.isUser && (
                  <PersonIcon
                    fontSize="small"
                    sx={{ mt: 0.5, color: "primary.main" }}
                  />
                )}
              </Box>
              <Typography
                variant="caption"
                sx={{
                  mt: 0.5,
                  mx: 3,
                  color: "text.secondary",
                  alignSelf: message.isUser ? "flex-end" : "flex-start",
                }}
              >
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
            </Box>
          ))}
          {isLoading && (
            <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}
        </Box>

        {/* Input Area */}
        <Box
          sx={{
            p: 1.5,
            borderTop: "1px solid rgba(0, 0, 0, 0.12)",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <TextField
            inputRef={inputRef}
            fullWidth
            placeholder="Ask for help..."
            variant="outlined"
            size="small"
            value={userInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            autoComplete="off"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 4,
              },
            }}
          />
          <IconButton
            color="primary"
            onClick={handleSendMessage}
            disabled={userInput.trim() === "" || isLoading}
            size="small"
          >
            <SendIcon fontSize="small" />
          </IconButton>
        </Box>
      </Popover>
    </>
  );
};

export default AiConfigHelper;
