import { createAction, ActionType, createReducer } from 'typesafe-actions';

// 1-1. 기존 액션 type 선언 방법
// const INCREASE = "counter/INCREASE" as const;
// const DECREASE = "counter/DECREASE" as const;
// const INCREASE_BY = "counter/INCREASE_BY" as const;
// ----- 1-2. 액션 type 선언 방법 리팩토링
const INCREASE = 'counter/INCREASE'; // typesafe-actions를 사용하면 as const를 붙일 필요 없음.
const DECREASE = 'counter/DECREASE';
const INCREASE_BY = 'counter/INCREASE_BY';

// 2-1. 기존 액션 생성 함수 만드는 방법
// export const increase = () => ({ type: INCREASE });
// export const decrease = () => ({ type: DECREASE });
// export const increaseBy = (diff: number) => ({
//   type: INCREASE_BY,
//   payload: diff
// });
// 2-2. 액션 생성 함수 만드는 방법 리팩토링
export const increase = createAction(INCREASE)();
export const decrease = createAction(DECREASE)();
export const increaseBy = createAction(INCREASE_BY)<number>(); // payload로 들어가는 값은 Generic을 사용하여 정해줄 수 있으며, 만약 액션의 페이로드에 아무것도 필요 없다면 Generic을 생략하시면 된다.

// 가끔씩은 다음과 같이 액션 생성 함수로 파라미터로 넣어주는 값과 액션의 payload 값이 완벽히 일치하지 않을 때가 있다.
// const createItem = (name: string) => ({ type: CREATE_ITEM, payload: { id: nanoid(), name } });
// 위 코드 처럼, id값을 nanoid같은 라이브러리를 사용하여 고유 값을 생성하여 넣어주고 싶을 때도 있다. 그럴 때에는 코드를 다음과 같이 작성하면 된다.
// const createItem = createAction(CREATE_ITEM).map(name => ({ payload: { id: nanoid(), name } }));

// 3-1 기존 액션의 객체 타입 만드는 방법
// type CounterAction =
//   | ReturnType<typeof increase>
//   | ReturnType<typeof decrease>
//   | ReturnType<typeof increaseBy>;
// 3-2 액션의 객체 타입 만드는 방법 리팩토링
const actions = { increase, decrease, increaseBy };
type CounterAction = ActionType<typeof actions>;


type CounterState = {
  count: number;
}

const initialState: CounterState = {
  count: 0
};

// 4-1 기존 리듀서 만드는 방법
// function counter(state: CounterState = initialState, action: CounterAction) {
//   switch (action.type) {
//     case INCREASE:
//       return { count: state.count + 1 };
//     case DECREASE:
//       return { count: state.count - 1 };
//     case INCREASE_BY:
//       return { count: state.count + action.payload };
//     default:
//       return state;
//   }
// }
// 4-2 리듀서 만드는 방법 리팩토링
const counter = createReducer<CounterState, CounterAction>(initialState, {
  [INCREASE]: state => ({ count: state.count + 1 }),
  [DECREASE]: state => ({ count: state.count - 1 }),
  [INCREASE_BY]: (state, action) => ({ count: state.count + action.payload })
})

export default counter;