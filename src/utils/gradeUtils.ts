import { useTheme } from '../styles/theme';

export const useGradeColor = (num: number | null | undefined) => {
    const theme = useTheme();

    if (num === undefined || num === null) return theme.colors.gradeGrey; //grey if no grade
    if (num >= 90) return theme.colors.gradeGreen;
    if (num >= 80) return theme.colors.gradeBlue;
    if (num >= 70) return theme.colors.gradeYellow;
    if (num >= 60) return theme.colors.gradeOrange;
    return theme.colors.gradeRed;
};

export const getLetterGrade = (num: number | null | undefined): string => {
    if (num === undefined || num === null) return "—";
    if (num >= 95) return "A+";
    if (num >= 93) return "A";
    if (num >= 90) return "A-";
    if (num >= 87) return "B+";
    if (num >= 83) return "B";
    if (num >= 80) return "B-";
    if (num >= 77) return "C+";
    if (num >= 73) return "C";
    if (num >= 70) return "C-";
    if (num >= 67) return "D+";
    if (num >= 63) return "D";
    if (num >= 60) return "D-";
    return "E";
};

export const formatGrade = (val: any) => val ?? "—";