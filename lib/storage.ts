import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * AsyncStorage 유틸리티 래퍼
 */
export const storage = {
  /**
   * 키에 해당하는 데이터를 JSON 형태로 저장합니다.
   */
  async set<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`[AsyncStorage] "${key}" 저장 실패:`, error);
    }
  },

  /**
   * 키에 해당하는 데이터를 JSON 파싱하여 불러옵니다.
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? (JSON.parse(jsonValue) as T) : null;
    } catch (error) {
      console.error(`[AsyncStorage] "${key}" 읽기 실패:`, error);
      return null;
    }
  },

  /**
   * 키에 해당하는 데이터를 삭제합니다.
   */
  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`[AsyncStorage] "${key}" 삭제 실패:`, error);
    }
  },

  /**
   * AsyncStorage의 모든 데이터를 초기화합니다.
   */
  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('[AsyncStorage] 전체 데이터 초기화 실패:', error);
    }
  },
};

export default storage;
