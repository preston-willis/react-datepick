export interface DateRangeUI {
  dateTextContent: string[];
  dateError: boolean[];
  timeTextContent: string[];
  timeError: boolean[];
}

export interface DropdownData {
  termAnchorEl: any;
  intervalAnchorEl: any;
  setTermAnchorEl: any;
  setIntervalAnchorEl: any;
  quickSelectContent: number[];
  relativeSelectContent: number[];
}

export interface RefreshData {
  refreshInterval: number;
  refreshIntervalEnabled: boolean;
  refreshIntervalUnits: string;
}

export interface BodyConfig {
  propertySelected: number;
  daysInMonth: number[];
  tabSelected: number;
  bodySubTabIndex: number;
}

export const dropdownData: DropdownData = {
  termAnchorEl: null,
  intervalAnchorEl: null,
  setTermAnchorEl: null,
  setIntervalAnchorEl: null,
  quickSelectContent: [-1, 60000],
  relativeSelectContent: [-1, 60000],
};

export const uiData: DateRangeUI = {
  dateTextContent: [],
  dateError: [false, false],
  timeTextContent: [],
  timeError: [false, false],
};

export const refreshData: RefreshData = {
  refreshIntervalUnits: "Minutes",
  refreshInterval: -1,
  refreshIntervalEnabled: false,
};

export const bodyConfig: BodyConfig = {
  propertySelected: -1,
  daysInMonth: [
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate(),
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate(),
  ],
  tabSelected: -1,
  bodySubTabIndex: 0,
};
