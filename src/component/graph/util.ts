import { Selection } from "d3-selection";

export const validateContainer = (container: Selection<any, any, null, undefined>) => {
    if (container?.empty()) {
        throw Error('A root container is required');
    }
}