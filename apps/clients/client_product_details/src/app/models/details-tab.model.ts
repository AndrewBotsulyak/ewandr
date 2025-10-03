
export enum DetailsTab {
  DESCRIPTION,
  SPECIFICATIONS,
  REVIEWS
}

export interface DetailsTabDataI {
  type: DetailsTab;
  label: string;
}
