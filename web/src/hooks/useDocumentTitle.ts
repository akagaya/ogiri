import { useEffect } from 'react';

const APP_NAME = '大喜利ひろば';

/**
 * ページごとにdocument.titleを設定するフック。
 * アンマウント時にデフォルトのアプリ名に復帰する。
 *
 * @param title - ページ固有のタイトル。nullish の場合はアプリ名のみ表示。
 */
export function useDocumentTitle(title?: string | null) {
  useEffect(() => {
    document.title = title ? `${title} - ${APP_NAME}` : APP_NAME;

    return () => {
      document.title = APP_NAME;
    };
  }, [title]);
}
