# 🚀 Convex 백엔드 가이드 (초보자 완벽 지침서)

이 문서에서는 실시간 풀스택 백엔드 서비스인 **Convex**의 기본 개념부터, 프로젝트 초기 설정, 스키마 설계, 백엔드 API 작성 및 React/React Native 앱 연동 방법까지 단계별로 알기 쉽게 설명합니다.

---

## 💡 1. Convex란 무엇인가요?

**Convex**는 서버 구축이나 복잡한 데이터베이스(SQL/NoSQL) 설정 없이, **TypeScript/JavaScript 코드만으로 백엔드 개발을 완료할 수 있게 해주는 백엔드 서비스(BaaS)**입니다.

### 🔥 핵심 장점
1. **실시간 자동 반영 (Reactive Database)**
   - 데이터를 조회할 때 `useQuery`를 사용하면 데이터베이스가 변경될 때마다 프론트엔드 UI가 **자동으로 실시간 업데이트**됩니다. (별도의 웹소켓이나 폴링 코드가 필요 없음)
2. **End-to-End 타입 안정성**
   - 백엔드 스키마와 함수를 작성하면 TypeScript 타입이 자동으로 생성되어 (`_generated`), 프론트엔드에서 오타 없이 안전하게 개발할 수 있습니다.
3. **서버리스(Serverless) 지원**
   - 서버 인프라 관리 없이 백엔드 함수가 필요할 때만 자동으로 실행됩니다.

---

## 📚 2. 핵심 용어 3가지

| 용어 | 설명 | 비유 |
| :--- | :--- | :--- |
| **Schema (스키마)** | 데이터베이스 테이블 구조와 컬럼 타입을 정의하는 파일입니다. | 엑셀 시트의 열(Column) 이름과 형식을 정하는 것 |
| **Query (쿼리)** | 데이터베이스에서 데이터를 **읽어오는(Read)** 함수입니다. (읽기 전용) | 엑셀에서 데이터를 조회하는 것 |
| **Mutation (뮤테이션)** | 데이터베이스에 데이터를 **추가(Create), 수정(Update), 삭제(Delete)**하는 함수입니다. | 엑셀 셀 값을 입력/변경/삭제하는 것 |

---

## 🛠️ 3. 초보자를 위한 단계별 구축 순서 (Step-by-Step)

### Step 1. Convex 설치 및 CLI 실행

프로젝트 터미널에서 다음 명령어를 실행하여 Convex를 설치하고 개발 서버를 연결합니다.

```bash
# 1. Convex 패키지 설치
npm install convex

# 2. Convex 개발 서버 시작 및 연결
npx convex dev
```

> 💡 `npx convex dev`를 실행하면 대시보드 로그인 브라우저가 열리며, 연결이 완료되면 프로젝트에 `convex/` 폴더와 실행 환경 파일(`.env.local`)이 자동으로 생성됩니다.

---

### Step 2. 데이터베이스 스키마 정의 (`convex/schema.ts`)

데이터베이스에 어떤 테이블과 필드가 들어갈지 정의합니다.

📁 **`convex/schema.ts`**
```typescript
import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  // 'todos'라는 테이블 정의
  todos: defineTable({
    text: v.string(),        // 할 일 내용 (문자열)
    isCompleted: v.boolean(),// 완료 여부 (불리언: true/false)
  }),
});
```

* **`v.string()`**: 문자열 타입 검증
* **`v.boolean()`**: 불리언 타입 검증
* **`v.id('todos')`**: `todos` 테이블의 고유 ID 타입

---

### Step 3. 백엔드 API 함수 작성 (`convex/todos.ts`)

데이터베이스와 통신할 읽기(`query`) 및 쓰기(`mutation`) 함수들을 작성합니다.

📁 **`convex/todos.ts`**
```typescript
import { ConvexError, v } from 'convex/values';
import { mutation, query } from './_generated/server';

// 1. 모든 할 일 목록 가져오기 (Query - Read)
export const getTodos = query({
  handler: async (ctx) => {
    // todos 테이블의 데이터를 최신순(desc)으로 모두(collect) 가져옵니다.
    return await ctx.db.query('todos').order('desc').collect();
  },
});

// 2. 새로운 할 일 추가하기 (Mutation - Create)
export const addTodo = mutation({
  args: {
    text: v.string(), // 전달받을 인자(args) 검증
  },
  handler: async (ctx, args) => {
    const todoId = await ctx.db.insert('todos', {
      text: args.text,
      isCompleted: false, // 기본값은 미완료
    });
    return todoId;
  },
});

// 3. 완료 여부 토글하기 (Mutation - Update)
export const toggleTodo = mutation({
  args: {
    id: v.id('todos'),
  },
  handler: async (ctx, args) => {
    const todo = await ctx.db.get(args.id);
    if (!todo) throw new ConvexError('할 일을 찾을 수 없습니다.');
    
    return await ctx.db.patch(args.id, {
      isCompleted: !todo.isCompleted,
    });
  },
});

// 4. 할 일 수정하기 (Mutation - Update)
export const updateTodo = mutation({
  args: {
    id: v.id('todos'),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const todo = await ctx.db.get(args.id);
    if (!todo) throw new ConvexError('할 일을 찾을 수 없습니다.');
    
    return await ctx.db.patch(args.id, {
      text: args.text,
    });
  },
});

// 5. 할 일 삭제하기 (Mutation - Delete)
export const deleteTodo = mutation({
  args: {
    id: v.id('todos'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

// 6. 모든 할 일 전체 삭제 (Mutation - Delete All)
export const clearAllTodos = mutation({
  args: {},
  handler: async (ctx) => {
    const allTodos = await ctx.db.query('todos').collect();
    for (const todo of allTodos) {
      await ctx.db.delete(todo._id);
    }
    return { deletedCount: allTodos.length };
  },
});
```

---

### Step 4. 프론트엔드 최상단에 Convex 클라이언트 설정 (`app/_layout.tsx`)

앱 전체에서 Convex를 사용할 수 있도록 Provider로 감싸줍니다.

📁 **`app/_layout.tsx`**
```tsx
import { ConvexProvider, ConvexReactClient } from 'convex/react';

// 환경 변수에 설정된 Convex URL로 클라이언트 생성
const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

export default function RootLayout() {
  return (
    // 앱 최상단을 ConvexProvider로 감싸기
    <ConvexProvider client={convex}>
      {/* 화면 레이아웃 컴포넌트 */}
    </ConvexProvider>
  );
}
```

---

### Step 5. React 컴포넌트에서 데이터 불러오기 및 수정하기 (`app/(tabs)/index.tsx`)

Convex React 훅인 `useQuery`와 `useMutation`을 사용하여 데이터를 불러오고 변경합니다.

📁 **`app/(tabs)/index.tsx` (핵심 사용 예시)**
```tsx
import { api } from '@/convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  // 1. 데이터 읽기 (useQuery): 데이터가 변경되면 화면이 자동 리렌더링됨
  const todos = useQuery(api.todos.getTodos);

  // 2. 데이터 변경 함수 가져오기 (useMutation)
  const addTodo = useMutation(api.todos.addTodo);
  const toggleTodo = useMutation(api.todos.toggleTodo);
  const deleteTodo = useMutation(api.todos.deleteTodo);

  // 할 일 추가 함수 실행 예시
  const handleAdd = async () => {
    await addTodo({ text: '새로운 할 일 공부하기' });
  };

  // 할 일 토글 함수 실행 예시
  const handleToggle = async (id) => {
    await toggleTodo({ id });
  };

  // 로딩 처리
  if (todos === undefined) {
    return <Text>로딩 중...</Text>;
  }

  return (
    <View>
      {/* 데이터 목록 표시 */}
      {todos.map((todo) => (
        <TouchableOpacity key={todo._id} onPress={() => handleToggle(todo._id)}>
          <Text style={{ textDecorationLine: todo.isCompleted ? 'line-through' : 'none' }}>
            {todo.text}
          </Text>
        </TouchableOpacity>
      ))}

      {/* 추가 버튼 */}
      <TouchableOpacity onPress={handleAdd}>
        <Text>추가하기</Text>
      </TouchableOpacity>
    </View>
  );
}
```

---

## 🌟 4. 요약 및 주요 패턴 팁

1. **`useQuery(api.파일명.함수명)`**
   - 데이터베이스에서 실시간 데이터를 가져옵니다.
   - 로딩 중일 때는 `undefined`를 반환하므로, 로딩 상태를 쉽게 판별할 수 있습니다.
2. **`useMutation(api.파일명.함수명)`**
   - 데이터를 추가/수정/삭제하는 비동기 함수를 반환합니다.
   - `await mutationFunction({ arg1: value1 })` 형식으로 실행합니다.
3. **`ctx.db.insert()` / `ctx.db.patch()` / `ctx.db.delete()`**
   - `insert`: 새로운 데이터 행 추가
   - `patch`: 일부 필드 수정 (부분 업데이트)
   - `delete`: 데이터 행 삭제

---

## 🚀 5. 프로덕션 배포하기

개발이 완료된 후 실제 운영 환경으로 Convex 백엔드를 배포할 때는 아래 명령어를 사용합니다.

```bash
npx convex deploy
```

이것으로 Convex 백엔드 구성 및 프론트엔드 연동 가이드를 마칩니다! 추가 질문이 있으시면 언제든지 문의해 주세요.
