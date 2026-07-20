export interface PodfileMutationResult {
    contents: string;
    changed: boolean;
    missingAnchors: string[];
}
declare const mutatePodfileForFreeraspSpm: (contents: string, enabled?: boolean) => PodfileMutationResult;
export default mutatePodfileForFreeraspSpm;
