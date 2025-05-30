export type TFormItemData = {
  value: string
  trigger: string
  description?: string
}

export type TFormData = {
  id?: string
  name: string
  description?: string
  value: TFormItemData[]
}

export enum EAction {
  FILL = 'fill',
}

export type TAction = {
  action: EAction.FILL
  data?: TFormItemData[]
}

export enum EMode {
  LIST,
  CREATE,
  UPDATE,
}
