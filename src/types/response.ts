export interface ResponseDto<T> {
  success: boolean
  result?: T
  message?: string
}