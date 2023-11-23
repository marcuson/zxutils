export enum SearchBarConfig {
  Hide = 0,
  IconOnly = 1,
  FullBox = 2,
  IconAndLabel = 3,
}

export interface ConfigureTaskbarOptions {
  showWidget?: boolean;
  searchBar?: SearchBarConfig;
}
