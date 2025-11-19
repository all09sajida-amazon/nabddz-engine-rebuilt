/**
 * ===================================================================
 * Nabdz Engine - Mood Detector Module
 * ===================================================================
 * This module analyzes text to determine the user's mood.
 * Author: The Golden Triad (Kimi, Chat.z.ai, Product Owner)
 * Version: 2.2.0
 */

class MoodDetector {
  /**
   * A dictionary of words associated with different moods.
   */
  static dictionary = {
    positive: ['سعيد', 'فرحان', 'متحمس', 'مسرور', 'رائع', 'ممتاز', 'جميل', 'مذهل'],
    negative: ['حزين', 'كئيب', 'مكتئب', 'محبط', 'غاضب', 'متضايق', 'مؤلم', 'سيء'],
    negators: ['ليس', 'لا', 'لم', 'لن', 'عدم'],
    ambiguous: ['غريب', 'مختلف', 'عجيب', 'ليس كالأمس']
  };

  /**
   * Analyzes text to detect the mood.
   * @param {string} text - The text to analyze.
   * @returns {object} An object containing the mood, score, and confidence.
   */
  static detect(text) {
    if (!text || text.trim() === '') {
      return { mood: 'neutral', score: 0, confidence: 'low' };
    }

    const words = text.toLowerCase().split(/\s+/);
    let score = 0;
    let hasNegation = false;
    let foundEmotion = false;

    // Check for negation words
    words.forEach(word => {
      if (this.dictionary.negators.includes(word)) {
        hasNegation = true;
      }
    });

    // Count positive and negative words
    words.forEach(word => {
      this.dictionary.positive.forEach(pos => {
        if (word.includes(pos)) {
          score++;
          foundEmotion = true;
        }
      });

      this.dictionary.negative.forEach(neg => {
        if (word.includes(neg)) {
          score--;
          foundEmotion = true;
        }
      });
    });

    // Apply negation if found
    if (hasNegation && foundEmotion) {
      score = -score;
    }

    // Determine final mood and confidence
    let mood, confidence = 'medium';
    if (score > 0) {
      mood = 'positive';
      confidence = foundEmotion ? 'high' : 'low';
    } else if (score < 0) {
      mood = 'negative';
      confidence = foundEmotion ? 'high' : 'low';
    } else {
      mood = 'neutral';
      confidence = foundEmotion ? 'medium' : 'low';
    }

    return { mood, score, confidence };
  }

  /**
   * Renders the mood result with an icon.
   * @param {string} text - The text to analyze.
   * @returns {string} A string representation of the mood.
   */
  static render(text) {
    const result = this.detect(text);
    const icons = { positive: '😊', negative: '😢', neutral: '😐' };
    return `${icons[result.mood]} ${result.mood.toUpperCase()} (${result.score}, ${result.confidence} confidence)`;
  }
}

// Attach the MoodDetector to the NabdzCore object
if (typeof window !== 'undefined' && window.NabdzCore) {
  window.NabdzCore.Mood = MoodDetector;
}

// Export for Node.js environments
if (typeof module !== 'undefined') {
  module.exports = MoodDetector;
}
