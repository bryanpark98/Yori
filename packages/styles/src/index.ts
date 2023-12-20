export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    error: string;
    warning: string;
    success: string;
    info: string;
    highlight: string;
    border: string;
    muted: string;
    accent: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xsmall: number;
      small: number;
      medium: number;
      large: number;
      xlarge: number;
    };
    fontWeight: {
      regular: FontWeight;
      bold: FontWeight;
    };
  };
  spacing: (size: number) => number;
}

export const darkTheme = {
  colors: {
    primary: "#BB86FC",
    secondary: "#03DAC6",
    background: "#121212",
    text: "#FFFFFF",
    error: "#CF6679",
    warning: "#FB8C00",
    success: "#4CAF50",
    info: "#2196F3",
    highlight: "#FFEB3B",
    border: "#3E3E3E",
    muted: "#757575",
    accent: "#FF7CF2",
  },
  typography: {
    fontFamily: "",
    fontSize: {
      xsmall: 8,
      small: 12,
      medium: 14,
      large: 16,
      xlarge: 20,
    },
    fontWeight: {
      regular: "400" as FontWeight,
      bold: "700" as FontWeight,
    },
  },
  spacing: (size: number) => size * 4,
};

export const theme = {
  colors: {
    // Primary colors
    primaryBackground: "black", // Main background color for dark mode
    primaryText: "#ffffff", // Primary text color for content
    primaryAccent: "#FF7CF2", // Accent color for buttons, links, etc.

    // Secondary colors
    secondaryBackground: "#141414", // Secondary background color
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

  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

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
