import { ReactNode } from "react";

export interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export type MessageResponse = {
  payload: any;
};

export type AiConfigHelperPlacement = "top" | "bottom" | "left" | "right";

export interface AiConfigHelperProps {
  /**
   * Unique identifier for the field
   */
  fieldId: string;

  /**
   * Display name of the field to show in the helper
   */
  fieldName: string;

  /**
   * Callback for when a value is selected to be applied
   */
  onApplyValue?: (value: any) => void;

  /**
   * Position of the helper popover relative to the trigger
   * @default "right"
   */
  placement?: AiConfigHelperPlacement;

  /**
   * Custom icon to use for the helper trigger button
   */
  icon?: ReactNode;

  /**
   * Custom function to handle API requests
   * If not provided, a mock implementation will be used
   */
  onSendMessage?: (message: string) => Promise<MessageResponse>;

  /**
   * Custom welcome message
   * @default "Hi there! I'm AiConfigHelper. How can I help you configure the [fieldName] field?"
   */
  welcomeMessage?: string;

  /**
   * Custom button text for the help button
   */
  helpButtonLabel?: string;

  /**
   * Custom styles for the component
   */
  styles?: {
    width?: number;
    maxHeight?: number;
    assistantMessageColor?: string;
    userMessageColor?: string;
    userMessageTextColor?: string;
  };
}

export interface AiConfigHelperTheme {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  userBubble: string;
  userText: string;
  assistantBubble: string;
  assistantText: string;
}
