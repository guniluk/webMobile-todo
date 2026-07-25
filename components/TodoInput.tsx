import { Plus } from 'lucide-react-native';
import React, { memo, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface TodoInputProps {
  inputText: string;
  setInputText: (text: string) => void;
  onAddTodo: () => void;
}

export const TodoInput: React.FC<TodoInputProps> = memo(({
  inputText,
  setInputText,
  onAddTodo,
}) => {
  const { colors } = useTheme();
  const [isInputFocused, setIsInputFocused] = useState(false);
  const isValid = !!inputText.trim();

  return (
    <View
      style={[
        styles.inputContainer,
        {
          backgroundColor: colors.surface,
          borderColor: isInputFocused ? colors.primary : colors.primary + '60',
          borderWidth: isInputFocused ? 2 : 1.5,
          shadowColor: isInputFocused ? colors.primary : '#000',
          shadowOpacity: isInputFocused ? 0.25 : 0.06,
        },
      ]}
    >
      <Plus
        size={20}
        color={isInputFocused || inputText ? colors.primary : colors.textSecondary}
        style={styles.inputLeftIcon}
      />
      <TextInput
        style={[styles.input, { color: colors.text }]}
        placeholder="새로운 할 일을 입력하세요..."
        placeholderTextColor={colors.textSecondary}
        value={inputText}
        onChangeText={setInputText}
        onSubmitEditing={onAddTodo}
        onFocus={() => setIsInputFocused(true)}
        onBlur={() => setIsInputFocused(false)}
        returnKeyType="done"
      />
      <TouchableOpacity
        style={[
          styles.addButton,
          {
            backgroundColor: isValid ? colors.primary : colors.border,
            shadowColor: isValid ? colors.primary : 'transparent',
          },
        ]}
        onPress={onAddTodo}
        disabled={!isValid}
        activeOpacity={0.8}
      >
        <Plus color="#FFFFFF" size={22} />
      </TouchableOpacity>
    </View>
  );
});

TodoInput.displayName = 'TodoInput';

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 4,
  },
  inputLeftIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    paddingVertical: 10,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
});
