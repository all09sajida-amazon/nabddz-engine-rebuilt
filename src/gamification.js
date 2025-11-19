/**
 * ===================================================================
 * Nabdz Engine - Gamification Module
 * ===================================================================
 * This module adds a points and levels system to the engine.
 * Author: The Golden Triad (Kimi, Chat.z.ai, Product Owner)
 * Version: 2.2.0
 */

class Gamification {
  /**
   * Configuration for points and levels.
   */
  static config = {
    points: {
      positive: 10,
      negative: -5,
      neutral: 0
    },
    levels: {
      Spark: { min: 0, max: 50, icon: '⚡' },
      Flow: { min: 51, max: 150, icon: '🌊' },
      Wave: { min: 151, max: Infinity, icon: '🌟' }
    }
  };

  /**
   * Initializes the gamification system.
   * Sets up default values in localStorage if they don't exist.
   */
  static init() {
    if (typeof window !== 'undefined' && window.NabdzSecurity && window.NabdzSecurity.storage) {
      if (!window.NabdzSecurity.storage.get('points')) {
        window.NabdzSecurity.storage.set('points', 0);
      }
      if (!window.NabdzSecurity.storage.get('level')) {
        window.NabdzSecurity.storage.set('level', 'Spark');
      }
      this.displayStatus();
    } else {
      console.warn('Gamification: NabdzSecurity not found. Cannot initialize.');
    }
  }

  /**
   * Updates the user's points based on their mood.
   * @param {string} mood - The detected mood ('positive', 'negative', 'neutral').
   * @returns {object} The new status with points and level.
   */
  static updatePoints(mood) {
    if (typeof window !== 'undefined' && window.NabdzSecurity && window.NabdzSecurity.storage) {
      const currentPoints = window.NabdzSecurity.storage.get('points') || 0;
      const pointsToAdd = this.config.points[mood] || 0;
      const newPoints = Math.max(0, currentPoints + pointsToAdd); // Prevent negative points

      window.NabdzSecurity.storage.set('points', newPoints);

      const newLevel = this.calculateLevel(newPoints);
      window.NabdzSecurity.storage.set('level', newLevel);

      this.displayStatus();

      return { points: newPoints, level: newLevel, added: pointsToAdd };
    }
    return { points: 0, level: 'Spark', added: 0 };
  }

  /**
   * Calculates the level based on the total points.
   * @param {number} points - The total points.
   * @returns {string} The current level name.
   */
  static calculateLevel(points) {
    for (const [levelName, levelData] of Object.entries(this.config.levels)) {
      if (points >= levelData.min && points <= levelData.max) {
        return levelName;
      }
    }
    return 'Spark';
  }

  /**
   * Displays the current status in the console.
   */
  static displayStatus() {
    if (typeof window !== 'undefined' && window.NabdzSecurity && window.NabdzSecurity.storage && window.console) {
      const points = window.NabdzSecurity.storage.get('points') || 0;
      const level = window.NabdzSecurity.storage.get('level') || 'Spark';
      const icon = this.config.levels[level].icon;

      console.log(`${icon} Nabdz Status: ${level} Level - ${points} Points`);
    }
  }
}

// Attach the Gamification class to the NabdzCore object
if (typeof window !== 'undefined' && window.NabdzCore) {
  window.NabdzCore.Gamification = Gamification;
}

// Export for Node.js environments
if (typeof module !== 'undefined') {
  module.exports = Gamification;
}
