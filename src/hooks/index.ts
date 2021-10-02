import { useCallback, useMemo, useState } from "react"

export const useDialog = <T = any>(initialIsOpen: boolean = false) => {
   const [data, setData] = useState<T | undefined>()
   const [isOpen, setIsOpen] = useState(initialIsOpen)
   const open = useCallback(
      (data?: T) => {
         setIsOpen(true)
         setData(data)
      },
      [setIsOpen]
   )
   const close = useCallback(() => {
      setIsOpen(false)
   }, [setIsOpen])
   const reset = useCallback(() => {
      setIsOpen(false)
      setData(undefined)
   }, [setIsOpen, setData])
   return useMemo(
      () => ({ isOpen, data, open, close, reset }),
      [isOpen, data, open, close, reset]
   )
}

export const useDraftInput = (
   initialValue: string,
   mutateOnConfirm: (value: string) => string
) => {
   const [prev, setPrev] = useState(initialValue)
   const [draft, setDraft] = useState(initialValue)
   const confirm = useCallback(
      () => setPrev(mutateOnConfirm(draft)),
      [draft, mutateOnConfirm, setPrev]
   )
   const discard = useCallback(() => setDraft(prev), [prev, setDraft])
   return [draft, setDraft, confirm, discard, prev]
}

export const useDraftForm = <T extends {}>(initialState?: T | (() => T)) => {
   const [prev, setPrev] = useState(initialState)
   const [draft, setDraft] = useState(initialState)
   const setEntity = useCallback(
      <K extends keyof T>(key: K, value: T[K]) =>
         setDraft((prevState) => prevState && { ...prevState, [key]: value }),
      [setDraft]
   )
   const confirm = useCallback(() => setPrev(draft), [draft, setPrev])
   const discard = useCallback(() => setDraft(prev), [prev, setDraft])
   const reset = useCallback(
      (state?: T) => {
         setPrev(state)
         setDraft(state)
      },
      [setPrev, setDraft]
   )
   return useMemo(
      () => ({
         draft,
         setEntity,
         confirm,
         discard,
         reset,
         prev,
      }),
      [draft, setEntity, confirm, discard, reset, prev]
   )
}
