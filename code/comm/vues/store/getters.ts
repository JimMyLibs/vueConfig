import { StateType } from "./StateType";
import { GetterTree } from "vuex";

export const getters: GetterTree<StateType, any> = {
  loadingStatus: ({ loadingNum }: StateType) => {
    if (loadingNum > 0) {
      return 1
    } else {
      return 0
    }
  }
};
