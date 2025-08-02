import React, { useState } from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface TutorialModalProps {
  visible: boolean;
  onComplete: () => void;
}

const { width } = Dimensions.get('window');

const TutorialModal: React.FC<TutorialModalProps> = ({ visible, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps = [
    {
      title: 'Welcome to Train of Thought!',
      description: 'Route colored trains to their matching stations by controlling junction switches.',
      image: '🚂',
    },
    {
      title: 'Tap Junction Switches',
      description: 'Tap the red circular buttons to toggle track direction and route trains.',
      image: '🔴',
    },
    {
      title: 'Match Colors',
      description: 'Each train must reach a station of the same color to score points.',
      image: '🎨',
    },
    {
      title: 'Watch Your Stats',
      description: 'Monitor your score, lives, level, and accuracy in the HUD at the top.',
      image: '📊',
    },
    {
      title: 'Plan Ahead',
      description: 'Multiple trains may be on track simultaneously - plan your routes carefully!',
      image: '🧠',
    },
  ];

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const currentTutorial = tutorialSteps[currentStep];

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <ThemedView style={styles.modal}>
          <View style={styles.header}>
            <ThemedText type="title" style={styles.title}>
              {currentTutorial.title}
            </ThemedText>
            <View style={styles.emojiContainer}>
              <ThemedText style={styles.emoji}>{currentTutorial.image}</ThemedText>
            </View>
          </View>
          
          <ThemedText style={styles.description}>
            {currentTutorial.description}
          </ThemedText>
          
          <View style={styles.progressContainer}>
            {tutorialSteps.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressDot,
                  index === currentStep && styles.activeDot,
                ]}
              />
            ))}
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <ThemedText style={styles.skipButtonText}>Skip</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <ThemedText style={styles.nextButtonText}>
                {currentStep === tutorialSteps.length - 1 ? 'Start Game' : 'Next'}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    margin: 20,
    alignItems: 'center',
    maxWidth: width - 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 15,
  },
  emojiContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  emoji: {
    fontSize: 40,
  },
  description: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 30,
    color: '#666',
  },
  progressContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#3498db',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  skipButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  skipButtonText: {
    color: '#666',
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TutorialModal; 