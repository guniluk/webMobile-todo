# 🚀 TaskCraft - Smart & Real-time Todo Manager 📱⚡

> **"당신의 하루를 더 명확하고 스마트하게!"**
> Expo와 Convex를 결합하여 만든 실시간 동기화 지원 **크로스 플랫폼(iOS / Android / Web) 할 일 관리 애플리케이션**입니다.

---

## 📖 Project Storyline (스토리라인)

### 🌅 Morning: 하루의 시작, 흩어진 생각을 한눈에
매일 아침 우리는 세워야 할 수많은 계획과 마주합니다.  
**TaskCraft**는 깔끔한 UI와 **통계 카드(Stats Dashboard)**를 통해 오늘의 목표와 완료율을 직관적으로 보여줍니다.  
할 일을 빠르게 추가(Haptic 피드백 제공)하고, 카테고리별로 정렬하여 아침 루틴을 가볍게 시작하세요.

### 🔄 Afternoon: 언제 어디서나 실시간 동기화
모바일 앱에서 수정한 할 일이 웹 브라우저에서도 **0.1초 만에 자동 동기화**됩니다!  
**Convex BaaS (Backend-as-a-Service)** 기반의 실시간 데이터 파이프라인 덕분에,  
이동 중 스마트폰으로 체크한 작업이 사무실 PC 화면에도 즉시 반영되어 작업 흐름이 끊기지 않습니다.

### 🌙 Evening: 성취감과 함께 마무리하는 하루
저녁에는 **다크 모드(Dark Mode)**로 눈을 편안하게 전환하고, 오늘 완성한 할 일들을 한눈에 복기해 보세요.  
완료된 항목들을 일괄 정리하거나 검색 필터로 남은 과제를 손쉽게 체크할 수 있습니다.

---

## ✨ Key Features (주요 기능)

- ⚡ **실시간 클라우드 동기화 (Convex Real-time DB)**  
  - 새로고침이나 별도의 수동 저장 없이 백엔드와 앱 간 데이터가 실시간으로 동기화됩니다.
- 📝 **직관적인 Todo CRUD 관리**  
  - 할 일 추가, inline 토글, 상세 수정 모달(Edit Modal), 단일 삭제 및 전체 삭제 기능.
- 📊 **실시간 대시보드 & 통계 카드**  
  - 전체 할 일 수, 완료된 할 일 수, 실시간 달성률(%) 시각화.
- 🔍 **스마트 필터링 & 검색**  
  - `전체(All)`, `진행 중(Active)`, `완료됨(Completed)` 탭 필터링 및 실시간 텍스트 검색.
- 🎨 **다크/라이트 테마 (Custom Theme System)**  
  - 시스템 설정 연동 및 다크/라이트 테마 자유 전환 기능 지원.
- 📳 **생생한 Haptic 피드백 & 모션**  
  - 버튼 터치 및 상태 변경 시 햅틱 피드백을 통해 몰입감 있는 UX 제공.
- 🌐 **완벽한 크로스 플랫폼 지원**  
  - iOS, Android, Web 환경 어디서나 동일하고 깔끔한 사용 경험.

---

## 🛠 Tech Stack (기술 스택)

### **Frontend & Mobile UI**
- **Framework**: Expo (v54.0) & React Native (v0.81)
- **Routing**: Expo Router (v6.0) - 파일 기반 라우팅 (`app/` 디렉터리 구조)
- **UI Components**: React Native Safe Area Context, Reanimated, Lucide React Native (아이콘)
- **UX**: Expo Haptics (진동 피드백), Custom Theme Provider

### **Backend & Database**
- **BaaS**: Convex (v1.42) - Real-time Serverless Database & Cloud Functions

---

## 📂 Project Structure (프로젝트 구조)

```text
webMobile-todo/
 ├── app/                      # Expo Router 기반 앱 스크린
 │    ├── (tabs)/              # 메인 탭 화면
 │    │    ├── index.tsx       # 메인 Todo 리스트 & 대시보드 화면
 │    │    ├── settings.tsx    # 앱 설정 및 테마 전환 화면
 │    │    └── _layout.tsx     # 탭 바 레이아웃 및 스타일 설정
 │    └── _layout.tsx          # 루트 레이아웃 & Convex Provider 설정
 ├── components/               # 재사용 가능한 UI 컴포넌트
 │    ├── Header.tsx           # 상단 헤더 컴포넌트
 │    ├── StatsCard.tsx        # 통계 및 진행률 카드
 │    ├── TodoInput.tsx        # 할 일 입력 필드
 │    ├── FilterSection.tsx    # 필터 & 검색 섹션
 │    ├── TodoItem.tsx         # 할 일 리스트 아이템
 │    ├── EditTodoModal.tsx    # 할 일 수정 팝업 모달
 │    └── EmptyState.tsx       # 데이터가 없을 때의 안내 화면
 ├── convex/                   # Convex 백엔드 스키마 및 함수
 │    ├── schema.ts            # Todo 데이터베이스 스키마 정의
 │    └── todos.ts             # CRUD 쿼리 및 뮤테이션 (get, add, toggle, delete, update)
 ├── hooks/                    # 커스텀 훅
 │    ├── useFilteredTodos.ts  # 검색 및 필터링 로직
 │    └── useTheme.tsx         # 다크/라이트 테마 관리 훅
 ├── lib/                      # 유틸리티 및 설정
 └── package.json              # 프로젝트 의존성 관리
```

---

## 🚀 Quick Start (시작하기)

### 1. 프로젝트 클론 및 의존성 설치

```bash
git clone <repository-url>
cd webMobile-todo
npm install
```

### 2. 환경 변수 (.env.local) 설정

프로젝트 루트 디렉터리에 `.env.local` 파일을 생성하고 Convex 관련 환경 변수를 입력합니다.

```env
CONVEX_DEPLOYMENT=dev:your-deployment-name
EXPO_PUBLIC_CONVEX_URL=https://your-convex-deployment.convex.cloud
```

### 3. Convex 개발 서버 실행

```bash
npx convex dev
```

### 4. Expo 앱 실행

새로운 터미널 창을 열어 Expo 개발 서버를 실행합니다.

```bash
npx expo start
```

- **iOS 개발 빌드 / 시뮬레이터**: 터미널에서 `i` 키 누르기
- **Android 에뮬레이터**: 터미널에서 `a` 키 누르기
- **Web 브라우저 실행**: 터미널에서 `w` 키 누르기

---

## 🧪 Verification & Linting (검증)

프로젝트 코드 스타일 및 Lint 상태 검증:

```bash
npm run lint
```

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
