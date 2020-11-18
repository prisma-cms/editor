import { DraftBlockRenderMap, DraftDecorator, EditorState, RawDraftContentState } from 'draft-js'
import React from 'react'

export * from 'draft-js';

/**
 * Strings not allowed due key generation
 */
export type PrismaCmsEditorRawContent = RawDraftContentState

export interface PrismaCmsEditorProps {
  /**
   * In SSR mode should not be typeof string due error document undefined
   */
  // value: PrismaCmsEditorRawContent | string | undefined
  // TODO: add custom scalar to API in front component
  value: Record<string, any> | Array<any> | null | undefined

  /**
   * Prevent edit content. Default true
   */
  readOnly?: boolean

  onChange?(content: PrismaCmsEditorRawContent, editorState: EditorState): any

  // Обязательно надо передавать какой-то статический ключ, например editor
  // иначе будет каждый раз генерироваться новый и реакт будет ругаться,
  // что атрибут data-editor серверный и клиентский не совпадают
  editorKey: string

  /**
   * Передаем next/link
   */
  LinkComponent?: React.ReactNode

  className?: string

  decorators?: DraftDecorator[]

  defaultBlockRenderMap?: boolean

  plugins?: any[]

  blockRenderMap?: DraftBlockRenderMap

  classes?: Record<string, any>

  show_toolbar?: boolean
}

export interface PrismaCmsEditorState {
  editorState: EditorState

  rawContent: PrismaCmsEditorRawContent

  liveTeXEdits: any

  inEditBlocksCount: number

  /**
   * If no value and in SSR mode, render after delay
   */
  allowRender: boolean

  blockRenderMap: DraftBlockRenderMap;
}
