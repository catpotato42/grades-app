import { Assignment, CategoryWeight } from '../types';

export const calculateCourseGrade = (
  assignments: Assignment[], 
  categoryWeights?: CategoryWeight[], 
  ignoredIds: Set<string> = new Set()
): number | null => {
  const validAssigns = assignments.filter(a => 
    a.score !== undefined && a.totalPoints !== undefined && !ignoredIds.has(a.id)
  );
  
  if (validAssigns.length === 0) return null;

  if (categoryWeights && categoryWeights.length > 0) {
    let totalPercent = 0;
    let weightSum = 0;
    
    categoryWeights.forEach(cw => {
      const catAssigns = validAssigns.filter(a => a.category === cw.name);
      if (catAssigns.length > 0) {
        let earned = 0, possible = 0;
        catAssigns.forEach(a => {
          const w = a.weight ?? 1;
          earned += (a.score! * w);
          possible += (a.totalPoints! * w);
        });
        if (possible > 0) {
          totalPercent += (earned / possible) * cw.weight;
          weightSum += cw.weight;
        }
      }
    });
    return weightSum > 0 ? (totalPercent / weightSum) * 100 : null;
  } else {
    let earned = 0, possible = 0;
    validAssigns.forEach(a => {
      const w = a.weight ?? 1;
      earned += (a.score! * w);
      possible += (a.totalPoints! * w);
    });
    return possible > 0 ? (earned / possible) * 100 : null;
  }
};