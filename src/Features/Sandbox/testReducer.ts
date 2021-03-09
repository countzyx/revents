export type TestState = {
  data: number;
};

const initialState: TestState = {
  data: 42,
};

const reducer = (state: TestState = initialState): TestState => {
  return state;
};

export default reducer;
