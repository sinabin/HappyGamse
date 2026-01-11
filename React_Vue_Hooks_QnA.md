# React & Vue Hooks 질문-답변

## Q1. MyPage.jsx에서 useEffect 훅을 사용하잖아? 왜 이러한 API 호출시 useEffect 훅을 사용하는거야?

### useEffect를 API 호출에 사용하는 이유

`MyPage.jsx:13-19`에서 `useEffect`를 사용하는 이유는 **컴포넌트 생명주기와 부수 효과(Side Effect) 관리** 때문입니다.

### 1. 부수 효과(Side Effect)란?
React 컴포넌트의 주요 역할은 UI를 렌더링하는 것입니다. 하지만 API 호출은 렌더링과 무관한 **외부 시스템과의 상호작용**이므로 "부수 효과"입니다.

### 2. 왜 useEffect 안에서 호출하나요?

```jsx
useEffect(() => {
    const fetchMypage = async () => {
        const response = await axiosInstance.post('/user/myPage', {});
        setUnserInfo(response.data);
    }
    fetchMypage();
}, []);  // 빈 배열 = 마운트 시 1회만 실행
```

**직접 컴포넌트 본문에서 호출하면 안 되는 이유:**
- 컴포넌트는 렌더링마다 함수 본문이 실행됨
- `setState`가 호출되면 → 재렌더링 → 또 API 호출 → 또 setState → **무한 루프 발생**

### 3. 의존성 배열 `[]`의 역할
- `[]` (빈 배열): 컴포넌트가 **처음 마운트될 때 1번만** 실행
- 이렇게 하면 MyPage가 화면에 처음 나타날 때 사용자 정보를 한 번만 가져옴

### 요약
| 방식 | 결과 |
|------|------|
| 컴포넌트 본문에 직접 호출 | 무한 루프 |
| useEffect + `[]` | 마운트 시 1회만 실행 ✓ |
| useEffect + `[dependency]` | dependency 변경 시마다 실행 |

`useEffect`는 "이 코드는 렌더링이 아니라 **컴포넌트가 화면에 나타난 후**에 실행해줘"라고 React에게 알려주는 역할을 합니다.

---

## Q2. 그러니까 useEffect는 컴포넌트가 렌더링을 끝난 이후 실행해줘 라고 알려주는 역할이네?

맞습니다! 정확히 이해하셨습니다.

### useEffect 실행 타이밍

```
컴포넌트 함수 실행 → JSX 반환 → DOM 업데이트 → 화면 페인트 → useEffect 실행
```

### 왜 이렇게 설계했을까?

1. **렌더링 차단 방지**: API 호출 같은 느린 작업이 화면 표시를 막지 않음
2. **DOM 접근 가능**: 렌더링 후 실행되므로 실제 DOM 요소에 접근 가능
3. **일관성**: 항상 최신 렌더링 결과를 기반으로 부수 효과 실행

### 간단히 비유하면

```
"일단 화면 먼저 그려놓고, 그 다음에 이 작업 해줘"
```

그래서 MyPage에서 처음에 `userInfo`가 빈 문자열이라 잠깐 비어보이다가, API 응답이 오면 사용자 정보가 채워지는 것입니다.

---

## Q3. Vue에서는 그걸 watch라는걸로 하는거고?

비슷하지만 정확히 같지는 않습니다.

### Vue vs React 비교

| React | Vue | 용도 |
|-------|-----|------|
| `useEffect(() => {}, [])` | `onMounted()` | 마운트 시 1회 실행 |
| `useEffect(() => {}, [dep])` | `watch(dep, ...)` | 특정 값 변경 감지 |
| `useEffect` (자동 추적) | `watchEffect()` | 의존성 자동 추적 |

### 예시 비교

**React - 마운트 시 API 호출:**
```jsx
useEffect(() => {
    fetchData();
}, []);
```

**Vue - 마운트 시 API 호출:**
```js
onMounted(() => {
    fetchData();
});
```

**React - 특정 값 변경 감지:**
```jsx
useEffect(() => {
    console.log('userId 변경됨');
}, [userId]);
```

**Vue - 특정 값 변경 감지:**
```js
watch(userId, (newVal, oldVal) => {
    console.log('userId 변경됨');
});
```

### 정리

- Vue의 `watch`는 **특정 데이터 변경 감지**에 특화
- React의 `useEffect`는 **라이프사이클 + 변경 감지**를 하나로 합친 것

React는 `useEffect` 하나로 여러 역할을 하고, Vue는 `onMounted`, `watch`, `watchEffect` 등으로 역할이 분리되어 있습니다.

---

## Q4. watchEffect() 라는것도있어?

네, Vue 3에서 추가되었습니다.

### watchEffect vs watch

**watch** - 의존성을 명시적으로 지정:
```js
const count = ref(0);

watch(count, (newVal) => {
    console.log(`count가 ${newVal}로 변경됨`);
});
```

**watchEffect** - 의존성 자동 추적:
```js
const count = ref(0);
const name = ref('홍길동');

watchEffect(() => {
    console.log(`count: ${count.value}, name: ${name.value}`);
    // count나 name 중 하나라도 바뀌면 자동 실행
});
```

### 특징 비교

| | watch | watchEffect |
|---|-------|-------------|
| 의존성 지정 | 수동 | 자동 (내부에서 사용한 것 추적) |
| 이전 값 접근 | 가능 (`oldVal`) | 불가능 |
| 즉시 실행 | 기본 X | 기본 O (선언 시 바로 1회 실행) |

### React와 비교하면

`watchEffect`가 사실 React의 `useEffect`와 가장 비슷합니다:

```jsx
// React - 의존성 배열에 명시
useEffect(() => {
    console.log(count, name);
}, [count, name]);
```

```js
// Vue - 자동 추적
watchEffect(() => {
    console.log(count.value, name.value);
});
```

다만 React는 의존성 배열을 직접 써줘야 하고, Vue의 `watchEffect`는 코드 내에서 사용한 반응형 데이터를 자동으로 감지합니다.

---

## Q5. watchEffect는 코드 내에서 사용한 반응형 데이터라는게 뭔데?

Vue에서 `ref()`나 `reactive()`로 선언한 데이터를 말합니다.

### 반응형 데이터 vs 일반 데이터

```js
// 반응형 데이터 - Vue가 변경을 감지함
const count = ref(0);
const user = reactive({ name: '홍길동', age: 25 });

// 일반 데이터 - Vue가 변경을 감지 못함
let normalCount = 0;
```

### watchEffect가 추적하는 방식

```js
const count = ref(0);
const name = ref('홍길동');
const unused = ref('사용안함');

watchEffect(() => {
    console.log(count.value);  // count 추적 O
    console.log(name.value);   // name 추적 O
    // unused는 여기서 안 썼으므로 추적 X
});
```

Vue가 내부적으로 "이 함수 실행할 때 어떤 `.value`에 접근했지?" 를 기록해둡니다.

### React와의 차이

**React** - 개발자가 직접 의존성 명시:
```jsx
useEffect(() => {
    console.log(count);
}, [count]);  // 깜빡하면 버그 발생
```

**Vue** - 자동 추적:
```js
watchEffect(() => {
    console.log(count.value);  // 자동으로 count 변경 감지
});
```

Vue는 반응형 시스템이 `.value` 접근을 가로채서 "아, 이 함수는 count에 의존하는구나"를 알아내는 방식입니다. 그래서 의존성 배열을 안 써도 됩니다.

---

## Q6. 아 React에서 useState로 선언한 변수랑 같은거구나?

맞습니다! 같은 역할입니다.

### React vs Vue 상태 선언

```jsx
// React
const [count, setCount] = useState(0);

// 값 읽기: count
// 값 변경: setCount(1)
```

```js
// Vue
const count = ref(0);

// 값 읽기: count.value
// 값 변경: count.value = 1
```

### 공통점

- 둘 다 값이 변경되면 → 화면 자동 재렌더링
- 일반 변수로 선언하면 변경해도 화면이 안 바뀜

### 차이점

| | React `useState` | Vue `ref` |
|---|------------------|-----------|
| 값 접근 | `count` | `count.value` |
| 값 변경 | `setCount(1)` | `count.value = 1` |
| 변경 방식 | setter 함수 필수 | 직접 대입 가능 |

Vue는 `.value`를 붙여야 하는 게 번거롭지만, 대신 직접 대입으로 값을 바꿀 수 있어서 코드가 직관적입니다.

---

## Q7. reactive()는 뭐가 달라?

`ref()`는 모든 타입, `reactive()`는 객체 전용입니다.

### 비교

```js
// ref - 모든 타입 가능
const count = ref(0);
const name = ref('홍길동');
const user = ref({ name: '홍길동', age: 25 });

console.log(count.value);       // 0
console.log(user.value.name);   // '홍길동'
```

```js
// reactive - 객체만 가능
const user = reactive({ name: '홍길동', age: 25 });

console.log(user.name);  // '홍길동' (.value 불필요)
```

### 핵심 차이

| | ref() | reactive() |
|---|-------|------------|
| 사용 가능 타입 | 숫자, 문자열, 객체 등 전부 | 객체, 배열만 |
| 값 접근 | `.value` 필요 | `.value` 불필요 |
| 재할당 | 가능 | 불가능 |

### 재할당 문제

```js
// ref - 재할당 OK
const user = ref({ name: '홍길동' });
user.value = { name: '김철수' };  // 정상 작동

// reactive - 재할당 X
let user = reactive({ name: '홍길동' });
user = { name: '김철수' };  // 반응성 깨짐!
```

### 결론

실무에서는 **`ref()`를 주로 사용**합니다. 일관성 있고 재할당도 자유롭기 때문입니다. `reactive()`는 복잡한 객체 상태를 `.value` 없이 깔끔하게 쓰고 싶을 때 가끔 사용합니다.

---

## Q8. user = { name: '김철수' };  // 반응성 깨짐! 이라고 했는데 반응성이 깨진다는게 뭔말이야?

값을 바꿔도 화면이 안 바뀐다는 뜻입니다.

### 반응성이 유지될 때

```js
const user = reactive({ name: '홍길동' });

// 속성만 변경 - 반응성 유지 O
user.name = '김철수';  // 화면 자동 업데이트 됨
```

### 반응성이 깨질 때

```js
let user = reactive({ name: '홍길동' });

// 객체 자체를 재할당 - 반응성 깨짐 X
user = { name: '김철수' };  // 화면 안 바뀜!
```

### 왜 이런 일이 생기나?

```js
let user = reactive({ name: '홍길동' });
//    ↑
//    Vue가 이 객체를 감시 중

user = { name: '김철수' };
//    ↑
//    새로운 일반 객체로 교체됨
//    Vue는 여전히 옛날 객체를 감시 중
//    새 객체는 감시 대상이 아님
```

Vue가 처음 `reactive()`로 만든 객체를 감시하고 있는데, 변수에 새 객체를 넣어버리면 Vue는 그걸 모릅니다. Vue는 아직도 버려진 옛날 객체를 쳐다보고 있는 상황입니다.

### ref()는 왜 괜찮나?

```js
const user = ref({ name: '홍길동' });

user.value = { name: '김철수' };  // OK!
//    ↑
//    Vue가 .value 변경을 감지함
```

`ref()`는 `.value`라는 통로를 통해서만 값을 바꾸기 때문에 Vue가 항상 변경을 감지할 수 있습니다.

---

## Q9. reactive()는 복잡한 객체 상태를 .value 없이 깔끔하게 쓰고 싶을 때 가 왜 있는거야?

중첩된 객체를 다룰 때 `.value`가 계속 붙으면 코드가 지저분해지기 때문입니다.

### 예시: 복잡한 폼 상태

**ref() 사용 시:**
```js
const form = ref({
    user: {
        name: '홍길동',
        address: {
            city: '서울',
            zip: '12345'
        }
    },
    settings: {
        theme: 'dark',
        notifications: true
    }
});

// 값 접근할 때마다 .value 필요
form.value.user.name = '김철수';
form.value.user.address.city = '부산';
form.value.settings.theme = 'light';
console.log(form.value.user.address.zip);
```

**reactive() 사용 시:**
```js
const form = reactive({
    user: {
        name: '홍길동',
        address: {
            city: '서울',
            zip: '12345'
        }
    },
    settings: {
        theme: 'dark',
        notifications: true
    }
});

// 그냥 일반 객체처럼 사용
form.user.name = '김철수';
form.user.address.city = '부산';
form.settings.theme = 'light';
console.log(form.user.address.zip);
```

### 한눈에 비교

```js
// ref - .value가 계속 붙음
form.value.user.address.city

// reactive - 깔끔함
form.user.address.city
```

### 결론

- 단순한 값 (숫자, 문자열, 단순 객체) → `ref()` 권장
- 깊게 중첩된 복잡한 객체 → `reactive()`가 편할 수 있음

다만 재할당 문제 때문에 실무에서는 그냥 `ref()`로 통일하는 경우가 많습니다.

---

## Q10. reactive를 사용하면 반응형이 깨진다며 그런데도 사용해?

좋은 질문입니다! **재할당만 안 하면** 반응성이 안 깨집니다.

### 반응성이 깨지는 경우 vs 안 깨지는 경우

```js
const form = reactive({
    name: '홍길동',
    age: 25
});

// 속성 변경 - 반응성 유지 O
form.name = '김철수';
form.age = 30;

// 객체 재할당 - 반응성 깨짐 X
form = { name: '이영희', age: 28 };  // 이러면 안 됨!
```

### 그래서 언제 써도 되나?

| 상황 | reactive 사용 가능? |
|------|-------------------|
| 속성만 수정하는 경우 | O |
| 객체 전체를 교체해야 하는 경우 | X |

### 실제 사용 예시

**안전한 경우 - 폼 입력:**
```js
const form = reactive({
    email: '',
    password: ''
});

// 사용자가 입력할 때 속성만 변경
form.email = 'test@example.com';  // OK
form.password = '1234';           // OK
```

**위험한 경우 - API 응답으로 교체:**
```js
const user = reactive({ name: '' });

// API에서 받은 데이터로 교체하고 싶을 때
const response = await axios.get('/user');
user = response.data;  // 반응성 깨짐!

// 이럴 땐 ref를 써야 함
const user = ref({ name: '' });
user.value = response.data;  // OK
```

### 결론

- 객체를 **통째로 교체할 일이 없으면** → `reactive()` 써도 됨
- 객체를 **통째로 교체할 가능성이 있으면** → `ref()` 사용

그래서 "이 객체는 절대 재할당 안 해" 라고 확신할 때만 `reactive()`를 씁니다.

---

## Q11. 그럼 사용자가 입력하는 값은 보통 reactive를 사용해서 편리성을 높이고 API로 응답받는 데이터를 보통 ref를 쓰겠구나

맞습니다! 정확히 이해하셨습니다.

### 실무 패턴 요약

```js
// 폼 입력값 - reactive (속성만 변경됨)
const form = reactive({
    email: '',
    password: '',
    name: ''
});

// API 응답 데이터 - ref (통째로 교체됨)
const userList = ref([]);
const userDetail = ref(null);

// API 호출
const fetchUsers = async () => {
    const response = await axios.get('/users');
    userList.value = response.data;  // 통째로 교체
};
```

### 한눈에 정리

| 데이터 성격 | 권장 방식 | 이유 |
|------------|----------|------|
| 폼 입력값 | `reactive()` | 속성만 바뀜, `.value` 없이 깔끔 |
| API 응답 | `ref()` | 데이터 통째로 교체 필요 |
| 단순 값 (숫자, 문자열) | `ref()` | reactive는 객체만 가능 |

### 그런데 실제로는...

사실 많은 팀에서 **그냥 전부 `ref()`로 통일**합니다:

```js
// 고민 없이 전부 ref
const form = ref({ email: '', password: '' });
const userList = ref([]);
```

이유:
- 규칙이 단순해서 실수가 줄어듦
- `.value` 붙이는 게 귀찮아도 일관성이 더 중요
- 나중에 재할당 필요해지면 코드 수정 안 해도 됨

그래서 "reactive가 편한 상황에서만 reactive 쓰고, 애매하면 ref" 정도로 생각하면 됩니다.
