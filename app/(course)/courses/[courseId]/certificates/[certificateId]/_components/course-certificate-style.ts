import { StyleSheet } from "@react-pdf/renderer";

// Colores del tema
const colors = {
  primary: "#1e40af",
  primaryLight: "#3b82f6",
  primaryDark: "#1e3a8a",
  secondary: "#d97706",
  secondaryLight: "#f59e0b",
  accent: "#60a5fa",
  accentLight: "#93c5fd",
  background: "#ffffff",
  backgroundLight: "#f9fafb",
  backgroundBlue: "#eff6ff",
  border: "#e5e7eb",
  borderBlue: "#dbeafe",
  borderBlueDark: "#bfdbfe",
  text: {
    primary: "#111827",
    secondary: "#374151",
    muted: "#6b7280",
    light: "#4b5563",
  },
  decorative: {
    gold: "#fbbf24",
    goldDark: "#d97706",
  }
};

// Dimensiones y espaciado
const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  "2xl": 32,
  "3xl": 40,
};

const fontSize = {
  xs: 10,
  sm: 12,
  base: 14,
  lg: 16,
  xl: 18,
  "2xl": 20,
  "3xl": 24,
  "4xl": 28,
  "5xl": 32,
};

// Estilos principales
export const certificateStyles = StyleSheet.create({
  // Layout principal
  page: {
    flexDirection: "column",
    backgroundColor: colors.background,
    padding: spacing["3xl"],
    fontFamily: "Helvetica",
  },
  
  container: {
    flex: 1,
    border: `4px solid ${colors.secondary}`,
    borderRadius: 12,
    padding: spacing["2xl"],
    position: "relative",
    minHeight: 500,
  },

  // Decoraciones de esquina
  cornerDecoration: {
    position: "absolute",
    top: spacing.sm,
    left: spacing.sm,
    width: 60,
    height: 60,
    backgroundColor: colors.decorative.gold,
    opacity: 0.1,
  },
  
  cornerDecorationTopRight: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    width: 60,
    height: 60,
    backgroundColor: colors.decorative.gold,
    opacity: 0.1,
  },
  
  cornerDecorationBottomLeft: {
    position: "absolute",
    bottom: spacing.sm,
    left: spacing.sm,
    width: 40,
    height: 40,
    backgroundColor: colors.decorative.gold,
    opacity: 0.1,
  },
  
  cornerDecorationBottomRight: {
    position: "absolute",
    bottom: spacing.sm,
    right: spacing.sm,
    width: 40,
    height: 40,
    backgroundColor: colors.decorative.gold,
    opacity: 0.1,
  },

  // Header
  header: {
    alignItems: "center",
    marginBottom: spacing["3xl"],
  },
  
  headerLine: {
    width: 80,
    height: 3,
    backgroundColor: colors.primary,
    marginBottom: spacing.lg,
  },
  
  title: {
    fontSize: fontSize["4xl"],
    fontFamily: "Helvetica-Bold",
    color: colors.primary,
    textAlign: "center",
    marginBottom: spacing.sm,
    letterSpacing: 1,
  },
  
  titleUnderline: {
    width: 120,
    height: 1,
    backgroundColor: colors.accent,
  },

  // Contenido principal
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  
  certificationText: {
    fontSize: fontSize.lg,
    color: colors.text.light,
    fontFamily: "Helvetica",
    marginBottom: spacing.md,
    textAlign: "center",
  },
  
  recipientName: {
    fontSize: fontSize["5xl"],
    fontFamily: "Helvetica-Bold",
    color: colors.text.primary,
    textAlign: "center",
    marginBottom: spacing.sm,
    letterSpacing: 2,
  },
  
  recipientUnderline: {
    width: 200,
    height: 1,
    backgroundColor: colors.accentLight,
    marginBottom: spacing.xl,
  },
  
  completionText: {
    fontSize: fontSize.lg,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
    textAlign: "center",
  },

  // Información del curso
  courseContainer: {
    backgroundColor: colors.backgroundBlue,
    border: `1px solid ${colors.borderBlue}`,
    borderRadius: 8,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    alignItems: "center",
    width: "100%",
    maxWidth: 400,
  },
  
  courseName: {
    fontSize: fontSize["2xl"],
    fontFamily: "Helvetica-Bold",
    color: colors.primary,
    textAlign: "center",
    marginBottom: spacing.sm,
    lineHeight: 1.3,
  },
  
  levelBadge: {
    backgroundColor: colors.borderBlue,
    border: `1px solid ${colors.borderBlueDark}`,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginTop: spacing.sm,
  },
  
  levelText: {
    fontSize: fontSize.sm,
    fontFamily: "Helvetica-Bold",
    color: colors.primaryDark,
  },

  // Footer
  footer: {
    alignItems: "center",
    marginTop: spacing["3xl"],
  },
  
  footerLine: {
    width: 100,
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },
  
  disclaimer: {
    fontSize: fontSize.xs,
    color: colors.text.muted,
    fontFamily: "Helvetica-Oblique",
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  
  dateContainer: {
    backgroundColor: colors.backgroundLight,
    border: `1px solid ${colors.border}`,
    borderRadius: 6,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  
  dateText: {
    fontSize: fontSize.sm,
    fontFamily: "Helvetica",
    color: colors.text.light,
    fontWeight: 500,
  },

  // Utilidades
  flexCenter: {
    alignItems: "center",
    justifyContent: "center",
  },
  
  textCenter: {
    textAlign: "center",
  },
  
  fontBold: {
    fontFamily: "Helvetica-Bold",
  },
  
  fontItalic: {
    fontFamily: "Helvetica-Oblique",
  },
});

// Exportar también los valores del tema para uso externo
export { colors, spacing, fontSize };