import { EditorType } from '#/adapter/component/Editor';

export interface PublishProps {
  id?: number;
  title: string;
  content: string;
  lang: string;
  editorType: EditorType;
}
