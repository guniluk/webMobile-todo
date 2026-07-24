# React Context API와 `useContext` 완벽 가이드

본 문서에서는 **webMobile-todo** 프로젝트의 다크/라이트 모드(테마) 구현 방식을 바탕으로, React의 전역 데이터 관리 도구인 **Context API**와 **`useContext`** 훅에 대해 쉽고 상세하게 설명합니다.

---

## 1. Context API란 무엇인가요?

### 🧩 해결하려는 문제: **Prop Drilling**
React는 부모 컴포넌트에서 자식 컴포넌트로 데이터를 전달할 때 **Props**를 사용합니다.  
하지만 컴포넌트 트리가 깊어지면, 특정 데이터(예: 로그인 유저 정보, 테마 설정 등)를 깊숙한 자식 컴포넌트까지 전달하기 위해 중간에 있는 수많은 컴포넌트들이 단지 **"전달만 하기 위해"** Props를 받아 넘겨주어야 하는 현상이 발생합니다. 이를 **Prop Drilling(프롭 드릴링)** 이라고 부릅니다.

### 💡 Context의 핵심 개념: **"전역 데이터 통"**
Context API를 사용하면, 데이터가 중간 컴포넌트들을 거치지 않고 **전역 방송국(Provider)** 을 통해 전달됩니다.  
데이터가 필요한 컴포넌트는 수신기(`useContext`)를 켜기만 하면 언제든지 직접 전역 데이터를 가져와 사용할 수 있습니다.

```
[ 기존 Prop Drilling 방식 ]
App ──> Layout ──> TabHeader ──> ThemeButton (Props를 계속 전달해야 함 😫)

[ React Context 방식 ]
[ ThemeProvider (전역 방송국) ]
       │ 
       ├──────────────────────────┐
       ▼                          ▼
   Layout                   ThemeButton (`useTheme`으로 직접 수신! 😎)
```

---

## 2. 본 프로젝트(`webMobile-todo`) 구현 사례

우리 프로젝트에서는 `hooks/useTheme.tsx` 파일 하나에 Context 생성, Provider(공급자), Custom Hook(소비자)을 완벽히 구축해 두었습니다.

---

## 3. Context 구축의 3단계 구조

Context 시스템은 크게 **3가지 요소**로 구성됩니다.

### ① `createContext` : 전역 데이터 보관함 만들기
```typescript
// hooks/useTheme.tsx
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
```
- 전역 상태를 보관할 **상자(Context)** 를 생성합니다.
- TypeScript를 사용하는 경우, 상자에 담길 데이터의 타입(`ThemeContextType`)을 지정해 줍니다.

---

### ② `Provider` : 데이터를 하위 컴포넌트에 공급하는 공급자
```typescript
// hooks/useTheme.tsx
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemColorScheme = useSystemColorScheme() ?? "light";
  const [themeMode, setThemeMode] = useState<ThemeMode>("system");

  // 현재 활성화된 테마 계산 및 토글 함수
  const activeColorScheme = themeMode === "system" ? systemColorScheme : themeMode;
  const isDark = activeColorScheme === "dark";
  const colors = Colors[activeColorScheme];

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider
      value={{ themeMode, colorScheme: activeColorScheme, isDark, colors, setThemeMode, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
```
- `useState`를 통해 전역으로 관리할 상태(`themeMode`)를 관리합니다.
- `<ThemeContext.Provider value={...}>` 형태로 하위 컴포넌트들에게 제공할 데이터와 함수들(`isDark`, `colors`, `toggleTheme` 등)을 `value`에 담아 전달합니다.

#### 📍 실제 앱 적용 (`app/_layout.tsx`)
최상위 컴포넌트에서 앱 전체를 `<ThemeProvider>`로 감싸줍니다.
```tsx
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider> {/* 👈 전역 공급자로 감싸줌 */}
        <RootLayoutContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
```

---

### ③ `useContext` : 필요한 곳에서 데이터를 꺼내 쓰는 수신기 (Custom Hook)
```typescript
// hooks/useTheme.tsx
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    // Provider 외부에서 사용될 때를 대비한 렌더링 예외 처리 (Fallback)
    return { ... };
  }
  
  return context;
};
```
- `useContext(ThemeContext)`를 사용하면 Provider가 제공하는 `value` 객체를 그대로 읽어올 수 있습니다.
- 이를 사용하기 편하게 `useTheme()`이라는 **커스텀 훅**으로 감싸서 export 하였습니다.

#### 📍 개별 컴포넌트 사용 사례 (`app/(tabs)/index.tsx`)
```tsx
import { useTheme } from "../../hooks/useTheme";

export default function HomeScreen() {
  // 👈 커스텀 훅을 통해 필요한 전역 상태와 함수를 가져옴
  const { isDark, toggleTheme, colors } = useTheme();

  return (
    <View style={{ backgroundColor: colors.background }}>
      <TouchableOpacity onPress={toggleTheme}>
        {isDark ? <Sun color={colors.warning} /> : <Moon color={colors.text} />}
      </TouchableOpacity>
    </View>
  );
}
```

---

## 4. Context API vs 다른 전역 상태 관리 도구 (Zustand, Redux)

| 구분 | React Context API | Zustand / Redux |
| :--- | :--- | :--- |
| **설치 패키지** | 없음 (React 기본 기능) | 외부 라이브러리 설치 필요 |
| **적합한 사용처** | 테마, 다국어(i18n), 로그인 유저 정보 등 **변경 빈도가 적은 데이터** | Todo 리스트, 장바구니, 복잡한 비동기 데이터 등 **자주 변경되는 데이터** |
| **장점** | 가볍고 직관적이며 추가 설치 없이 즉시 사용 가능 | 성능 최적화(특정 슬라이스만 구독)와 상태 보관이 용이함 |

---

## 5. 요약 및 정리

1. **Context API**는 React 애플리케이션 내에서 Props를 거치지 않고 **전역 상태를 공유**할 수 있게 해주는 기능입니다.
2. **`createContext`** 로 통을 만들고, **`Provider`** 로 데이터를 공급하며, **`useContext`** 로 데이터를 소비합니다.
3. 우리 프로젝트의 `useTheme.tsx`는 이 패턴을 활용해 앱 전체의 **라이트/다크 테마**, **컬러 팔레트**, **테마 전환 기능(`toggleTheme`)** 을 손쉽게 관리하고 있습니다.
