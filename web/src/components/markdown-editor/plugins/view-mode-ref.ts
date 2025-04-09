import { realmPlugin, ViewMode, viewMode$ } from '@mdxeditor/editor';
import { MutableRefObject } from 'react';

export interface ViewModeRef {
  getViewMode: () => void;
  setViewMode: (viewMode: ViewMode) => void;
}

export const viewModeRefPlugin = realmPlugin<{
  ref?: MutableRefObject<ViewModeRef | undefined>;
}>({
  init(realm, params) {
    if (params.ref) {
      params.ref.current = {
        getViewMode: () => {
          return realm.getValue(viewMode$);
        },
        setViewMode: (viewMode) => {
          realm.pub(viewMode$, viewMode);
        },
      } satisfies ViewModeRef;
    }
  },
});

export default viewModeRefPlugin;
