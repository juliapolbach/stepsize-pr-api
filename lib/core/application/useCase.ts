export interface UseCase<Input, Output> {
  exec(input: Input | null): Output
}
