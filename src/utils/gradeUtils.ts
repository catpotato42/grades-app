import { Theme } from '../styles/theme';

export const getGradeColor = (num?: number) => {
    if (num === undefined || num === null) return Theme.colors.buttonSecondary; //grey if no grade
    if (num >= 90) return Theme.colors.gradeGreen;
    if (num >= 80) return Theme.colors.gradeBlue;
    if (num >= 70) return Theme.colors.gradeYellow;
    if (num >= 60) return Theme.colors.gradeOrange;
    return Theme.colors.gradeRed;
};

export const formatGrade = (val: any) => val ?? "—";