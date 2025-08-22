/**
 * Calculate bonus based on category and actual performance
 * @param {Object} item - The bonus item configuration
 * @param {number} actual - The actual performance value
 * @returns {number} - The calculated bonus amount
 */
export function calculateBonus(item, actual) {
  // Check if actual meets minimum requirement
  if (actual < item.minimum) {
    return 0;
  }

  switch (item.category) {
    case "Distance, km":
      return calculateDistanceBonus(actual, item.minimum, item.rate);
    
    case "Task":
      return calculateTaskBonus(actual);
    
    case "Time duration, h":
      return calculateTimeBonus(actual);
    
    default:
      return 0;
  }
}

/**
 * Calculate distance-based bonus (fixed amounts for tiers)
 */
function calculateDistanceBonus(actual, minimum, rate) {
  if (actual >= 4000 && minimum === 4000) return 134;
  if (actual >= 3000 && minimum === 3000) return 90;
  if (actual >= 2000 && minimum === 2000) return 45;
  return 0;
}

/**
 * Calculate task-based bonus (rate per task)
 */
function calculateTaskBonus(actual) {
  if (actual >= 90) return 8.5 * actual;
  if (actual >= 60) return 5.5 * actual;
  if (actual >= 45) return 3.5 * actual;
  return 0;
}

/**
 * Calculate time-based bonus (rate per hour)
 */
function calculateTimeBonus(actual) {
  if (actual >= 110) return Math.round(1.0 * actual * 100) / 100;
  if (actual >= 70) return Math.round(0.8 * actual * 100) / 100;
  if (actual >= 55) return Math.round(0.5 * actual * 100) / 100;
  return 0;
}