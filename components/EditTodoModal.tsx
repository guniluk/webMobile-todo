import { X } from 'lucide-react-native';
import React, { memo } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface EditTodoModalProps {
  visible: boolean;
  editText: string;
  setEditText: (text: string) => void;
  onSave: () => void;
  onClose: () => void;
}

export const EditTodoModal: React.FC<EditTodoModalProps> = memo(({
  visible,
  editText,
  setEditText,
  onSave,
  onClose,
}) => {
  const { colors } = useTheme();

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={[styles.modalCard, { backgroundColor: colors.surface }]}
        >
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>할 일 수정</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={22} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <TextInput
            style={[
              styles.modalInput,
              { color: colors.text, borderColor: colors.border, backgroundColor: colors.background },
            ]}
            value={editText}
            onChangeText={setEditText}
            placeholder="내용을 입력하세요..."
            placeholderTextColor={colors.textSecondary}
            multiline
            autoFocus
          />

          <View style={styles.modalFooter}>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.modalCancelBtn, { borderColor: colors.border }]}
            >
              <Text style={{ color: colors.textSecondary, fontWeight: '600' }}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onSave}
              style={[styles.modalSaveBtn, { backgroundColor: colors.primary }]}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>저장</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
});

EditTodoModal.displayName = 'EditTodoModal';

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    minHeight: 90,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  modalCancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
  },
  modalSaveBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
});
