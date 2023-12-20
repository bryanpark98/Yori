type FontWeight =
  | "bold"
  | "normal"
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900";

const theme = {
  colors: {
    // Primary colors
    primaryBackground: "#1e1e1e", // Main background color for dark mode
    primaryText: "#ffffff", // Primary text color for content
    primaryAccent: "#FF7CF2", // Accent color for buttons, links, etc.

    // Secondary colors
    secondaryBackground: "black", // Secondary background color
    secondaryText: "#bdc3c7", // Secondary text color for less important content
    secondaryAccent: "#e74c3c", // Secondary accent color for alerts or notifications

    // Additional colors
    success: "#2ecc71", // Success color for positive actions
    warning: "#f39c12", // Warning color for important notices
    error: "#e74c3c", // Error color for error messages

    // Grayscale colors
    black: "#000000", // Pure black for text or icons
    white: "#ffffff", // Pure white for backgrounds or borders
    gray: "#6b6b6b", // Mid-gray for subtle elements
  },

  // Typography
  typography: {
    // Headings
    h1: {
      fontSize: 20,
      fontWeight: "bold" as FontWeight,
      color: "white",
    },
    h2: {
      fontSize: 16,
      fontWeight: "bold" as FontWeight,
      color: "white",
    },
    h3: {
      fontSize: 14,
      fontWeight: "600" as FontWeight,
      color: "white",
    },

    // Body Text
    body: {
      fontSize: 12,
      color: "white",
    },

    strong: {
      fontSize: 12,
      color: "white",
      fontWeight: "bold" as FontWeight, // Bold style for strong text
    },

    // Links
    link: {
      fontSize: 16,
      color: "blue",
    },

    // Buttons
    button: {
      fontSize: 18,
      fontWeight: "bold" as FontWeight,
      color: "white",
      backgroundColor: "blue",
    },
  },

  // Spacing
  spacing: {
    // Padding
    padding: 8,
    paddingSmall: 4,
    paddingLarge: 16,

    // Margin
    margin: 8,
    marginSmall: 4,
    marginLarge: 16,

    // Gap
    gap: 8,
    gapSmall: 4,
    gapLarge: 16,
  },

  // Borders
  borders: {
    image: {
      borderWidth: 1,
      borderColor: "white",
    },
    borderRadius: 4,
  },

  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", // Default box shadow

  containers: {
    screen: {
      flex: 1,
    },
    scrollView: {
      backgroundColor: "primaryBackground",
      paddingBottom: 40,
    },
  },
};

export default theme;
