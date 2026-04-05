import { useTheme } from '../styles/theme';

export const useGradeColor = (num: number | undefined) => {
    const theme = useTheme();

    if (num === undefined || num === null) return theme.colors.buttonSecondary; //grey if no grade
    if (num >= 90) return theme.colors.gradeGreen;
    if (num >= 80) return theme.colors.gradeBlue;
    if (num >= 70) return theme.colors.gradeYellow;
    if (num >= 60) return theme.colors.gradeOrange;
    return theme.colors.gradeRed;
};

export const formatGrade = (val: any) => val ?? "—";